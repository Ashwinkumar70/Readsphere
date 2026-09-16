-- ============================================================
-- ReadSphere Phase 2 Reader Database Schema Update
-- ============================================================

CREATE TABLE IF NOT EXISTS reading_preferences (
    user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    font_size     INT DEFAULT 18,
    font_family   TEXT DEFAULT 'Georgia, serif',
    theme         TEXT DEFAULT 'light' CHECK (theme IN ('light', 'sepia', 'dark')),
    brightness    INT DEFAULT 100,
    line_height   NUMERIC(3, 2) DEFAULT 1.5,
    margin        INT DEFAULT 24,
    reading_mode  TEXT DEFAULT 'scroll' CHECK (reading_mode IN ('scroll', 'page')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for updated_at
CREATE TRIGGER trg_reading_preferences_updated_at BEFORE UPDATE ON reading_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE reading_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reading_preferences" 
  ON reading_preferences FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reading_preferences" 
  ON reading_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reading_preferences" 
  ON reading_preferences FOR UPDATE USING (auth.uid() = user_id);
