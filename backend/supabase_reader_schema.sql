-- ============================================================
-- ReadSphere Phase 2 Reader Database Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. page_bookmarks
CREATE TABLE IF NOT EXISTS page_bookmarks (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    note       TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, book_id, page_number)
);
CREATE TRIGGER trg_page_bookmarks_updated_at BEFORE UPDATE ON page_bookmarks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. highlights
CREATE TABLE IF NOT EXISTS highlights (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    text_content TEXT NOT NULL,
    color      TEXT DEFAULT 'yellow',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_highlights_updated_at BEFORE UPDATE ON highlights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. notes
CREATE TABLE IF NOT EXISTS notes (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id    UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    page_number INT,
    content    TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_notes_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 4. reading_goals
CREATE TABLE IF NOT EXISTS reading_goals (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_books INT NOT NULL DEFAULT 12,
    year       INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, year)
);
CREATE TRIGGER trg_reading_goals_updated_at BEFORE UPDATE ON reading_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. achievements
CREATE TABLE IF NOT EXISTS achievements (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          TEXT NOT NULL UNIQUE,
    description   TEXT,
    icon          TEXT,
    criteria_type TEXT,
    criteria_value INT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Insert Default Achievements
INSERT INTO achievements (name, description, icon, criteria_type, criteria_value)
VALUES 
  ('First Book', 'Completed your first book.', 'Award', 'books_read', 1),
  ('Bookworm', 'Read 5 books.', 'BookOpen', 'books_read', 5),
  ('Avid Reader', 'Read 10 books.', 'Flame', 'books_read', 10),
  ('Streak Master', 'Achieved a 7-day reading streak.', 'Zap', 'streak_days', 7)
ON CONFLICT (name) DO NOTHING;


-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE page_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own page_bookmarks" ON page_bookmarks USING (auth.uid() = user_id);
CREATE POLICY "Users manage own highlights"     ON highlights USING (auth.uid() = user_id);
CREATE POLICY "Users manage own notes"          ON notes USING (auth.uid() = user_id);
CREATE POLICY "Users manage own reading_goals"  ON reading_goals USING (auth.uid() = user_id);
CREATE POLICY "Public read achievements"        ON achievements FOR SELECT USING (true);
CREATE POLICY "Users read own achievements"     ON user_achievements FOR SELECT USING (auth.uid() = user_id);
