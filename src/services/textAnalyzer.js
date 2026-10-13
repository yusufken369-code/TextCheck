import { analyzeTextWithRules, normalizeLanguage } from './warningRulesService';
import { LEGAL_ARTICLES } from '../database/legalDatabase';

/**
 * Text Normalization Engine
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
 * Real-time Legal Text Analysis Engine
 * Powered by Supabase warning_rules service with offline local fallback.
 * Employs strictly neutral legal wording (Requirement 10).
 */
export function analyzeText(text, lang = 'uz') {
  const normLang = normalizeLanguage(lang);

  // 1. Run warning rules analysis engine
  const ruleResult = analyzeTextWithRules(text, normLang);
  if (ruleResult && ruleResult.hasMatch) {
    // If a specific article in LEGAL_ARTICLES matches, enrich articleId / lexUrl
    const matchedArticle = LEGAL_ARTICLES.find(a => 
      a.id === ruleResult.ruleId || 
      (a.keywords && a.keywords.includes(ruleResult.highlightedWord))
    );

    if (matchedArticle) {
      return {
        ...ruleResult,
        articleId: matchedArticle.id,
        lexUrl: matchedArticle.lexUrl || ruleResult.lexUrl
      };
    }
    return ruleResult;
  }

  // 2. Fallback check against LEGAL_ARTICLES keywords with neutral wording
  if (!text || text.trim().length < 3) {
    return {
      hasMatch: false,
      warningText: normLang === 'ru' ? 'Правовая норма не обнаружена.' : (normLang === 'en' ? 'No legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
    };
  }

  const normalized = normalizeText(text);
  for (const article of LEGAL_ARTICLES) {
    if (Array.isArray(article.keywords)) {
      for (const kw of article.keywords) {
        if (normalized.includes(kw)) {
          let warningTitle = '⚖️ Huquqiy ogohlantirish';
          let warningText = `Ushbu matn «${kw}» iborasi bo‘yicha huquqiy normalarga aloqador bo‘lishi mumkin.`;
          let penaltyText = `Tegishli norma: ${article.documentTitle} (${article.articleNumber})`;

          if (normLang === 'ru') {
            warningTitle = '⚖️ Правовое предупреждение';
            warningText = `Этот текст может быть связан с правовыми нормами по фразе «${kw}».`;
            penaltyText = `Соответствующая норма: ${article.documentTitle} (${article.articleNumber})`;
          } else if (normLang === 'en') {
            warningTitle = '⚖️ Legal Warning';
            warningText = `This text may be related to legal provisions concerning phrase "${kw}".`;
            penaltyText = `Applicable norm: ${article.documentTitle} (${article.articleNumber})`;
          }

          return {
            hasMatch: true,
            articleId: article.id,
            warningTitle,
            highlightedWord: kw,
            warningText,
            penaltyText,
            documentTitle: article.documentTitle,
            articleNumber: article.articleNumber,
            lexUrl: article.lexUrl || 'https://lex.uz'
          };
        }
      }
    }
  }

  return {
    hasMatch: false,
    warningText: normLang === 'ru' ? 'Правовая норма не обнаружена.' : (normLang === 'en' ? 'No legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
  };
}
