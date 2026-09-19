import { LEGAL_ARTICLES, LEGAL_DOCUMENTS } from '../database/legalDatabase';

/**
 * Text Normalization Engine
 */
export function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?'"‘]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Real-time Legal Text Analysis Engine
 * Performs offline local keyword/phrase analysis with Uzbek laws across uz, ru, en.
 */
export function analyzeText(text, lang = 'uz') {
  if (!text || text.trim().length < 3) {
    return {
      hasMatch: false,
      warningText: lang === 'ru' ? 'Правовая норма не обнаружена.' : (lang === 'en' ? 'No specific legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
    };
  }

  const normalized = normalizeText(text);

  // Check for specific strong indicators (insult, defamation, bribe, etc.)
  const isInsult = normalized.includes('haqorat') || 
                   normalized.includes('so\'kish') || 
                   normalized.includes('tahqir') || 
                   normalized.includes('haqorat qilaman') ||
                   normalized.includes('оскорб') ||
                   normalized.includes('оскорблю') ||
                   normalized.includes('insult');

  const isDefamation = normalized.includes('tuhmat') || 
                        normalized.includes('sharmanda') || 
                        normalized.includes('uydirma') || 
                        normalized.includes('bo\'hton') ||
                        normalized.includes('клевет') ||
                        normalized.includes('слухи') ||
                        normalized.includes('defamation');

  const isBribe = normalized.includes('pora') ||
                  normalized.includes('poraxo\'rlik') ||
                  normalized.includes('взятк') ||
                  normalized.includes('bribe');

  const isInternetCrime = (normalized.includes('internet') || normalized.includes('сети') || normalized.includes('tarmoq')) && (isInsult || isDefamation);

  if (isInsult || isInternetCrime) {
    const article = LEGAL_ARTICLES.find(a => a.id === 'mjt-41') || LEGAL_ARTICLES.find(a => a.id === 'mjt-183');
    if (lang === 'ru') {
      return {
        hasMatch: true,
        articleId: article ? article.id : 'mjt-41',
        warningTitle: '🚨 КРАСНОЕ ПРЕДУПРЕЖДЕНИЕ: Запрещенный текст!',
        highlightedWord: 'оскорбление',
        warningText: 'В данном тексте обнаружены признаки оскорбления чести и достоинства гражданина!',
        penaltyText: 'Штраф от 20 до 40 базовых расчетных величин (БРВ).',
        documentTitle: 'Кодекс об административной ответственности',
        articleNumber: 'Статья 41',
        lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#41'
      };
    }
    if (lang === 'en') {
      return {
        hasMatch: true,
        articleId: article ? article.id : 'mjt-41',
        warningTitle: '🚨 RED WARNING: Prohibited Content!',
        highlightedWord: 'insult',
        warningText: 'This text contains statements insulting the honor and dignity of a person!',
        penaltyText: 'Fine from 20 to 40 times the Base Calculation Amount.',
        documentTitle: 'Code of Administrative Responsibility',
        articleNumber: 'Article 41',
        lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#41'
      };
    }
    return {
      hasMatch: true,
      articleId: article ? article.id : 'mjt-41',
      warningTitle: '🚨 QIZIL OGOHLANTIRISH: Taqiq belgilangan!',
      highlightedWord: 'haqoratga',
      warningText: 'Ushbu matnda fuqaroning sha’ni va qadr-qimmatini tahqirlovchi (haqorat) so‘z aniqlandi!',
      penaltyText: article ? article.penaltyText : 'BHMning 20 baravaridan 40 baravarigacha miqdorda jarima solishga sabab bo‘ladi.',
      documentTitle: article ? article.documentTitle : 'Ma’muriy javobgarlik to‘g‘risidagi kodeks',
      articleNumber: article ? article.articleNumber : 'Modda 41',
      lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#41'
    };
  }

  if (isDefamation) {
    const article = LEGAL_ARTICLES.find(a => a.id === 'mjt-40');
    if (lang === 'ru') {
      return {
        hasMatch: true,
        articleId: article ? article.id : 'mjt-40',
        warningTitle: '🚨 КРАСНОЕ ПРЕДУПРЕЖДЕНИЕ: Клевета и ложь!',
        highlightedWord: 'клевета',
        warningText: 'В данном тексте содержатся признаки распространения заведомо ложных сведений (клеветы)!',
        penaltyText: 'Штраф от 20 до 60 базовых расчетных величин (БРВ).',
        documentTitle: 'Кодекс об административной ответственности',
        articleNumber: 'Статья 40',
        lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#40'
      };
    }
    if (lang === 'en') {
      return {
        hasMatch: true,
        articleId: article ? article.id : 'mjt-40',
        warningTitle: '🚨 RED WARNING: Defamation & Slander!',
        highlightedWord: 'defamation',
        warningText: 'This text contains signs of spreading false information (defamation)!',
        penaltyText: 'Fine from 20 to 60 times the Base Calculation Amount.',
        documentTitle: 'Code of Administrative Responsibility',
        articleNumber: 'Article 40',
        lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#40'
      };
    }
    return {
      hasMatch: true,
      articleId: article ? article.id : 'mjt-40',
      warningTitle: '🚨 QIZIL OGOHLANTIRISH: Tuhmat va bo‘hton!',
      highlightedWord: 'tuhmatga',
      warningText: 'Ushbu matnda boshqa shaxsni sharmanda qiluvchi yolg‘on ma’lumot (tuhmat) tarqatish alomatlari bor!',
      penaltyText: article ? article.penaltyText : 'BHMning 20 baravaridan 60 baravarigacha miqdorda jarima solishga sabab bo‘ladi.',
      documentTitle: article ? article.documentTitle : 'Ma’muriy javobgarlik to‘g‘risidagi kodeks',
      articleNumber: article ? article.articleNumber : 'Modda 40',
      lexUrl: article ? article.lexUrl : 'https://lex.uz/docs/97664#40'
    };
  }

  if (isBribe) {
    if (lang === 'ru') {
      return {
        hasMatch: true,
        articleId: 'jk-211',
        warningTitle: '🚨 КРАСНОЕ ПРЕДУПРЕЖДЕНИЕ: Уголовное преступление (Взятка)!',
        highlightedWord: 'взятка',
        warningText: 'Внимание! Дача или получение взятки является тяжелым уголовным преступлением!',
        penaltyText: 'Ограничение свободы от 2 до 5 лет или лишение свободы до 5 лет (Ст. 211 УК РУз).',
        documentTitle: 'Уголовный кодекс Республики Узбекистан',
        articleNumber: 'Статья 211',
        lexUrl: 'https://lex.uz/docs/111453#211'
      };
    }
    if (lang === 'en') {
      return {
        hasMatch: true,
        articleId: 'jk-211',
        warningTitle: '🚨 RED WARNING: Criminal Offense (Bribery)!',
        highlightedWord: 'bribe',
        warningText: 'Warning! Giving or receiving a bribe is a severe criminal offense!',
        penaltyText: 'Restriction of liberty from 2 to 5 years or imprisonment up to 5 years (Art. 211 Criminal Code).',
        documentTitle: 'Criminal Code of the Republic of Uzbekistan',
        articleNumber: 'Article 211',
        lexUrl: 'https://lex.uz/docs/111453#211'
      };
    }
    return {
      hasMatch: true,
      articleId: 'jk-211',
      warningTitle: '🚨 QIZIL OGOHLANTIRISH: Jinoiy javobgarlik (Pora)!',
      highlightedWord: 'pora',
      warningText: 'Diqqat! Pora berish yoki olish og‘ir jinoiy javobgarlikka sabab bo‘ladi!',
      penaltyText: '2 yildan 5 yilgacha ozodlikni cheklash yoki 5 yilgacha ozodlikdan mahrum qilish (JK 211-modda).',
      documentTitle: 'O‘zbekiston Respublikasi Jinoiy kodeksi',
      articleNumber: 'Modda 211',
      lexUrl: 'https://lex.uz/docs/111453#211'
    };
  }

  // General keyword matching against database articles
  for (const article of LEGAL_ARTICLES) {
    for (const kw of article.keywords) {
      if (normalized.includes(kw)) {
        if (lang === 'ru') {
          return {
            hasMatch: true,
            articleId: article.id,
            warningTitle: '🚨 КРАСНОЕ ПРЕДУПРЕЖДЕНИЕ: Юридическая ответственность!',
            highlightedWord: kw,
            warningText: `В этом тексте содержится фраза «${kw}», влекущая административную или уголовную ответственность!`,
            penaltyText: article.penaltyText || 'За запрещенные действия предусмотрено наказание согласно законодательству.',
            documentTitle: article.documentTitle,
            articleNumber: article.articleNumber,
            lexUrl: article.lexUrl
          };
        }
        if (lang === 'en') {
          return {
            hasMatch: true,
            articleId: article.id,
            warningTitle: '🚨 RED WARNING: Legal Liability!',
            highlightedWord: kw,
            warningText: `This text contains phrase «${kw}» subject to legal liability!`,
            penaltyText: article.penaltyText || 'Administrative or criminal penalty applies under the law.',
            documentTitle: article.documentTitle,
            articleNumber: article.articleNumber,
            lexUrl: article.lexUrl
          };
        }
        return {
          hasMatch: true,
          articleId: article.id,
          warningTitle: '🚨 QIZIL OGOHLANTIRISH: Huquqiy javobgarlik!',
          highlightedWord: kw,
          warningText: `Ushbu matnda «${kw}» iborasi bo‘yicha qonuniy ma’muriy yoki jinoiy javobgarlik ko‘zda tutilgan!`,
          penaltyText: article.penaltyText || 'Taqiqlangan harakatlar uchun qonunda belgilangan ma’muriy yoki jinoiy jazo qo‘llaniladi.',
          documentTitle: article.documentTitle,
          articleNumber: article.articleNumber,
          lexUrl: article.lexUrl
        };
      }
    }
  }

  // No match found
  return {
    hasMatch: false,
    warningText: lang === 'ru' ? 'Правовая норма не обнаружена.' : (lang === 'en' ? 'No specific legal norm detected.' : 'Aniq huquqiy norma aniqlanmadi.')
  };
}
