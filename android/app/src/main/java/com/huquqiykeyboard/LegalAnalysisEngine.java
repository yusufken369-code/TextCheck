package com.huquqiykeyboard;

/**
 * Offline Native Android Legal Analysis Engine
 * Uses neutral, non-judgmental legal wording according to legal rules specification.
 * Supports multi-language warnings (Uzbek, Russian, English) with auto-detection.
 */
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
        return analyzeText(text, "oz_lat");
    }

    public static LegalMatchResult analyzeText(String text, String activeLang) {
        if (text == null || text.trim().length() < 3) {
            return LegalMatchResult.noMatch();
        }

        // Detect language from text or active keyboard language
        boolean isRussianInput = text.matches(".*[а-яА-ЯёЁ].*") || "ru_cyr".equals(activeLang) || "ru".equals(activeLang);
        boolean isEnglishInput = !isRussianInput && ("eng".equals(activeLang) || "en".equals(activeLang));
        String lang = isRussianInput ? "ru" : (isEnglishInput ? "en" : "uz");

        String normalized = text.toLowerCase()
                .replaceAll("[‘’`ʻ]", "'")
                .replaceAll("[.,/#!$%^&*;:{}=\\-_~()?\"]", " ")
                .replaceAll("\\s+", " ")
                .trim();
        String normalizedClean = normalized.replaceAll("'", "");

        // 1. Check Threats & Intimidation
        boolean isThreat = normalized.contains("o'ldiraman") ||
                normalizedClean.contains("oldiraman") ||
                normalized.contains("seni o'ldiraman") ||
                normalizedClean.contains("seni oldiraman") ||
                normalized.contains("o'ldirib tashlayman") ||
                normalizedClean.contains("oldirib tashlayman") ||
                normalized.contains("o'ldirib yuboraman") ||
                normalizedClean.contains("oldirib yuboraman") ||
                normalized.contains("seni uraman") ||
                normalized.contains("seni kaltaklayman") ||
                normalized.contains("seni pichoqlayman") ||
                normalized.contains("senga zarar yetkazaman") ||
                normalized.contains("zarar yetkazaman") ||
                normalized.contains("uyingga boraman") ||
                normalized.contains("seni topaman") ||
                normalized.contains("seni yo'q qilaman") ||
                normalizedClean.contains("seni yoq qilaman") ||
                normalized.contains("hayotingni barbod qilaman") ||
                normalized.contains("oilanggga zarar yetkazaman") ||
                normalized.contains("qo'rqitaman") ||
                normalizedClean.contains("qorqitaman") ||
                normalized.contains("seni otaman") ||
                normalized.contains("i will kill you") ||
                normalized.contains("i'll kill you") ||
                normalized.contains("kill you") ||
                normalized.contains("i will hurt you") ||
                normalized.contains("i will beat you") ||
                normalized.contains("i will find you") ||
                normalized.contains("i will destroy you") ||
                normalized.contains("i'll come to your house") ||
                normalized.contains("я тебя убью") ||
                normalized.contains("я убью тебя") ||
                normalized.contains("убью тебя") ||
                normalized.contains("я тебя ударю") ||
                normalized.contains("я тебя избью") ||
                normalized.contains("я тебя найду") ||
                normalized.contains("я причиню тебе вред") ||
                normalized.contains("я приду к тебе домой");

        // Context Rule 1: threat_future_action signal + action
        if (!isThreat) {
            boolean hasSignal = normalized.contains("seni") || normalized.contains("sizni") ||
                    normalized.contains("uni") || normalized.contains("men") ||
                    normalized.contains("will") || normalized.contains("я");
            boolean hasAction = normalized.contains("o'ldir") || normalizedClean.contains("oldir") ||
                    normalized.contains("ur") || normalized.contains("kaltakla") ||
                    normalized.contains("zarar") || normalized.contains("kill") ||
                    normalized.contains("hurt") || normalized.contains("beat") ||
                    normalized.contains("удар") || normalized.contains("убь");
            if (hasSignal && hasAction) {
                isThreat = true;
            }
        }

        // 2. Check Insult & Defamation
        boolean isInsult = normalized.contains("ahmoq") ||
                normalized.contains("tentak") ||
                normalized.contains("la'nati") ||
                normalized.contains("iflos") ||
                normalized.contains("itvachcha") ||
                normalized.contains("haromi") ||
                normalized.contains("ablah") ||
                normalized.contains("pastkash") ||
                normalized.contains("yaramas") ||
                normalized.contains("befahm") ||
                normalized.contains("nodon") ||
                normalized.contains("razil") ||
                normalized.contains("uyatsiz") ||
                normalized.contains("yaramas odam") ||
                normalized.contains("sen ahmoqsan") ||
                normalized.contains("sen tentaksan") ||
                normalized.contains("haqorat") ||
                normalized.contains("tahqir") ||
                normalized.contains("tuhmat") ||
                normalized.contains("idiot") ||
                normalized.contains("stupid") ||
                normalized.contains("moron") ||
                normalized.contains("jerk") ||
                normalized.contains("loser") ||
                normalized.contains("scumbag") ||
                normalized.contains("bastard") ||
                normalized.contains("you are an idiot") ||
                normalized.contains("you are stupid") ||
                normalized.contains("дебил") ||
                normalized.contains("идиот") ||
                normalized.contains("тупой") ||
                normalized.contains("дурак") ||
                normalized.contains("мерзавец") ||
                normalized.contains("ублюдок") ||
                normalized.contains("подонок") ||
                normalized.contains("ахмак") ||
                normalized.contains("тентак") ||
                normalized.contains("ты идиот") ||
                normalized.contains("ты дурак") ||
                normalized.contains("ты тупой");

        // 3. Check Violence
        boolean isViolence = normalized.contains("urib yubor") ||
                normalized.contains("urib tashla") ||
                normalized.contains("kaltakla") ||
                normalized.contains("bo'g'") ||
                normalized.contains("bo‘g‘") ||
                normalized.contains("pichoqla") ||
                normalized.contains("otib tashla") ||
                normalized.contains("yoqib yubor") ||
                normalized.contains("qiyna") ||
                normalized.contains("azob ber") ||
                normalized.contains("zo'rlab qo'y") ||
                normalized.contains("zo‘rlab qo‘y") ||
                normalized.contains("zo'ravonlik") ||
                normalized.contains("zo‘ravonlik") ||
                normalized.contains("beat him") ||
                normalized.contains("beat her") ||
                normalized.contains("hit him") ||
                normalized.contains("hit her") ||
                normalized.contains("stab him") ||
                normalized.contains("stab her") ||
                normalized.contains("shoot him") ||
                normalized.contains("shoot her") ||
                normalized.contains("strangle him") ||
                normalized.contains("strangle her") ||
                normalized.contains("torture him") ||
                normalized.contains("избей его") ||
                normalized.contains("избей её") ||
                normalized.contains("избей ее") ||
                normalized.contains("ударь его") ||
                normalized.contains("ударь её") ||
                normalized.contains("ударь ее") ||
                normalized.contains("зарежь его") ||
                normalized.contains("застрели его") ||
                normalized.contains("задуши его") ||
                normalized.contains("пытать его");

        // 4. Check Harassment & Stalking
        boolean isHarassment = normalized.contains("seni tinch qo'ymayman") ||
                normalized.contains("seni tinch qo‘ymayman") ||
                normalized.contains("har kuni ortingdan yuraman") ||
                normalized.contains("uyingni kuzataman") ||
                normalized.contains("qayerga borsang ham topaman") ||
                normalized.contains("seni doim kuzataman") ||
                normalized.contains("senga tinimsiz yozaman") ||
                normalized.contains("telefoningni tinimsiz qilaman") ||
                normalized.contains("tazyiq") ||
                normalized.contains("ta'qib") ||
                normalized.contains("ta’qib") ||
                normalized.contains("i will keep following you") ||
                normalized.contains("i won't leave you alone") ||
                normalized.contains("i will stalk you") ||
                normalized.contains("i will follow you everywhere") ||
                normalized.contains("i will keep messaging you") ||
                normalized.contains("я не оставлю тебя в покое") ||
                normalized.contains("я буду за тобой следить") ||
                normalized.contains("я буду ходить за тобой") ||
                normalized.contains("я буду постоянно тебе писать");

        // 5. Check Disclosure of Personal Data / Privacy
        boolean isPersonalData = normalized.contains("telefon raqamingni tarqataman") ||
                normalized.contains("manzilingni tarqataman") ||
                normalized.contains("pasportingni internetga joylayman") ||
                normalized.contains("pasport rasmini tashlayman") ||
                normalized.contains("shaxsiy rasmingni tarqataman") ||
                normalized.contains("uy manzilingni yuboraman") ||
                normalized.contains("telefon raqamini guruhga tashlayman") ||
                normalized.contains("shaxsiy ma'lumot") ||
                normalized.contains("shaxsiy ma’lumot") ||
                normalized.contains("shaxsga doir") ||
                normalized.contains("i will post your phone number") ||
                normalized.contains("i will publish your address") ||
                normalized.contains("i will post your passport") ||
                normalized.contains("i will share your private photos") ||
                normalized.contains("я выложу твой номер") ||
                normalized.contains("я опубликую твой адрес") ||
                normalized.contains("я выложу твой паспорт") ||
                normalized.contains("я распространю твои личные фото");

        // Context Rule 2: privacy_distribution signal + action
        if (!isPersonalData) {
            boolean hasSignal = normalized.contains("telefon") || normalized.contains("manzil") ||
                    normalized.contains("pasport") || normalized.contains("rasm") ||
                    normalized.contains("foto") || normalized.contains("номер") ||
                    normalized.contains("адрес") || normalized.contains("паспорт") ||
                    normalized.contains("фото");
            boolean hasAction = normalized.contains("tarqat") || normalized.contains("joyla") ||
                    normalized.contains("tashla") || normalized.contains("yubor") ||
                    normalized.contains("publish") || normalized.contains("share") ||
                    normalized.contains("post") || normalized.contains("выложу") ||
                    normalized.contains("опубликую");
            if (hasSignal && hasAction) {
                isPersonalData = true;
            }
        }

        // 6. Check Coercion & Extortion
        boolean isExtortion = normalized.contains("pul bermasang") ||
                normalized.contains("pul bermasang seni") ||
                normalized.contains("aks holda seni") ||
                normalized.contains("sirlaringni hammaga aytaman") ||
                normalized.contains("rasmlaringni tarqataman") ||
                normalized.contains("bermasang tarqataman") ||
                normalized.contains("bermasang yuboraman") ||
                normalized.contains("majbur qilaman") ||
                normalized.contains("pora") ||
                normalized.contains("shantaj") ||
                normalized.contains("tovlamachilik") ||
                normalized.contains("give me the money or") ||
                normalized.contains("pay me or i will") ||
                normalized.contains("give me money or i will") ||
                normalized.contains("i will expose your secrets") ||
                normalized.contains("i will publish your photos") ||
                normalized.contains("blackmail") ||
                normalized.contains("extortion") ||
                normalized.contains("дай деньги или") ||
                normalized.contains("заплати мне или") ||
                normalized.contains("иначе я расскажу всем") ||
                normalized.contains("иначе я выложу твои фото") ||
                normalized.contains("я всем расскажу твой секрет") ||
                normalized.contains("шантаж") ||
                normalized.contains("вымогательство");

        // 7. Check Child Harm
        boolean isChildHarm = normalized.contains("bolani uraman") ||
                normalized.contains("bolani kaltaklayman") ||
                normalized.contains("bolaga zarar yetkazaman") ||
                normalized.contains("bolani qo'rqitaman") ||
                normalized.contains("bolani qo‘rqitaman") ||
                normalized.contains("bolani majburlayman") ||
                normalized.contains("bolani ekspluatatsiya qilaman") ||
                normalized.contains("i will hurt the child") ||
                normalized.contains("i will beat the child") ||
                normalized.contains("i will threaten the child") ||
                normalized.contains("i will exploit the child") ||
                normalized.contains("я причиню вред ребёнку") ||
                normalized.contains("я причиню вред ребенку") ||
                normalized.contains("я изобью ребёнка") ||
                normalized.contains("я изобью ребенка") ||
                normalized.contains("я буду угрожать ребёнку") ||
                normalized.contains("я буду угрожать ребенку") ||
                normalized.contains("я заставлю ребёнка") ||
                normalized.contains("я заставлю ребенка");

        // 8. Check Sexual Harm
        boolean isSexualHarm = normalized.contains("jinsiy zo'ravonlik qilaman") ||
                normalized.contains("jinsiy zo‘ravonlik qilaman") ||
                normalized.contains("jinsiy majburlayman") ||
                normalized.contains("roziligisiz tegaman") ||
                normalized.contains("roziligisiz suratini tarqataman") ||
                normalized.contains("i will sexually assault") ||
                normalized.contains("i will force you sexually") ||
                normalized.contains("without your consent") ||
                normalized.contains("i will share your intimate photos") ||
                normalized.contains("я совершу сексуальное насилие") ||
                normalized.contains("без твоего согласия") ||
                normalized.contains("я выложу интимные фото");

        // 9. Check Drugs & Weapons
        boolean isDrugsWeapons = normalized.contains("giyohvand modda sotaman") ||
                normalized.contains("narkotik sotaman") ||
                normalized.contains("narkotik olib kel") ||
                normalized.contains("narkotik ber") ||
                normalized.contains("giyohvand modda tarqataman") ||
                normalized.contains("qurol bilan kelaman") ||
                normalized.contains("qurolim bor") ||
                normalized.contains("senga qurol ko'rsataman") ||
                normalized.contains("senga qurol ko‘rsataman") ||
                normalized.contains("pichoq bilan boraman") ||
                normalized.contains("otib tashlayman") ||
                normalized.contains("qurol bilan qo'rqitaman") ||
                normalized.contains("qurol bilan qo‘rqitaman") ||
                normalized.contains("giyohvand") ||
                normalized.contains("narkotik") ||
                normalized.contains("qurol") ||
                normalized.contains("sell drugs") ||
                normalized.contains("buy drugs") ||
                normalized.contains("deliver drugs") ||
                normalized.contains("distribute drugs") ||
                normalized.contains("i have a weapon") ||
                normalized.contains("i will come with a weapon") ||
                normalized.contains("i will shoot you") ||
                normalized.contains("i will threaten you with a weapon") ||
                normalized.contains("продам наркотики") ||
                normalized.contains("купи наркотики") ||
                normalized.contains("привези наркотики") ||
                normalized.contains("распространять наркотики") ||
                normalized.contains("у меня есть оружие") ||
                normalized.contains("я приду с оружием") ||
                normalized.contains("я тебя застрелю") ||
                normalized.contains("я угрожу тебе оружием");

        // 10. Check Fraud & Deception
        boolean isFraud = normalized.contains("odamlarni aldab pul olaman") ||
                normalized.contains("soxta pul yuboraman") ||
                normalized.contains("soxta hujjat qilaman") ||
                normalized.contains("birovning nomidan foydalanaman") ||
                normalized.contains("parolni olib pul yechaman") ||
                normalized.contains("odamni aldab pul undiraman") ||
                normalized.contains("firibgarlik") ||
                normalized.contains("soxta hujjat") ||
                normalized.contains("i will scam people") ||
                normalized.contains("i will use a fake document") ||
                normalized.contains("i will impersonate someone") ||
                normalized.contains("i will steal money using their password") ||
                normalized.contains("я обману людей") ||
                normalized.contains("я сделаю поддельный документ") ||
                normalized.contains("я притворюсь другим человеком") ||
                normalized.contains("я украду деньги с его паролем");

        // 11. Check Hate Incitement
        boolean isHateIncitement = normalized.contains("ularni haydab yuborish kerak") ||
                normalized.contains("ularni urish kerak") ||
                normalized.contains("ularni yo'q qilish kerak") ||
                normalized.contains("ularni yo‘q qilish kerak") ||
                normalized.contains("ularga qarshi zo'ravonlik qiling") ||
                normalized.contains("ularga qarshi zo‘ravonlik qiling") ||
                normalized.contains("ularning hammasini o'ldirish kerak") ||
                normalized.contains("ularning hammasini o‘ldirish kerak") ||
                normalized.contains("nafrat qo'zg'atish") ||
                normalized.contains("nafrat qo‘zg‘atish") ||
                normalized.contains("they should be attacked") ||
                normalized.contains("they should be killed") ||
                normalized.contains("drive them out") ||
                normalized.contains("attack them") ||
                normalized.contains("kill them all") ||
                normalized.contains("их надо избить") ||
                normalized.contains("их надо убить") ||
                normalized.contains("изгоните их") ||
                normalized.contains("нападите на них") ||
                normalized.contains("убить их всех");

        // 12. Check Copyright Violation
        boolean isCopyright = normalized.contains("filmni noqonuniy tarqataman") ||
                normalized.contains("kitobni ruxsatsiz tarqataman") ||
                normalized.contains("rasmni o'ziniki qilib olaman") ||
                normalized.contains("rasmni o‘ziniki qilib olaman") ||
                normalized.contains("birovning videosini o'ziniki qilaman") ||
                normalized.contains("birovning videosini o‘ziniki qilaman") ||
                normalized.contains("i will distribute the movie without permission") ||
                normalized.contains("i will upload the book without permission") ||
                normalized.contains("я распространяю фильм без разрешения") ||
                normalized.contains("я выложу книгу без разрешения");

        // 13. Check Online Harm / Hacking
        boolean isOnlineHarm = normalized.contains("akkauntingni buzaman") ||
                normalized.contains("parolingni o'g'irlayman") ||
                normalized.contains("parolingni o‘g‘irlayman") ||
                normalized.contains("parolingni og'irlayman") ||
                normalized.contains("akkauntingga kirib olaman") ||
                normalized.contains("ma'lumotlaringni o'chiraman") ||
                normalized.contains("ma'lumotlaringni o‘chiraman") ||
                normalized.contains("ma'lumotlaringni ochiraman") ||
                normalized.contains("i will hack your account") ||
                normalized.contains("i will steal your password") ||
                normalized.contains("i will break into your account") ||
                normalized.contains("i will delete your data") ||
                normalized.contains("я взломаю твой аккаунт") ||
                normalized.contains("я украду твой пароль") ||
                normalized.contains("я войду в твой аккаунт") ||
                normalized.contains("я удалю твои данные");

        // Return localized legal warnings
        if (isThreat) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися угроз или запугивания.",
                        "угроза",
                        "Угроза и запугивание",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning threats or intimidation.",
                        "threat",
                        "Threats and intimidation",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn tahdid yoki qo‘rqitishga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "tahdid",
                        "Tahdid va qo‘rqitish",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ma’muriy javobgarlik to‘g‘risidagi kodeks"
                );
            }
        }

        if (isInsult) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися чести, достоинства, оскорбления или клеветы.",
                        "оскорбление",
                        "Оскорбление, честь и достоинство",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz/docs/97664#41",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning honor, dignity, insult or defamation.",
                        "insult",
                        "Insult, honor and dignity",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz/docs/97664#41",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn shaxsning sha’ni, qadr-qimmati yoki haqorat/tuhmatga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "haqorat",
                        "Haqorat, sha’n va qadr-qimmat",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz/docs/97664#41",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ma’muriy javobgarlik to‘g‘risidagi kodeks"
                );
            }
        }

        if (isViolence) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися насилия.",
                        "насилие",
                        "Насилие",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning violence.",
                        "violence",
                        "Violence",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn zo‘ravonlikka oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "zo'ravonlik",
                        "Zo‘ravonlik",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Bola huquqlarining kafolatlari"
                );
            }
        }

        if (isHarassment) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися давления или преследования.",
                        "преследование",
                        "Преследование и давление",
                        "Закон о защите женщин от давления и насилия, Уголовный кодекс",
                        "https://lex.uz",
                        "Соответствующие законы: Закон о защите женщин от давления и насилия, Уголовный кодекс"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning harassment or stalking.",
                        "harassment",
                        "Harassment and stalking",
                        "Law on protection of women, Criminal Code",
                        "https://lex.uz",
                        "Applicable laws: Law on protection of women from harassment and violence"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn tazyiq yoki ta’qibga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "tazyiq",
                        "Tazyiq va ta’qib",
                        "Jinoyat kodeksi, Tazyiq va zo'ravonlikdan himoya qilish to'g'risida",
                        "https://lex.uz",
                        "Tegishli qonunlar: Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida"
                );
            }
        }

        if (isPersonalData) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися раскрытия персональных данных.",
                        "персональные данные",
                        "Раскрытие персональных данных",
                        "Закон о персональных данных, Закон об информатизации",
                        "https://lex.uz",
                        "Соответствующие законы: Закон о персональных данных, Закон об информатизации"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning disclosure of personal data.",
                        "personal data",
                        "Personal data disclosure",
                        "Law on personal data, Law on informatization",
                        "https://lex.uz",
                        "Applicable laws: Law on personal data, Law on informatization"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn shaxsga doir ma’lumotlarni oshkor qilish yoki tarqatishga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "shaxsiy ma'lumot",
                        "Shaxsga doir ma’lumotlar",
                        "Shaxsga doir ma’lumotlar to‘g‘risida, Axborotlashtirish to‘g‘risida",
                        "https://lex.uz",
                        "Tegishli qonunlar: Shaxsga doir ma’lumotlar to‘g‘risida, Axborotlashtirish to‘g‘risida"
                );
            }
        }

        if (isExtortion) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися принуждения, шантажа или вымогательства.",
                        "вымогательство",
                        "Принуждение и вымогательство",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz/docs/111453#210",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning coercion, blackmail or extortion.",
                        "extortion",
                        "Coercion and extortion",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz/docs/111453#210",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn majburlash, shantaj yoki tovlamachilikka oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "majburlash",
                        "Majburlash va tovlamachilik",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz/docs/111453#210",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ma’muriy javobgarlik to‘g‘risidagi kodeks"
                );
            }
        }

        if (isChildHarm) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися прав и защиты детей.",
                        "ребёнок",
                        "Права детей и защита",
                        "Закон о гарантиях прав ребенка, Уголовный кодекс",
                        "https://lex.uz",
                        "Соответствующие законы: Закон о гарантиях прав ребенка, Уголовный кодекс"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning children's rights and protection.",
                        "child",
                        "Child rights and protection",
                        "Law on guarantees of child rights, Criminal Code",
                        "https://lex.uz",
                        "Applicable laws: Law on guarantees of child rights, Criminal Code"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn bola huquqlari yoki bolani himoya qilishga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "bola",
                        "Bola huquqlari va bolaga zararli mazmun",
                        "Bola huquqlarining kafolatlari to‘g‘risida, Jinoyat kodeksi",
                        "https://lex.uz",
                        "Tegishli qonunlar: Bola huquqlarining kafolatlari to‘g‘risida, Jinoyat kodeksi"
                );
            }
        }

        if (isSexualHarm) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися сексуального контента или порнографии.",
                        "сексуальный контент",
                        "Сексуальный контент и порнография",
                        "Уголовный кодекс, Закон о гарантиях прав ребенка",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Закон о гарантиях прав ребенка"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning sexual content or pornography.",
                        "sexual content",
                        "Sexual content and pornography",
                        "Criminal Code, Law on guarantees of child rights",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Law on guarantees of child rights"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn jinsiy mazmun yoki pornografiyaga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "jinsiy zo'ravonlik",
                        "Jinsiy mazmun va pornografiya",
                        "Jinoyat kodeksi, Bola huquqlarining kafolatlari",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Bola huquqlarining kafolatlari to‘g‘risida"
                );
            }
        }

        if (isDrugsWeapons) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися наркотических средств, психотропных веществ или оружия.",
                        "наркотики",
                        "Наркотики и оружие",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz/docs/111453#19",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning drugs, psychotropic substances or weapons.",
                        "drugs",
                        "Drugs and weapons",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz/docs/111453#19",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn giyohvand moddalar, psixotrop moddalar yoki qurolga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "giyohvand",
                        "Giyohvand moddalar va qurol",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz/docs/111453#19",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ma’muriy javobgarlik to‘g‘risidagi kodeks"
                );
            }
        }

        if (isFraud) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися мошенничества или поддельных документов.",
                        "мошенничество",
                        "Мошенничество и обман",
                        "Уголовный кодекс, Кодекс об административной ответственности",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Кодекс об административной ответственности"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning fraud or fake documents.",
                        "fraud",
                        "Fraud and deception",
                        "Criminal Code, Code of Administrative Responsibility",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Code of Administrative Responsibility"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn firibgarlik yoki soxta hujjatlarga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "firibgarlik",
                        "Firibgarlik va aldatish",
                        "Jinoyat kodeksi, Ma’muriy javobgarlik kodeksi",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ma’muriy javobgarlik to‘g‘risidagi kodeks"
                );
            }
        }

        if (isHateIncitement) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися разжигания национальной, религиозной или расовой вражды.",
                        "разжигание вражды",
                        "Разжигание ненависти и вражды",
                        "Уголовный кодекс, Закон о средствах массовой информации",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Закон о средствах массовой информации"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning incitement of national, religious or racial hatred.",
                        "hate incitement",
                        "Incitement of hatred",
                        "Criminal Code, Law on Mass Media",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Law on Mass Media"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn milliylik, diniy yoki irqiy adovat qo‘zg‘atishga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "nafrat qo'zg'atish",
                        "Nafrat va adovat qo‘zg‘atish",
                        "Jinoyat kodeksi, Ommaviy axborot vositalari to‘g‘risida",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Ommaviy axborot vositalari to‘g‘risida"
                );
            }
        }

        if (isCopyright) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися авторского права или нелегального распространения.",
                        "авторское право",
                        "Авторское право",
                        "Закон об авторском праве и смежных правах",
                        "https://lex.uz",
                        "Соответствующие законы: Закон об авторском праве и смежных правах"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning copyright or illegal distribution.",
                        "copyright",
                        "Copyright and distribution",
                        "Law on copyright and related rights",
                        "https://lex.uz",
                        "Applicable laws: Law on copyright and related rights"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn mualliflik huquqi yoki asardan noqonuniy foydalanishga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "mualliflik huquqi",
                        "Mualliflik huquqi va noqonuniy tarqatish",
                        "Mualliflik huquqi va turdosh huquqlar to‘g‘risida",
                        "https://lex.uz",
                        "Tegishli qonunlar: Mualliflik huquqi va turdosh huquqlar to‘g‘risida"
                );
            }
        }

        if (isOnlineHarm) {
            if ("ru".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Правовое предупреждение",
                        "Этот текст может быть связан с правовыми нормами, касающимися кибербезопасности, взлома или кражи данных.",
                        "взлом",
                        "Кибербезопасность",
                        "Уголовный кодекс, Закон об информатизации",
                        "https://lex.uz",
                        "Соответствующие законы: Уголовный кодекс, Закон об информатизации"
                );
            } else if ("en".equals(lang)) {
                return new LegalMatchResult(
                        true,
                        "⚖️ Legal Warning",
                        "This text may be related to legal provisions concerning cybersecurity, hacking or data theft.",
                        "hacking",
                        "Cybersecurity",
                        "Criminal Code, Law on informatization",
                        "https://lex.uz",
                        "Applicable laws: Criminal Code, Law on informatization"
                );
            } else {
                return new LegalMatchResult(
                        true,
                        "⚖️ Huquqiy ogohlantirish",
                        "Ushbu matn kiberxavfsizlik, shaxsiy akkauntni buzish yoki ma’lumotlarni o‘g‘irlashga oid huquqiy normalarga aloqador bo‘lishi mumkin.",
                        "akkauntingni buzaman",
                        "Kiberxavfsizlik va onlayn buzg‘unchilik",
                        "Jinoyat kodeksi, Axborotlashtirish to‘g‘risida",
                        "https://lex.uz",
                        "Tegishli qonunlar: Jinoyat kodeksi, Axborotlashtirish to‘g‘risida"
                );
            }
        }

        return LegalMatchResult.noMatch();
    }
}
