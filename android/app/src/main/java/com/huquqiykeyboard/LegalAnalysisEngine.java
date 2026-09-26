package com.huquqiykeyboard;

public class LegalAnalysisEngine {

    public static class LegalMatchResult {
        public boolean hasMatch;
        public String warningTitle;
        public String warningText;
        public String highlightedWord;
        public String documentTitle;
        public String articleNumber;
        public String lexUrl;
        public String penaltyText;

        public LegalMatchResult(boolean hasMatch, String warningTitle, String warningText, String highlightedWord, String documentTitle, String articleNumber, String lexUrl, String penaltyText) {
            this.hasMatch = hasMatch;
            this.warningTitle = warningTitle;
            this.warningText = warningText;
            this.highlightedWord = highlightedWord;
            this.documentTitle = documentTitle;
            this.articleNumber = articleNumber;
            this.lexUrl = lexUrl;
            this.penaltyText = penaltyText;
        }

        public static LegalMatchResult noMatch() {
            return new LegalMatchResult(false, null, "Aniq huquqiy norma aniqlanmadi.", null, null, null, null, null);
        }
    }

    public static LegalMatchResult analyzeText(String text) {
        if (text == null || text.trim().length() < 3) {
            return LegalMatchResult.noMatch();
        }

        String normalized = text.toLowerCase()
                .replaceAll("[.,/#!$%^&*;:{}=\\-_`~()?'\"‘]", " ")
                .replaceAll("\\s+", " ")
                .trim();

        // Check Insult (Uzbek Latin/Cyrillic, Russian, English)
        boolean isInsult = normalized.contains("haqorat") ||
                normalized.contains("хакорат") ||
                normalized.contains("хақорат") ||
                normalized.contains("so'kish") ||
                normalized.contains("сокиш") ||
                normalized.contains("tahqir") ||
                normalized.contains("оскорбление") ||
                normalized.contains("оскорблю") ||
                normalized.contains("insult");

        // Check Defamation
        boolean isDefamation = normalized.contains("tuhmat") ||
                normalized.contains("тухмат") ||
                normalized.contains("туҳмат") ||
                normalized.contains("sharmanda") ||
                normalized.contains("клевета") ||
                normalized.contains("клевет") ||
                normalized.contains("defamation");

        // Check Bribe
        boolean isBribe = normalized.contains("poro") ||
                normalized.contains("pora") ||
                normalized.contains("пора") ||
                normalized.contains("взятка") ||
                normalized.contains("взятку") ||
                normalized.contains("bribe");

        // Check Theft
        boolean isTheft = normalized.contains("o'g'ri") ||
                normalized.contains("o'g'irlik") ||
                normalized.contains("ўғрилик") ||
                normalized.contains("кража") ||
                normalized.contains("украсть") ||
                normalized.contains("theft");

        if (isInsult) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn haqoratga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                    "haqoratga",
                    "Ma’muriy javobgarlik to‘g‘risidagi kodeks",
                    "Modda 183",
                    "https://lex.uz/docs/97664#183",
                    "Oqibat: BHM 2-5 baravarigacha jarima yoki 15 sutka qamoq"
            );
        }

        if (isDefamation) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn tuhmatga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                    "tuhmatga",
                    "Ma’muriy javobgarlik to‘g‘risidagi kodeks",
                    "Modda 40",
                    "https://lex.uz/docs/97664#40",
                    "Oqibat: BHM 20-60 baravarigacha jarima"
            );
        }

        if (isBribe) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn poraxorlik va korrupsiyaga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                    "poraxorlikka",
                    "Jinoyat kodeksi",
                    "Modda 210",
                    "https://lex.uz/docs/111453#210",
                    "Oqibat: 5 yildan 10 yilgacha ozodlikdan mahrum qilish"
            );
        }

        if (isTheft) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn o‘g‘rilik va mulkiy huquqbuzarliklarga aloqador bo‘lishi mumkin.",
                    "o'g'rilikka",
                    "Jinoyat kodeksi",
                    "Modda 169",
                    "https://lex.uz/docs/111453#169",
                    "Oqibat: BHM 50 baravarigacha jarima yoki 3 yilgacha ozodlikdan mahrum qilish"
            );
        }

        return LegalMatchResult.noMatch();
    }
}
