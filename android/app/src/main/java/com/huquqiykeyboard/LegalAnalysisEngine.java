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

        public LegalMatchResult(boolean hasMatch, String warningTitle, String warningText, String highlightedWord, String documentTitle, String articleNumber, String lexUrl) {
            this.hasMatch = hasMatch;
            this.warningTitle = warningTitle;
            this.warningText = warningText;
            this.highlightedWord = highlightedWord;
            this.documentTitle = documentTitle;
            this.articleNumber = articleNumber;
            this.lexUrl = lexUrl;
        }

        public static LegalMatchResult noMatch() {
            return new LegalMatchResult(false, null, "Aniq huquqiy norma aniqlanmadi.", null, null, null, null);
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

        boolean isInsult = normalized.contains("haqorat") ||
                normalized.contains("so'kish") ||
                normalized.contains("tahqir") ||
                normalized.contains("haqorat qilaman") ||
                normalized.contains("haqoratomuz");

        boolean isDefamation = normalized.contains("tuhmat") ||
                normalized.contains("sharmanda") ||
                normalized.contains("uydirma") ||
                normalized.contains("bo'hton");

        boolean isInternetCrime = normalized.contains("internet") && (isInsult || isDefamation || normalized.contains("tarqat") || normalized.contains("taqiqlangan"));

        if (isInsult || isInternetCrime) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn haqoratga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                    "haqoratga",
                    "Ma’muriy javobgarlik to‘g‘risidagi kodeks",
                    "Modda 183",
                    "https://lex.uz/docs/97664#183"
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
                    "https://lex.uz/docs/97664#40"
            );
        }

        if (normalized.contains("poro") || normalized.contains("pora")) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn poraxorlik va korrupsiyaga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                    "poraxorlikka",
                    "Jinoyat kodeksi",
                    "Modda 210",
                    "https://lex.uz/docs/111453#210"
            );
        }

        if (normalized.contains("o'g'ri") || normalized.contains("o'g'irlik")) {
            return new LegalMatchResult(
                    true,
                    "Huquqiy ogohlantirish",
                    "Ushbu matn o‘g‘rilik va mulkiy huquqbuzarliklarga aloqador bo‘lishi mumkin.",
                    "o'g'rilikka",
                    "Jinoyat kodeksi",
                    "Modda 169",
                    "https://lex.uz/docs/111453#169"
            );
        }

        return LegalMatchResult.noMatch();
    }
}
