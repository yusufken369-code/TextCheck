import AsyncStorage from '@react-native-async-storage/async-storage';
import supabase from './supabaseClient';
import localRulesData from '../../HuquqCheck_warning_rules_10_laws.json';

const CACHE_STORAGE_KEY = '@huquqcheck_warning_rules_cache';
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache TTL

let inMemoryRules = null;
let lastFetchTimestamp = 0;
let isFetchingPromise = null;

/**
 * Convert raw JSON local rules to normalized internal format
 */
function getLocalFallbackRules() {
  if (!localRulesData || !Array.isArray(localRulesData.rules)) {
    return [];
  }
  return localRulesData.rules.map(rule => ({
    id: rule.id,
    category: rule.category || { uz: 'Huquqiy norma', ru: 'Правовая норма', en: 'Legal norm' },
    severity: rule.severity || 'medium',
    trigger_patterns: Array.isArray(rule.trigger_patterns) ? rule.trigger_patterns : [],
    warning: rule.warning || {
      uz: 'Ushbu matn tegishli huquqiy normalarga aloqador bo‘lishi mumkin.',
      ru: 'Этот текст может быть связан с правовыми нормами.',
      en: 'This text may be related to legal provisions.'
    },
    related_laws: Array.isArray(rule.related_laws) ? rule.related_laws : [],
    enabled: true
  }));
}

/**
 * Standardize Supabase database row to internal rule object
 */
function normalizeSupabaseRule(row) {
  let categoryObj = row.category;
  if (typeof categoryObj === 'string') {
    try {
      categoryObj = JSON.parse(categoryObj);
    } catch (e) {
      categoryObj = { uz: row.category, ru: row.category, en: row.category };
    }
  }

  return {
    id: row.id,
    category: categoryObj || { uz: 'Huquqiy norma', ru: 'Правовая норма', en: 'Legal norm' },
    severity: row.severity || 'medium',
    trigger_patterns: Array.isArray(row.trigger_patterns) ? row.trigger_patterns : [],
    warning: {
      uz: row.warning_uz || 'Ushbu matn tegishli huquqiy normalarga aloqador bo‘lishi mumkin.',
      ru: row.warning_ru || 'Этот текст может быть связан с правовыми нормами.',
      en: row.warning_en || 'This text may be related to legal provisions.'
    },
    related_laws: Array.isArray(row.related_laws) ? row.related_laws : [],
    enabled: row.enabled !== false
  };
}

/**
 * Fetch warning rules from Supabase with local & AsyncStorage fallback
 */
export async function fetchWarningRules(forceRefresh = false) {
  const now = Date.now();

  // Return in-memory cache if fresh
  if (!forceRefresh && inMemoryRules && (now - lastFetchTimestamp < CACHE_TTL_MS)) {
    return inMemoryRules;
  }

  // Deduplicate ongoing requests
  if (isFetchingPromise) {
    return isFetchingPromise;
  }

  isFetchingPromise = (async () => {
    try {
      // 1. Try fetching from Supabase
      if (supabase && typeof supabase.from === 'function') {
        const { data, error } = await supabase
          .from('warning_rules')
          .select('*')
          .eq('enabled', true);

        if (!error && Array.isArray(data) && data.length > 0) {
          const rules = data.map(normalizeSupabaseRule);
          inMemoryRules = rules;
          lastFetchTimestamp = now;

          // Persist to AsyncStorage for offline startup
          try {
            if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
              await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify({
                timestamp: now,
                rules: rules
              }));
            }
          } catch (e) {
            // Ignore AsyncStorage errors
          }

          return rules;
        }
      }
    } catch (err) {
      console.warn('WarningRulesService: Supabase fetch error, switching to fallback cache:', err.message);
    }

    // 2. Try loading from AsyncStorage cache if Supabase is offline
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const cachedStr = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
        if (cachedStr) {
          const parsed = JSON.parse(cachedStr);
          if (parsed && Array.isArray(parsed.rules) && parsed.rules.length > 0) {
            inMemoryRules = parsed.rules;
            lastFetchTimestamp = parsed.timestamp || now;
            return inMemoryRules;
          }
        }
      }
    } catch (e) {
      // Ignore AsyncStorage parse errors
    }

    // 3. Fallback to local JSON rules dataset
    const fallbackRules = getLocalFallbackRules();
    inMemoryRules = fallbackRules;
    lastFetchTimestamp = now;
    return fallbackRules;
  })();

  try {
    const result = await isFetchingPromise;
    return result;
  } finally {
    isFetchingPromise = null;
  }
}

/**
 * Synchronously get active rules (or local fallback if not yet initialized)
 */
export function getActiveRules() {
  if (inMemoryRules && inMemoryRules.length > 0) {
    return inMemoryRules;
  }
  return getLocalFallbackRules();
}

/**
 * Text normalization for matching
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[‘’`ʻ]/g, "'")
    .replace(/[.,\/#!$%\^&\*;:{}=\-_~()?"–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Helper to get normalized language code ('uz', 'ru', 'en')
 */
export function normalizeLanguage(lang) {
  if (!lang) return 'uz';
  const l = String(lang).toLowerCase();
  if (l.startsWith('ru') || l === 'рус') return 'ru';
  if (l.startsWith('en') || l === 'eng') return 'en';
  return 'uz';
}

/**
 * False Positive Prevention Logic:
 * Checks whether a match on common isolated words ('bola', 'reklama', 'pasport', 'ma'lumot', 'urish')
 * should trigger or be filtered out as benign everyday conversation.
 */
function isFalsePositiveMatch(text, pattern, rule) {
  const normText = normalizeText(text);
  const words = normText.split(/\s+/);
  const commonIsolatedWords = ['bola', 'reklama', 'pasport', 'ma’lumot', 'ma\'lumot', 'urish'];

  if (!commonIsolatedWords.includes(pattern)) {
    return false; // Not a common isolated word, so valid match
  }

  // If pattern is 'bola': filter out benign usage like "mening bolam bor", "bola kelyapti"
  if (pattern === 'bola') {
    const harmfulBolaWords = ['zarar', 'majbur', 'zo‘ravonlik', 'zo\'ravonlik', 'tazyiq', 'qiynash', 'kaltaklash', 'o‘ldirish', 'o\'ldirish', 'jinsiy'];
    const hasHarmfulContext = harmfulBolaWords.some(w => normText.includes(w));
    if (!hasHarmfulContext) {
      return true; // False positive! Skip warning
    }
  }

  // If pattern is 'reklama': filter out benign statements like "reklama ko'rdim", "bu reklama emas"
  if (pattern === 'reklama') {
    const advertisingContext = ['qilaman', 'joylashtirish', 'noqonuniy', 'taqiqlangan', 'aksiya', 'chegirma'];
    const hasAdvertisingContext = advertisingContext.some(w => normText.includes(w));
    if (!hasAdvertisingContext) {
      return true; // False positive! Skip warning
    }
  }

  // If pattern is 'pasport': filter out benign questions like "pasport qaerda", "pasport bor"
  if (pattern === 'pasport') {
    const disclosureContext = ['oshkor', 'tarqataman', 'tarqatish', 'shaxsga doir', 'surati', 'nusxasi', 'raqami', 'sotaman'];
    const hasDisclosureContext = disclosureContext.some(w => normText.includes(w));
    if (!hasDisclosureContext) {
      return true; // False positive! Skip warning
    }
  }

  // If pattern is 'ma'lumot' / 'ma’lumot': filter out benign usage like "ma'lumot uchun raxmat"
  if (pattern === 'ma’lumot' || pattern === 'ma\'lumot') {
    const personalDataContext = ['shaxsga doir', 'shaxsiy', 'oshkor', 'tarqataman', 'maxfiy', 'og\'irlash'];
    const hasPersonalContext = personalDataContext.some(w => normText.includes(w));
    if (!hasPersonalContext) {
      return true; // False positive! Skip warning
    }
  }

  // If pattern is 'urish': filter out benign usage like "zang urish", "qo'ng'iroq urish"
  if (pattern === 'urish') {
    const violenceContext = ['kaltaklash', 'qiynash', 'zo‘ravonlik', 'zo\'ravonlik', 'tepish', 'mayib', 'jarohat'];
    const hasViolenceContext = violenceContext.some(w => normText.includes(w));
    if (!hasViolenceContext) {
      return true; // False positive! Skip warning
    }
  }

  return false;
}

/**
 * Core Warning Rules Analysis Engine
 * Evaluates input text against loaded rules, respecting chosen language and legal neutrality rules.
 */
export function analyzeTextWithRules(text, langInput = 'uz') {
  const lang = normalizeLanguage(langInput);
  const normalized = normalizeText(text);

  if (!normalized || normalized.length < 3) {
    return {
      hasMatch: false,
      warningText: lang === 'ru' ? 'Правовая норма не обнаружена.' : (lang === 'en' ? 'No legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
    };
  }

  const rules = getActiveRules();

  for (const rule of rules) {
    if (rule.enabled === false) continue;

    const patterns = Array.isArray(rule.trigger_patterns) ? rule.trigger_patterns : [];

    // Sort patterns: multi-word phrases first to prioritize specific contextual matches
    const sortedPatterns = [...patterns].sort((a, b) => b.length - a.length);

    for (const pattern of sortedPatterns) {
      const normPattern = normalizeText(pattern);
      if (!normPattern) continue;

      if (normalized.includes(normPattern)) {
        // Check for false positive benign usage
        if (isFalsePositiveMatch(text, normPattern, rule)) {
          continue;
        }

        // Selected language localized warning text & category
        const warningText = (rule.warning && rule.warning[lang])
          ? rule.warning[lang]
          : (rule.warning_uz || rule.warning?.uz || 'Ushbu matn tegishli huquqiy normalarga aloqador bo‘lishi mumkin.');

        const categoryText = (rule.category && rule.category[lang])
          ? rule.category[lang]
          : (rule.category?.uz || 'Huquqiy norma');

        const relatedLaws = Array.isArray(rule.related_laws) ? rule.related_laws : [];
        const lawsFormatted = relatedLaws.length > 0 ? relatedLaws.join(', ') : 'O‘zbekiston Respublikasi qonunchiligi';

        // Clean neutral warning titles according to language
        let warningTitle = '⚖️ Huquqiy ogohlantirish';
        let penaltyLabelText = `Tegishli qonunlar: ${lawsFormatted}`;

        if (lang === 'ru') {
          warningTitle = '⚖️ Правовое предупреждение';
          penaltyLabelText = `Соответствующие законы: ${lawsFormatted}`;
        } else if (lang === 'en') {
          warningTitle = '⚖️ Legal Warning';
          penaltyLabelText = `Applicable laws: ${lawsFormatted}`;
        }

        return {
          hasMatch: true,
          ruleId: rule.id,
          severity: rule.severity,
          warningTitle: warningTitle,
          warningText: warningText,
          highlightedWord: pattern,
          category: categoryText,
          penaltyText: penaltyLabelText,
          documentTitle: `${categoryText}`,
          articleNumber: lawsFormatted,
          relatedLaws: relatedLaws,
          lexUrl: 'https://lex.uz'
        };
      }
    }
  }

  // 2. Secondary check: Context Rules (signal + action combinations)
  const contextRules = localRulesData.context_rules || [
    {
      id: 'threat_future_action',
      signals: ['seni', 'sizni', 'uni', 'men', 'will', 'я'],
      actions: ['o‘ldir', 'o\'ldir', 'ur', 'kaltakla', 'zarar', 'kill', 'hurt', 'beat', 'удар', 'убь'],
      target_rule_id: 'threat'
    },
    {
      id: 'privacy_distribution',
      signals: ['telefon', 'manzil', 'pasport', 'rasm', 'foto', 'номер', 'адрес', 'паспорт', 'фото'],
      actions: ['tarqat', 'joyla', 'tashla', 'yubor', 'publish', 'share', 'post', 'выложу', 'опубликую'],
      target_rule_id: 'personal_data'
    }
  ];

  for (const ctxRule of contextRules) {
    const hasSignal = ctxRule.signals.some(s => normalized.includes(s.toLowerCase()));
    const matchedAction = ctxRule.actions.find(a => normalized.includes(a.toLowerCase()));
    if (hasSignal && matchedAction) {
      const targetRule = rules.find(r => r.id === ctxRule.target_rule_id) || rules.find(r => r.id === 'threat');
      if (targetRule) {
        const warningText = (targetRule.warning && targetRule.warning[lang])
          ? targetRule.warning[lang]
          : (targetRule.warning_uz || targetRule.warning?.uz || 'Ushbu matn tegishli huquqiy normalarga aloqador bo‘lishi mumkin.');

        const categoryText = (targetRule.category && targetRule.category[lang])
          ? targetRule.category[lang]
          : (targetRule.category?.uz || 'Huquqiy norma');

        const relatedLaws = Array.isArray(targetRule.related_laws) ? targetRule.related_laws : [];
        const lawsFormatted = relatedLaws.length > 0 ? relatedLaws.join(', ') : 'O‘zbekiston Respublikasi qonunchiligi';

        let warningTitle = '⚖️ Huquqiy ogohlantirish';
        let penaltyLabelText = `Tegishli qonunlar: ${lawsFormatted}`;

        if (lang === 'ru') {
          warningTitle = '⚖️ Правовое предупреждение';
          penaltyLabelText = `Соответствующие законы: ${lawsFormatted}`;
        } else if (lang === 'en') {
          warningTitle = '⚖️ Legal Warning';
          penaltyLabelText = `Applicable laws: ${lawsFormatted}`;
        }

        return {
          hasMatch: true,
          ruleId: targetRule.id,
          severity: targetRule.severity || 'high',
          warningTitle: warningTitle,
          warningText: warningText,
          highlightedWord: matchedAction,
          category: categoryText,
          penaltyText: penaltyLabelText,
          documentTitle: `${categoryText}`,
          articleNumber: lawsFormatted,
          relatedLaws: relatedLaws,
          lexUrl: 'https://lex.uz'
        };
      }
    }
  }

  return {
    hasMatch: false,
    warningText: lang === 'ru' ? 'Правовая норма не обнаружена.' : (lang === 'en' ? 'No legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
  };
}

// Auto-initialize warning rules in background
fetchWarningRules().catch(err => console.warn('Background warning rules fetch error:', err));

export default {
  fetchWarningRules,
  getActiveRules,
  analyzeTextWithRules,
  normalizeLanguage
};
