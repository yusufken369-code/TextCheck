-- HuquqCheck - Supabase Warning Rules Schema & Migration (Expanded Lexicon)
-- Source: HuquqCheck_warning_rules_10_laws.json

-- 1. Create warning_rules Table
CREATE TABLE IF NOT EXISTS public.warning_rules (
    id TEXT PRIMARY KEY,
    category JSONB NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium',
    trigger_patterns TEXT[] NOT NULL,
    warning_uz TEXT NOT NULL,
    warning_ru TEXT NOT NULL,
    warning_en TEXT NOT NULL,
    related_laws TEXT[] DEFAULT '{}',
    enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.warning_rules ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policy: Mobile app & public read-only access
DROP POLICY IF EXISTS "Warning rules are viewable by everyone" ON public.warning_rules;
CREATE POLICY "Warning rules are viewable by everyone" ON public.warning_rules
    FOR SELECT USING (true);

-- 4. Seed/Update Initial Data from Expanded Harmful Lexicon
INSERT INTO public.warning_rules (
    id, category, severity, trigger_patterns, warning_uz, warning_ru, warning_en, related_laws, enabled
) VALUES 
(
    'threat',
    '{"uz": "Tahdid va qo‘rqitish", "ru": "Угроза и запугивание", "en": "Threats and intimidation"}'::jsonb,
    'high',
    ARRAY[
        'o‘ldiraman', 'o''ldiraman', 'seni o''ldiraman', 'seni o‘ldiraman', 'o''ldirib yuboraman', 'o‘ldirib yuboraman', 
        'uraman', 'seni uraman', 'seni kaltaklayman', 'zarar yetkazaman', 'senga zarar yetkazaman', 'uyingga boraman', 
        'seni topaman', 'yo''q qilaman', 'yo‘q qilaman', 'qo‘rqitaman', 'qo''rqitaman', 'seni otaman', 'senga o''q uzaman', 'seni pichoqlayman',
        'я тебя убью', 'убью тебя', 'я тебя ударю', 'я тебя избью', 'причиню тебе вред', 'я тебя найду', 'я тебя уничтожу', 'я тебя застрелю', 'я тебя зарежу', 'застрелю тебя', 'напугаю тебя',
        'i will kill you', 'i''ll kill you', 'kill you', 'i will hurt you', 'i''ll hurt you', 'i will beat you', 'i''ll beat you', 'i will find you', 'i will destroy you', 'i will shoot you', 'i''ll shoot you', 'i will stab you', 'i''ll stab you', 'i will scare you'
    ],
    'Ushbu matn tahdid yoki qo‘rqitishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися угроз или запугивания.',
    'This text may be related to legal provisions concerning threats or intimidation.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks'],
    true
),
(
    'insult_defamation',
    '{"uz": "Haqorat, sha’n va qadr-qimmat", "ru": "Оскорбление, честь и достоинство", "en": "Insult, honor and dignity"}'::jsonb,
    'medium',
    ARRAY[
        'haqorat', 'tahqir', 'sha’n', 'shon', 'qadr-qimmat', 'tuhmat', 'ahmoq', 'tentak', 'esiz', 'iflos', 'razil', 'harom', 'yaramas', 'la''nati', 'it', 'eshak', 'to''ng''iz', 'pastkash', 'ablah', 'kallavaram', 'nodon', 'befahm', 'haqorat qilaman', 'tahqir qilaman', 'seni yerga uraman', 'seni sharmanda qilaman',
        'дурак', 'идиот', 'тупой', 'дебил', 'кретин', 'мерзавец', 'подонок', 'ублюдок', 'козёл', 'свинья', 'тварь', 'ничтожество', 'хам', 'оскорбление', 'оскорблю', 'унижу',
        'idiot', 'stupid', 'dumb', 'fool', 'moron', 'jerk', 'loser', 'scumbag', 'bastard', 'asshole', 'piece of shit', 'insult', 'insult you', 'humiliate you'
    ],
    'Ushbu matn shaxsning sha’ni, qadr-qimmati yoki haqorat/tuhmatga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися чести, достоинства, оскорбления или клеветы.',
    'This text may be related to legal provisions concerning honor, dignity, insult or defamation.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks', 'Ommaviy axborot vositalari to‘g‘risida'],
    true
),
(
    'violence',
    '{"uz": "Zo‘ravonlik", "ru": "Насилие", "en": "Violence"}'::jsonb,
    'high',
    ARRAY[
        'zo‘ravonlik', 'zo''ravonlik', 'urish', 'uraman', 'urib tashlash', 'kaltaklash', 'kaltaklayman', 'tepish', 'tepaman', 'mushtlash', 'bo''g''ish', 'bo‘g‘ish', 'qiynash', 'qiynayman', 'pichoqlash', 'pichoqlayman', 'o''q uzish', 'o‘q uzish', 'jinsiy zo''ravonlik', 'jinsiy zo‘ravonlik',
        'избить', 'избью', 'бить', 'ударить', 'ударю', 'пнуть', 'пнуть тебя', 'душить', 'задушить', 'пытать', 'пытки', 'зарезать', 'стрелять', 'насилие', 'сексуальное насилие',
        'beat', 'beat you', 'hit', 'hit you', 'kick', 'kick you', 'choke', 'strangle', 'torture', 'stab', 'shoot', 'violence', 'sexual violence'
    ],
    'Ushbu matn zo‘ravonlikka oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися насилия.',
    'This text may be related to legal provisions concerning violence.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks', 'Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida', 'Bola huquqlarining kafolatlari to‘g‘risida'],
    true
),
(
    'harassment',
    '{"uz": "Tazyiq va ta’qib", "ru": "Преследование и давление", "en": "Harassment and stalking"}'::jsonb,
    'high',
    ARRAY[
        'tazyiq', 'ta’qib', 'ta''qib', 'bezovta qilaman', 'bezovta qilish', 'kuzataman', 'kuzatib yuraman', 'ortidan yuraman', 'uyiga borib kutaman', 'stalking',
        'преследую', 'буду преследовать', 'буду следить', 'слежка', 'домогательство', 'буду доставать', 'буду ходить за тобой',
        'stalk you', 'i will stalk you', 'follow you', 'harass you', 'harassment', 'keep bothering you', 'sexual harassment'
    ],
    'Ushbu matn tazyiq yoki ta’qibga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися давления или преследования.',
    'This text may be related to legal provisions concerning harassment or stalking.',
    ARRAY['Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida', 'Jinoyat kodeksi'],
    true
),
(
    'personal_data',
    '{"uz": "Shaxsga doir ma’lumotlarni tarqatish", "ru": "Распространение персональных данных", "en": "Disclosure of personal data"}'::jsonb,
    'high',
    ARRAY[
        'telefon raqami', 'manzil', 'uy manzili', 'pasport', 'pasport raqami', 'shaxsga doir ma’lumot', 'shaxsga doir ma''lumot', 'shaxsiy ma’lumot', 'shaxsiy ma''lumot', 'pasport rasmini tarqataman', 'telefon raqamini tarqataman', 'manzilini tarqataman', 'oshkor qilaman', 'tarqataman',
        'паспорт', 'номер паспорта', 'номер телефона', 'адрес', 'домашний адрес', 'персональные данные', 'распространю паспорт', 'распространю номер', 'раскрою данные', 'опубликую адрес',
        'passport', 'passport number', 'phone number', 'address', 'home address', 'personal data', 'personal information', 'publish passport', 'share phone number', 'publish address', 'reveal personal data'
    ],
    'Ushbu matn shaxsga doir ma’lumotlarni oshkor qilish yoki tarqatishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися раскрытия или распространения персональных данных.',
    'This text may be related to legal provisions concerning disclosure or distribution of personal data.',
    ARRAY['Shaxsga doir ma’lumotlar to‘g‘risida', 'Axborotlashtirish to‘g‘risida'],
    true
),
(
    'internet_information',
    '{"uz": "Internet va axborot tarqatish", "ru": "Интернет и распространение информации", "en": "Internet and information distribution"}'::jsonb,
    'medium',
    ARRAY['internetga joylayman', 'kanalga yuboraman', 'tarmoqqa tarqataman', 'axborot tarqatish', 'onlayn tarqatish'],
    'Ushbu matn internet yoki axborotni tarqatishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися интернета или распространения информации.',
    'This text may be related to legal provisions concerning the internet or distribution of information.',
    ARRAY['Axborotlashtirish to‘g‘risida', 'Ommaviy axborot vositalari to‘g‘risida'],
    true
),
(
    'child_protection',
    '{"uz": "Bola huquqlari va bolaga zararli mazmun", "ru": "Права детей и вредный для детей контент", "en": "Children’s rights and harmful content"}'::jsonb,
    'high',
    ARRAY[
        'bola', 'voyaga yetmagan', 'bolaga zarar', 'bolani uraman', 'bolani kaltaklayman', 'bolani qiynayman', 'bolani majburlash', 'bolaga zo‘ravonlik', 'bolaga zo''ravonlik', 'bolaga jinsiy tajovuz', 'bola ekspluatatsiyasi',
        'навредить ребёнку', 'навредить ребенку', 'избить ребёнка', 'избить ребенка', 'насилие над ребёнком', 'насилие над ребенком', 'принуждение ребёнка', 'принуждение ребенка', 'сексуальное насилие над ребёнком', 'эксплуатация ребёнка',
        'harm a child', 'hurt a child', 'beat a child', 'violence against a child', 'force a child', 'sexual abuse of a child', 'child exploitation'
    ],
    'Ushbu matn bola huquqlari yoki bolani himoya qilishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися прав и защиты детей.',
    'This text may be related to legal provisions concerning children''s rights and protection.',
    ARRAY['Bola huquqlarining kafolatlari to‘g‘risida', 'Jinoyat kodeksi'],
    true
),
(
    'sexual_content',
    '{"uz": "Jinsiy mazmun va pornografiya", "ru": "Сексуальный контент и порнография", "en": "Sexual content and pornography"}'::jsonb,
    'high',
    ARRAY[
        'pornografiya', 'pornografik', 'jinsiy zo‘ravonlik', 'jinsiy zo''ravonlik', 'jinsiy tajovuz', 'voyaga yetmagan bilan jinsiy', 'bolalar pornografiyasi',
        'порнография', 'порнографический', 'сексуальное насилие', 'сексуальное нападение', 'детская порнография',
        'pornography', 'pornographic', 'sexual assault', 'sexual violence', 'child pornography'
    ],
    'Ushbu matn jinsiy mazmun yoki pornografiyaga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися сексуального контента или порнографии.',
    'This text may be related to legal provisions concerning sexual content or pornography.',
    ARRAY['Jinoyat kodeksi', 'Bola huquqlarining kafolatlari to‘g‘risida'],
    true
),
(
    'coercion_extortion',
    '{"uz": "Majburlash va tovlamachilik", "ru": "Принуждение и вымогательство", "en": "Coercion and extortion"}'::jsonb,
    'high',
    ARRAY[
        'majbur qilaman', 'majbur qilaman seni', 'pul ber', 'pul bermasang', 'bermasang', 'aks holda', 'shantaj', 'tovlamachilik', 'sirlaringni oshkor qilaman', 'rasmlaringni tarqataman', 'videongni tarqataman',
        'шантаж', 'вымогательство', 'заставлю тебя', 'если не заплатишь', 'иначе я', 'распространю твои фото', 'распространю видео', 'раскрою твой секрет',
        'blackmail', 'extortion', 'i will force you', 'if you don''t pay', 'or else', 'i will publish your photos', 'i will share your video', 'i will reveal your secret'
    ],
    'Ushbu matn majburlash, shantaj yoki tovlamachilikka oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися принуждения, шантажа или вымогательства.',
    'This text may be related to legal provisions concerning coercion, blackmail or extortion.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks'],
    true
),
(
    'drugs_weapons',
    '{"uz": "Giyohvand moddalar va qurol", "ru": "Наркотики и оружие", "en": "Drugs and weapons"}'::jsonb,
    'high',
    ARRAY[
        'giyohvand', 'giyohvandlik', 'narkotik', 'psixotrop', 'giyohvand modda', 'qurol', 'o‘q-dori', 'o''q-dori', 'pistolet', 'miltiq', 'pichoq', 'qurol sotaman', 'narkotik sotaman',
        'наркотик', 'наркотики', 'психотроп', 'наркоторговля', 'оружие', 'боеприпасы', 'пистолет', 'винтовка', 'нож', 'продам наркотики', 'продам оружие',
        'drug', 'drugs', 'narcotic', 'psychotropic', 'drug dealing', 'weapon', 'weapons', 'ammunition', 'pistol', 'rifle', 'knife', 'sell drugs', 'sell weapons'
    ],
    'Ushbu matn giyohvand moddalar, psixotrop moddalar yoki qurolga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися наркотических средств, психотропных веществ или оружия.',
    'This text may be related to legal provisions concerning drugs, psychotropic substances or weapons.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks'],
    true
),
(
    'copyright',
    '{"uz": "Mualliflik huquqi", "ru": "Авторское право", "en": "Copyright"}'::jsonb,
    'medium',
    ARRAY[
        'mualliflik huquqi', 'muallifning huquqi', 'muallif', 'asarni ko‘chirdim', 'asarni ko''chirdim', 'rasmni ko‘chirdim', 'rasmni ko''chirdim', 'videoni ko‘chirdim', 'videoni ko''chirdim', 'ruxsatsiz ko‘chirdim', 'ruxsatsiz ko''chirdim', 'ruxsatsiz tarqatish', 'ruxsatsiz tarqataman',
        'авторское право', 'нарушение авторских прав', 'скопировал без разрешения', 'распространю без разрешения',
        'copyright', 'copyright infringement', 'copied without permission', 'distribute without permission'
    ],
    'Ushbu matn mualliflik huquqi yoki asardan foydalanishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися авторского права или использования произведения.',
    'This text may be related to legal provisions concerning copyright or use of a work.',
    ARRAY['Mualliflik huquqi va turdosh huquqlar to‘g‘risida'],
    true
),
(
    'fraud_deception',
    '{"uz": "Firibgarlik va aldatish", "ru": "Мошенничество и обман", "en": "Fraud and deception"}'::jsonb,
    'high',
    ARRAY[
        'aldab pul olaman', 'aldab pul oldim', 'firibgarlik', 'soxta hujjat', 'soxta ma''lumot', 'soxta ma’lumot', 'pulni aldab olaman', 'odamlarni aldayman',
        'мошенничество', 'обману и получу деньги', 'поддельный документ', 'ложные данные', 'обману людей',
        'fraud', 'scam', 'scam people', 'fake document', 'false information', 'deceive people for money'
    ],
    'Ushbu matn firibgarlik yoki soxta hujjatlarga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися мошенничества или поддельных документов.',
    'This text may be related to legal provisions concerning fraud or fake documents.',
    ARRAY['Jinoyat kodeksi', 'Ma’muriy javobgarlik to‘g‘risidagi kodeks'],
    true
),
(
    'hate_incitement',
    '{"uz": "Nafrat va adovat qo‘zg‘atish", "ru": "Разжигание ненависти и вражды", "en": "Incitement to hatred and hostility"}'::jsonb,
    'high',
    ARRAY[
        'nafrat qo''zg''atish', 'nafrat qo‘zg‘atish', 'millatiga qarshi', 'diniy adovat', 'irqiy nafrat', 'zo''ravonlikka chaqiraman', 'zo‘ravonlikka chaqiraman',
        'разжигание ненависти', 'национальная вражда', 'религиозная вражда', 'расовая ненависть', 'призываю к насилию',
        'incitement to hatred', 'racial hatred', 'religious hatred', 'national hatred', 'incite violence', 'call for violence'
    ],
    'Ushbu matn milliylik, diniy yoki irqiy adovat qo‘zg‘atishga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися разжигания национальной, религиозной или расовой вражды.',
    'This text may be related to legal provisions concerning incitement of national, religious or racial hatred.',
    ARRAY['Jinoyat kodeksi', 'Ommaviy axborot vositalari to‘g‘risida'],
    true
),
(
    'consumer',
    '{"uz": "Iste’molchi huquqlari", "ru": "Права потребителей", "en": "Consumer rights"}'::jsonb,
    'medium',
    ARRAY['iste’molchi', 'istemolchi', 'sotuvchi', 'sifatli tovar', 'nuqsonli tovar', 'pulimni qaytaring', 'xizmat sifati'],
    'Ushbu matn iste’molchi huquqlariga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися прав потребителей.',
    'This text may be related to legal provisions concerning consumer rights.',
    ARRAY['Iste’molchilarning huquqlarini himoya qilish to‘g‘risida'],
    true
),
(
    'online_harm',
    '{"uz": "Kiberxavfsizlik va onlayn buzg‘unchilik", "ru": "Кибербезопасность и взлом", "en": "Cybersecurity and online harm"}'::jsonb,
    'high',
    ARRAY[
        'akkauntingni buzaman', 'parolingni o‘g‘irlayman', 'parolingni og''irlayman', 'akkauntingga kirib olaman', 'ma''lumotlaringni o‘chiraman', 'ma''lumotlaringni ochiraman',
        'i will hack your account', 'i will steal your password', 'i will break into your account', 'i will delete your data',
        'я взломаю твой аккаунт', 'я украду твой пароль', 'я войду в твой аккаунт', 'я удалю твои данные'
    ],
    'Ushbu matn kiberxavfsizlik, shaxsiy akkauntni buzish yoki ma’lumotlarni o‘g‘irlashga oid huquqiy normalarga aloqador bo‘lishi mumkin.',
    'Этот текст может быть связан с правовыми нормами, касающимися кибербезопасности или несанкционированного доступа.',
    'This text may be related to legal provisions concerning cybersecurity or unauthorized access.',
    ARRAY['Jinoyat kodeksi', 'Axborotlashtirish to‘g‘risida'],
    true
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    severity = EXCLUDED.severity,
    trigger_patterns = EXCLUDED.trigger_patterns,
    warning_uz = EXCLUDED.warning_uz,
    warning_ru = EXCLUDED.warning_ru,
    warning_en = EXCLUDED.warning_en,
    related_laws = EXCLUDED.related_laws,
    enabled = EXCLUDED.enabled,
    updated_at = timezone('utc'::text, now());
