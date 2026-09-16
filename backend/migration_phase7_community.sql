-- Phase 7 Community Module Schema

-- 1. Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    description text,
    banner_url text,
    rules text,
    is_private boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.club_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    role text DEFAULT 'member' CHECK (role IN ('owner', 'moderator', 'member')),
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(club_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.club_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id uuid REFERENCES public.clubs(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    is_pinned boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 2. Collections
CREATE TABLE IF NOT EXISTS public.collections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    is_private boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.collection_books (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
    book_id uuid REFERENCES public.books(id) ON DELETE CASCADE,
    sort_order integer DEFAULT 0,
    added_at timestamp with time zone DEFAULT now(),
    UNIQUE(collection_id, book_id)
);

-- 3. Social (Comments & Followers)
CREATE TABLE IF NOT EXISTS public.author_followers (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    author_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(follower_id, author_id)
);

CREATE TABLE IF NOT EXISTS public.comments (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    book_id uuid REFERENCES public.books(id) ON DELETE CASCADE,
    parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE,
    content text NOT NULL,
    likes integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 4. Challenges & Leaderboards
CREATE TABLE IF NOT EXISTS public.reading_challenges (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    creator_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    goal_type text NOT NULL, -- e.g., 'books_read', 'pages_read'
    target_value integer NOT NULL,
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.challenge_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    challenge_id uuid REFERENCES public.reading_challenges(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    current_progress integer DEFAULT 0,
    joined_at timestamp with time zone DEFAULT now(),
    UNIQUE(challenge_id, user_id)
);

-- Realtime Publications
-- Note: You may need to run these manually or ensure they don't already exist.
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.club_messages;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.challenge_members;

-- Basic RLS
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.author_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_members ENABLE ROW LEVEL SECURITY;
