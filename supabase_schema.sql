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
    ('mjt-41', 'mamuriy-kodeks', $$Ma'muriy javobgarlik to'g'risidagi kodeks$$, 'Modda 41', $$Haqorat qilish$$, $$Fuqaroning sha'ni va qadr-qimmatini beodoblik bilan qasddan tahqirlash — ma'muriy javobgarlikka va belgilangan tartibda jarima solishga sabab bo'ladi.$$, $$BHMning 20 baravaridan 40 baravarigacha miqdorda jarima solishga sabab bo'ladi (MJtK 41-modda).$$, 'https://lex.uz/docs/97664#41', ARRAY['haqorat', 'haqoratlash', 'sokish', 'tahqirlash', 'qadr-qimmat'])
ON CONFLICT (id) DO NOTHING;
