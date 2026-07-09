-- ============================================================
-- ReadSphere Database Schema v2 — Production Quality
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────────────────
-- gen_random_uuid() is built-in from PostgreSQL 13+, no extension needed.
-- pg_trgm enables fast fuzzy text search on book titles / author names.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Auto-update trigger (applied to every table) ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ── Helper macro to attach trigger ───────────────────────────────────────
-- Called after each CREATE TABLE below.

-- ============================================================
-- 1. users
-- ============================================================
CREATE TABLE users (
    id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username      TEXT UNIQUE,
    name          TEXT NOT NULL,
    bio           TEXT,
    avatar_url    TEXT,
    phone         TEXT,
    role          TEXT NOT NULL DEFAULT 'Reader'
                  CHECK (role IN ('Reader', 'Author', 'ReaderAuthor', 'Moderator', 'Admin')),
    is_active     BOOLEAN NOT NULL DEFAULT true,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ,
    deleted_by    UUID REFERENCES users(id)
);

-- Trigger to create profile automatically on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, username, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role     ON users(role) WHERE is_active = true;

-- ============================================================
-- 2. authors
-- ============================================================
CREATE TABLE authors (
    id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    bio             TEXT,
    website         TEXT,
    social_links    JSONB DEFAULT '{}',
    total_books     INT DEFAULT 0,
    total_earnings  NUMERIC(12, 2) DEFAULT 0.00,
    is_verified     BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    deleted_by      UUID REFERENCES users(id)
);
CREATE TRIGGER trg_authors_updated_at BEFORE UPDATE ON authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. categories
-- ============================================================
CREATE TABLE categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT UNIQUE NOT NULL,
    slug        TEXT UNIQUE NOT NULL,
    description TEXT,
    icon        TEXT,
    sort_order  INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. books
-- ============================================================
CREATE TABLE books (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id           UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    title               TEXT NOT NULL,
    subtitle            TEXT,
    description         TEXT,
    isbn                TEXT UNIQUE,
    language            TEXT NOT NULL DEFAULT 'en',
    pages               INT CHECK (pages > 0),
    publisher           TEXT,
    publication_date    DATE,
    estimated_read_time INT,           -- in minutes
    cover_url           TEXT,
    cover_path          TEXT,
    pdf_url             TEXT,
    pdf_path            TEXT,
    sample_url          TEXT,          -- free sample chapter PDF
    price               NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    is_free             BOOLEAN NOT NULL DEFAULT true,
    status              TEXT NOT NULL DEFAULT 'Draft'
                        CHECK (status IN ('Draft','Pending Review','Approved','Published','Rejected','Archived')),
    views               BIGINT NOT NULL DEFAULT 0,
    downloads           BIGINT NOT NULL DEFAULT 0,
    likes_count         INT NOT NULL DEFAULT 0,
    average_rating      NUMERIC(3, 2) DEFAULT 0.00,
    rating_count        INT NOT NULL DEFAULT 0,
    search_vector       TSVECTOR,      -- populated via trigger for FTS
    is_active           BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,
    deleted_by          UUID REFERENCES users(id)
);
CREATE TRIGGER trg_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Full-text search trigger
CREATE OR REPLACE FUNCTION books_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.subtitle, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(NEW.publisher, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_books_search_vector BEFORE INSERT OR UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION books_search_vector_update();

CREATE INDEX idx_books_author_id    ON books(author_id);
CREATE INDEX idx_books_status       ON books(status) WHERE is_active = true;
CREATE INDEX idx_books_is_free      ON books(is_free) WHERE status = 'Published';
CREATE INDEX idx_books_language     ON books(language);
CREATE INDEX idx_books_search       ON books USING GIN(search_vector);
CREATE INDEX idx_books_title_trgm   ON books USING GIN(title gin_trgm_ops);

-- ============================================================
-- 5. book_categories
-- ============================================================
CREATE TABLE book_categories (
    book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, category_id)
);
CREATE INDEX idx_book_categories_category ON book_categories(category_id);

-- ============================================================
-- 6. bookmarks (wishlist)
-- ============================================================
CREATE TABLE bookmarks (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- ============================================================
-- 7. cart_items
-- ============================================================
CREATE TABLE cart_items (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- ============================================================
-- 8. collections
-- ============================================================
CREATE TABLE collections (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    cover_url   TEXT,
    is_public   BOOLEAN DEFAULT false,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at  TIMESTAMPTZ
);
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_collections_user_id ON collections(user_id);

-- ============================================================
-- 9. collection_books (books inside a collection)
-- ============================================================
CREATE TABLE collection_books (
    collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
    book_id       UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    added_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (collection_id, book_id)
);

-- ============================================================
-- 10. clubs
-- ============================================================
CREATE TABLE clubs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name             TEXT NOT NULL,
    description      TEXT,
    image_url        TEXT,
    is_public        BOOLEAN NOT NULL DEFAULT true,
    invite_token     TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    current_book_id  UUID REFERENCES books(id),
    max_members      INT DEFAULT 100,
    member_count     INT NOT NULL DEFAULT 0,
    is_active        BOOLEAN NOT NULL DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at       TIMESTAMPTZ,
    deleted_by       UUID REFERENCES users(id)
);
CREATE TRIGGER trg_clubs_updated_at BEFORE UPDATE ON clubs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_clubs_owner_id    ON clubs(owner_id);
CREATE INDEX idx_clubs_invite_token ON clubs(invite_token);
CREATE INDEX idx_clubs_is_public   ON clubs(is_public) WHERE is_active = true;

-- ============================================================
-- 11. club_members
-- ============================================================
CREATE TABLE club_members (
    club_id    UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role       TEXT NOT NULL DEFAULT 'Member'
               CHECK (role IN ('Member', 'Moderator', 'Owner')),
    joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active  BOOLEAN NOT NULL DEFAULT true,
    PRIMARY KEY (club_id, user_id)
);
CREATE INDEX idx_club_members_user_id ON club_members(user_id);

-- ============================================================
-- 12. club_books (reading list for a club)
-- ============================================================
CREATE TABLE club_books (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id     UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    added_by    UUID REFERENCES users(id),
    is_current  BOOLEAN DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (club_id, book_id)
);

-- ============================================================
-- 13. club_events
-- ============================================================
CREATE TABLE club_events (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id      UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    created_by   UUID REFERENCES users(id),
    title        TEXT NOT NULL,
    description  TEXT,
    event_date   TIMESTAMPTZ,
    meeting_link TEXT,
    is_active    BOOLEAN DEFAULT true,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_club_events_updated_at BEFORE UPDATE ON club_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_club_events_club_id ON club_events(club_id);

-- ============================================================
-- 14. reviews
-- ============================================================
CREATE TABLE reviews (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id           UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating            SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment           TEXT,
    is_spoiler        BOOLEAN DEFAULT false,
    verified_purchase BOOLEAN DEFAULT false,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ,
    UNIQUE (book_id, user_id)  -- one review per user per book
);
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);

CREATE TABLE review_likes (
    review_id  UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (review_id, user_id)
);
CREATE INDEX idx_review_likes_user ON review_likes(user_id);

-- ============================================================
-- 15. reading_progress
-- ============================================================
CREATE TABLE reading_progress (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id             UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    progress_percentage SMALLINT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    current_page        INT DEFAULT 0,
    last_page           INT DEFAULT 0,
    daily_reading_time  INT DEFAULT 0,     -- minutes read today
    reading_streak      INT DEFAULT 0,     -- consecutive days
    completed_at        TIMESTAMPTZ,
    last_read_at        TIMESTAMPTZ DEFAULT NOW(),
    is_active           BOOLEAN DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, book_id)
);
CREATE TRIGGER trg_reading_progress_updated_at BEFORE UPDATE ON reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_reading_progress_user_id ON reading_progress(user_id);

-- ============================================================
-- 16. reading_history
-- ============================================================
CREATE TABLE reading_history (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    action     TEXT NOT NULL CHECK (action IN ('opened','bookmarked','completed','reviewed','shared')),
    metadata   JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_reading_history_user_id ON reading_history(user_id);
CREATE INDEX idx_reading_history_book_id ON reading_history(book_id);

-- ============================================================
-- 17. subscriptions
-- ============================================================
CREATE TABLE subscriptions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan              TEXT NOT NULL CHECK (plan IN ('Basic', 'Pro', 'Premium', 'Enterprise')),
    status            TEXT NOT NULL DEFAULT 'Active'
                      CHECK (status IN ('Active','Cancelled','Expired','Paused','Trial')),
    payment_provider  TEXT DEFAULT 'stripe',
    transaction_id    TEXT,
    auto_renew        BOOLEAN DEFAULT true,
    start_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date          TIMESTAMPTZ,
    cancelled_at      TIMESTAMPTZ,
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ
);
CREATE TRIGGER trg_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status  ON subscriptions(status) WHERE is_active = true;

-- ============================================================
-- 18. payments
-- ============================================================
CREATE TABLE payments (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount           NUMERIC(10, 2) NOT NULL,
    tax_amount       NUMERIC(10, 2) DEFAULT 0.00,
    discount_amount  NUMERIC(10, 2) DEFAULT 0.00,
    currency         TEXT NOT NULL,
    coupon_code      TEXT,
    status           TEXT NOT NULL DEFAULT 'Pending'
                     CHECK (status IN ('Pending','Completed','Failed','Refunded','Disputed')),
    payment_provider TEXT DEFAULT 'stripe',
    transaction_id   TEXT UNIQUE,
    invoice_number   TEXT UNIQUE,
    refund_status    TEXT CHECK (refund_status IN ('None','Requested','Partial','Full')),
    refund_amount    NUMERIC(10, 2),
    metadata         JSONB DEFAULT '{}',
    is_active        BOOLEAN DEFAULT true,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status  ON payments(status);

-- ============================================================
-- 19. purchases
-- ============================================================
CREATE TABLE purchases (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id),
    amount     NUMERIC(10, 2) NOT NULL,
    currency   TEXT NOT NULL,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, book_id)  -- prevent duplicate purchases
);
CREATE INDEX idx_purchases_user_id ON purchases(user_id);
CREATE INDEX idx_purchases_book_id ON purchases(book_id);

-- ============================================================
-- 20. notifications
-- ============================================================
CREATE TABLE notifications (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    actor_id   UUID REFERENCES users(id),   -- who triggered this notification
    type       TEXT NOT NULL,
    title      TEXT,
    content    TEXT NOT NULL,
    url        TEXT,                         -- deep link URL
    metadata   JSONB DEFAULT '{}',
    is_read    BOOLEAN NOT NULL DEFAULT false,
    read_at    TIMESTAMPTZ,
    is_active  BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread  ON notifications(user_id, is_read) WHERE is_read = false;

-- ============================================================
-- 21. notification_preferences
-- ============================================================
CREATE TABLE notification_preferences (
    user_id              UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    book_approved        BOOLEAN DEFAULT true,
    book_rejected        BOOLEAN DEFAULT true,
    new_message          BOOLEAN DEFAULT true,
    club_activity        BOOLEAN DEFAULT true,
    new_follower         BOOLEAN DEFAULT true,
    review_reply         BOOLEAN DEFAULT true,
    announcement         BOOLEAN DEFAULT true,
    email_notifications  BOOLEAN DEFAULT true,
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 22. messages
-- ============================================================
CREATE TABLE messages (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES users(id) ON DELETE CASCADE,
    club_id     UUID REFERENCES clubs(id) ON DELETE CASCADE,
    content         TEXT NOT NULL CHECK (char_length(content) <= 5000),
    reply_to_id     UUID REFERENCES messages(id) ON DELETE SET NULL,
    attachments     JSONB DEFAULT '[]',
    delivery_status TEXT DEFAULT 'sent' CHECK (delivery_status IN ('sent', 'delivered', 'read')),
    edited_at       TIMESTAMPTZ,
    is_deleted      BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT msg_target_check CHECK (
      (receiver_id IS NOT NULL AND club_id IS NULL) OR
      (receiver_id IS NULL AND club_id IS NOT NULL)
    )
);
CREATE TRIGGER trg_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_messages_club_id    ON messages(club_id, created_at DESC) WHERE club_id IS NOT NULL;
CREATE INDEX idx_messages_dm         ON messages(sender_id, receiver_id) WHERE club_id IS NULL;

-- ============================================================
-- 23. ai_conversations
-- ============================================================
CREATE TABLE ai_conversations (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id     UUID REFERENCES books(id),
    title       TEXT,
    model_used  TEXT DEFAULT 'gemini-2.0-flash',
    total_tokens INT DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_ai_conversations_updated_at BEFORE UPDATE ON ai_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE INDEX idx_ai_conversations_user_id ON ai_conversations(user_id);

-- ============================================================
-- 24. ai_messages
-- ============================================================
CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content         TEXT NOT NULL,
    tokens_used     INT DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- ============================================================
-- 25. ai_credits
-- ============================================================
CREATE TABLE ai_credits (
    user_id           UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    credits_total     INT NOT NULL DEFAULT 100,
    credits_used      INT NOT NULL DEFAULT 0,
    credits_remaining INT GENERATED ALWAYS AS (credits_total - credits_used) STORED,
    reset_at          TIMESTAMPTZ,
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 26. book_summaries (AI-generated)
-- ============================================================
CREATE TABLE book_summaries (
    book_id        UUID PRIMARY KEY REFERENCES books(id) ON DELETE CASCADE,
    summary_short  TEXT,
    summary_long   TEXT,
    key_themes     TEXT[],
    model_used     TEXT,
    generated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors                ENABLE ROW LEVEL SECURITY;
ALTER TABLE books                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections            ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_books       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members           ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_books             ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_events            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews                ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_history        ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments               ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications          ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations       ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credits             ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_summaries         ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Service Role bypasses all of these)
CREATE POLICY "Users read own profile"        ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile"      ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public read published books"   ON books FOR SELECT USING (status = 'Published' AND is_active = true);
CREATE POLICY "Public read categories"        ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active clubs"      ON clubs FOR SELECT USING (is_public = true AND is_active = true);
CREATE POLICY "Users manage own bookmarks"    ON bookmarks USING (auth.uid() = user_id);
CREATE POLICY "Users manage own cart"         ON cart_items USING (auth.uid() = user_id);
CREATE POLICY "Users read own notifications"  ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own purchases"      ON purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own progress"       ON reading_progress USING (auth.uid() = user_id);
CREATE POLICY "Users read own AI history"     ON ai_conversations USING (auth.uid() = user_id);
CREATE POLICY "Public read book summaries"    ON book_summaries FOR SELECT USING (true);

-- Messages RLS
CREATE POLICY "Users insert messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users view relevant messages" ON messages FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id OR 
        club_id IN (SELECT club_id FROM club_members WHERE user_id = auth.uid()));

-- Reviews RLS
CREATE POLICY "Users insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reviews" ON reviews FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (is_active = true);

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('avatars',           'avatars',           true),
  ('book-covers',       'book-covers',       true),
  ('book-pdfs',         'book-pdfs',         false),
  ('club-images',       'club-images',       true),
  ('author-documents',  'author-documents',  false),
  ('temp-uploads',      'temp-uploads',      false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Avatars public read"           ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Book covers public read"       ON storage.objects FOR SELECT USING (bucket_id = 'book-covers');
CREATE POLICY "Club images public read"       ON storage.objects FOR SELECT USING (bucket_id = 'club-images');
CREATE POLICY "Book PDFs auth only"           ON storage.objects FOR SELECT
  USING (bucket_id = 'book-pdfs' AND auth.role() = 'authenticated');
CREATE POLICY "Author docs auth only"         ON storage.objects FOR SELECT
  USING (bucket_id = 'author-documents' AND auth.role() = 'authenticated');

-- Storage Upload Policies
CREATE POLICY "Users upload avatars" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users update own avatars" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars' AND owner = auth.uid());
CREATE POLICY "Users delete own avatars" ON storage.objects FOR DELETE 
  USING (bucket_id = 'avatars' AND owner = auth.uid());

-- ============================================================
-- HELPER SQL FUNCTION: Sum total revenue (used by admin analytics)
-- ============================================================
CREATE OR REPLACE FUNCTION get_total_revenue()
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'Completed';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================
-- HELPER SQL FUNCTION: Send announcement to all users efficiently
-- ============================================================
CREATE OR REPLACE FUNCTION broadcast_announcement(p_content TEXT)
RETURNS INT AS $$
DECLARE inserted_count INT;
BEGIN
  INSERT INTO notifications (user_id, type, content)
  SELECT id, 'announcement', p_content
  FROM users WHERE is_active = true;
  GET DIAGNOSTICS inserted_count = ROW_COUNT;
  RETURN inserted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
