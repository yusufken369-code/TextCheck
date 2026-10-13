-- Huquqiy Keyboard - Supabase Database Schema Script

-- 1. Create Profiles Table (Foydalanuvchilar profili)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);


-- 2. Create Legal Documents Table (Huquqiy hujjatlar jadvali)
CREATE TABLE IF NOT EXISTS public.legal_documents (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    article_count INT DEFAULT 0,
    doc_number TEXT,
    adoption_date TEXT,
    effective_date TEXT,
    lex_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for legal_documents
ALTER TABLE public.legal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Legal documents are viewable by everyone" ON public.legal_documents
    FOR SELECT USING (true);


-- 3. Create Legal Articles Table (Huquqiy moddalar jadvali)
CREATE TABLE IF NOT EXISTS public.legal_articles (
    id TEXT PRIMARY KEY,
    document_id TEXT REFERENCES public.legal_documents(id) ON DELETE CASCADE,
    document_title TEXT NOT NULL,
    article_number TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    penalty_text TEXT,
    lex_url TEXT,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for legal_articles
ALTER TABLE public.legal_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Legal articles are viewable by everyone" ON public.legal_articles
    FOR SELECT USING (true);


-- 4. Create User Activity Logs Table (Klaviatura ogohlantirishlari tarixi)
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    detected_keyword TEXT,
    matched_article_id TEXT,
    warning_title TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for user_activity_logs
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert activity logs" ON public.user_activity_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);


-- 5. Seed Initial Data for Legal Documents
INSERT INTO public.legal_documents (id, title, article_count, doc_number, adoption_date, effective_date, lex_url)
VALUES 
    ('konstitutsiya', $$O'zbekiston Respublikasi Konstitutsiyasi$$, 128, $$O'RQ-828$$, '2023-04-30', '2023-05-01', 'https://lex.uz/docs/6445145'),
    ('jinoyat-kodeksi', $$Jinoyat kodeksi$$, 486, '757-XII', '1994-09-22', '1995-04-01', 'https://lex.uz/docs/111453'),
    ('mamuriy-kodeks', $$Ma'muriy javobgarlik to'g'risidagi kodeks$$, 432, '2015-XII', '1994-09-22', '1995-04-01', 'https://lex.uz/docs/97664')
ON CONFLICT (id) DO NOTHING;


-- 6. Seed Initial Data for Legal Articles
INSERT INTO public.legal_articles (id, document_id, document_title, article_number, title, content, penalty_text, lex_url, keywords)
VALUES 
    ('mjt-183', 'mamuriy-kodeks', $$Ma'muriy javobgarlik to'g'risidagi kodeks$$, 'Modda 183', $$Axborot sohasidagi huquqbuzarliklar$$, $$Axborotning tarqatilishi tartibini buzish, shuningdek, internet tarmog'ida qonun hujjatlarida taqiqlangan axborotlarni tarqatish — ma'muriy javobgarlikka sabab bo'ladi.$$, $$BHMning 3 baravaridan 5 baravarigacha jarima yoki 15 sutkagacha ma'muriy qamoq jazosi qo'llaniladi.$$, 'https://lex.uz/docs/97664#183', ARRAY['internet', 'axborot', 'tarmoq', 'tarqatish', 'post', 'kontent', 'taqiqlangan', 'haqorat']),
    ('mjt-41', 'mamuriy-kodeks', $$Ma'muriy javobgarlik to'g'risidagi kodeks$$, 'Modda 41', $$Haqorat qilish$$, $$Fuqaroning sha'ni va qadr-qimmatini beodoblik bilan qasddan tahqirlash — ma'muriy javobgarlikka va belgilangan tartibda jarima solishga sabab bo'ladi.$$, $$BHMning 20 baravaridan 40 baravarigacha miqdorda jarima solishga sabab bo'ladi (MJtK 41-modda).$$, 'https://lex.uz/docs/97664#41', ARRAY['haqorat', 'haqoratlash', 'sokish', 'tahqirlash', 'qadr-qimmat']),
    ('jk-97', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 97', $$Qasddan odam o'ldirish$$, $$Qasddan odam o'ldirish — 10 yildan 15 yilgacha ozodlikdan mahrum qilish bilan jazolanadi. Javobgarlikni og'irlashtiradigan holatlarda — 15 yildan 25 yilgacha ozodlikdan mahrum qilish yoki umrbod ozodlikdan mahrum qilish jazosi tayinlanadi.$$, $$10 yildan 25 yilgacha yoki umrbod ozodlikdan mahrum qilish (JK 97-modda).$$, 'https://lex.uz/docs/111453#233850', ARRAY['odam o'ldirish', 'qasddan odam o'ldirish', 'qotillik', 'o'ldirish']),
    ('jk-98', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 98', $$Kuchli ruhiy hayajonlanish holatida qasddan odam o'ldirish$$, $$Jabrlanuvchi tomonidan qilingan g'ayriqonuniy zo'rlik yoki og'ir haqorat tufayli to'satdan yuz bergan kuchli ruhiy hayajonlanish holatida qasddan odam o'ldirish.$$, $$2 yildan 5 yilgacha ozodlikni cheklash yoxud 5 yilgacha ozodlikdan mahrum qilish (JK 98-modda).$$, 'https://lex.uz/docs/111453#233909', ARRAY['ruhiy hayajonlanish', 'afekt', 'hayajonlanishda o'ldirish']),
    ('jk-99', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 99', $$Onaning o'z chaqalog'ini qasddan o'ldirishi$$, $$Onaning o'z chaqalog'ini tug'ish vaqtida yoki tug'ilishi hamon qasddan o'ldirishi.$$, $$1 yildan 3 yilgacha ozodlikni cheklash yoxud 3 yilgacha ozodlikdan mahrum qilish (JK 99-modda).$$, 'https://lex.uz/docs/111453', ARRAY['chaqaloqni o'ldirish', 'onaning o'ldirishi']),
    ('jk-102', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 102', $$Ehtiyotsizlik orqasida odam o'ldirish$$, $$Ehtiyotsizlik orqasida odam o'ldirish — 2 yilgacha axloq tuzatish ishlari yoki 1 yildan 3 yilgacha ozodlikni cheklash yoxud 3 yilgacha ozodlikdan mahrum qilish.$$, $$2 yilgacha axloq tuzatish ishlari yoki 3 yilgacha ozodlikdan mahrum qilish (JK 102-modda).$$, 'https://lex.uz/docs/111453', ARRAY['ehtiyotsizlikdan o'ldirish', 'beparvolik o'lim']),
    ('jk-103', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 103', $$O'zini o'zi o'ldirish darajasiga yetkazish$$, $$Shaxsni qo'rqitish, unga rahmsiz muomala qilish yoki uning sha'ni va qadr-qimmatini muttasil kamsitish natijasida o'zini o'zi o'ldirish darajasiga yetkazish.$$, $$3 yildan 7 yilgacha ozodlikdan mahrum qilish (JK 103-modda).$$, 'https://lex.uz/docs/111453', ARRAY['o'zini o'ldirishga yetkazish', 'suitsid', 'o'zini osishga majbur']),
    ('jk-1031', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 103-1', $$O'zini o'zi o'ldirishga undash$$, $$O'zini o'zi o'ldirishga undash, ya'ni ko'ndirish, aldash yoki boshqa yo'l bilan o'zga shaxsda o'zini o'zi o'ldirish hissini uyg'otish.$$, $$2 yildan 5 yilgacha ozodlikni cheklash yoxud 5 yilgacha ozodlikdan mahrum qilish (JK 103-1-modda).$$, 'https://lex.uz/docs/111453', ARRAY['o'zini o'ldirishga undash', 'suitsidga undash']),
    ('jk-104', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 104', $$Qasddan badanga og'ir shikast yetkazish$$, $$Sodir etilayotgan paytda hayot uchun xavfli bo'lgan qasddan badanga og'ir shikast yetkazish natijasida ko'rish, so'zlash, eshitish qobiliyatini yo'qotish yoxud biron a'zoning ishdan chiqishiga sabab bo'lsa.$$, $$3 yildan 5 yilgacha ozodlikdan mahrum qilish (og'irlashtiruvchi holatlarda 5 yildan 10 yilgacha) (JK 104-modda).$$, 'https://lex.uz/docs/111453#233940', ARRAY['badanga og'ir shikast', 'og'ir tan jarohati', 'nogiron qilish', 'shikast yetkazish']),
    ('jk-105', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 105', $$Qasddan badanga o'rtacha og'ir shikast yetkazish$$, $$Hayot uchun xavfli bo'lmagan, lekin sog'liqning uzoq vaqt (kamida 21 kun) yomonlashuviga sabab bo'lgan qasddan badanga o'rtacha og'ir shikast yetkazish.$$, $$360 soatgacha majburiy jamoat ishlari yoki 3 yilgacha ozodlikdan mahrum qilish (JK 105-modda).$$, 'https://lex.uz/docs/111453#233975', ARRAY['badanga o'rtacha shikast', 'tan jarohati', 'urib sindirish']),
    ('jk-106', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 106', $$Kuchli ruhiy hayajonlanish holatida qasddan badanga og'ir yoki o'rtacha og'ir shikast yetkazish$$, $$Jabrlanuvchi tomonidan qilingan g'ayriqonuniy zo'rlik yoki og'ir haqorat tufayli to'satdan yuz bergan kuchli ruhiy hayajonlanish holatida qasddan badanga og'ir shikast yetkazish.$$, $$BHMning 50 baravaridan 100 baravarigacha jarima yoki 3 yilgacha ozodlikdan mahrum qilish (JK 106-modda).$$, 'https://lex.uz/docs/111453#234098', ARRAY['afektda shikast yetkazish', 'hayajonda urish']),
    ('jk-1', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 1', $$O'zbekiston Respublikasining jinoyat to'g'risidagi qonunchiligi$$, $$O'zbekiston Respublikasining jinoyat to'g'risidagi qonunchiligi Konstitutsiya va xalqaro huquqning umum e'tirof etgan normalariga asoslangan bo'lib, ushbu Kodeksdan iboratdir.$$, $$Jinoyat qonunchiligining asosiy manbasi (JK 1-modda).$$, 'https://lex.uz/docs/111453#111454', ARRAY['jinoyat to'g'risidagi qonunchilik', 'konstitutsiya', 'xalqaro huquq']),
    ('jk-2', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 2', $$Kodeksning vazifalari$$, $$Jinoyat kodeksining vazifalari shaxsni, uning huquq va erkinliklarini, jamiyat va davlat manfaatlarini, mulkni, tabiiy muhitni, tinchlikni, insoniyat xavfsizligini jinoiy tajovuzlardan qo'riqlash, shuningdek jinoyatlarning oldini olish.$$, $$Shaxs, mulk va tinchlikni jinoiy tajovuzlardan qo'riqlash (JK 2-modda).$$, 'https://lex.uz/docs/111453#111455', ARRAY['kodeksning vazifalari', 'jinoiy tajovuz', 'oldini olish']),
    ('jk-3', 'jinoyat-kodeksi', $$Jinoyat kodeksi$$, 'Modda 3', $$Kodeksning prinsiplari$$, $$Jinoyat kodeksi qonuniylik, fuqarolarning qonun oldida tengligi, demokratizm, insonparvarlik, odillik, ayb uchun javobgarlik, javobgarlikning muqarrarligi prinsiplariga asoslanadi.$$, $$Qonuniylik, insonparvarlik, odillik va javobgarlikning muqarrarligi (JK 3-modda).$$, 'https://lex.uz/docs/111453#111456', ARRAY['qonuniylik', 'insonparvarlik', 'odillik', 'javobgarlikning muqarrarligi'])
ON CONFLICT (id) DO NOTHING;
