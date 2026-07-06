-- Add member_slug and portal_url columns to members table
ALTER TABLE members
ADD COLUMN IF NOT EXISTS member_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS portal_url TEXT;

-- Function to generate a simple slug
CREATE OR REPLACE FUNCTION generate_slug(full_name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  clean_slug TEXT;
BEGIN
  -- Convert to lowercase
  base_slug := lower(full_name);
  -- Replace non-alphanumeric characters with hyphens
  clean_slug := regexp_replace(base_slug, '[^a-z0-9]+', '-', 'g');
  -- Remove leading/trailing hyphens
  clean_slug := trim(both '-' from clean_slug);
  RETURN clean_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to auto-generate slug and portal_url
CREATE OR REPLACE FUNCTION set_member_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  duplicate_count INT;
BEGIN
  -- Only generate if not manually provided
  IF NEW.member_slug IS NULL THEN
    base_slug := generate_slug(NEW.full_name);
    final_slug := base_slug;
    
    -- Check if slug exists (excluding current row if updating)
    SELECT COUNT(*) INTO duplicate_count 
    FROM members 
    WHERE member_slug = final_slug 
      AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid);
    
    -- If duplicate, append the member_id (which is populated by another trigger before this)
    -- Wait, if member_id is populated by a BEFORE INSERT trigger, it might be available here
    -- if this trigger runs AFTER the other one. 
    -- Alternatively, just append a random string if member_id is missing.
    IF duplicate_count > 0 THEN
      IF NEW.member_id IS NOT NULL THEN
        final_slug := base_slug || '-' || lower(NEW.member_id);
      ELSE
        final_slug := base_slug || '-' || floor(random() * 10000)::text;
      END IF;
    END IF;
    
    NEW.member_slug := final_slug;
  END IF;

  -- Always ensure portal_url matches the slug
  NEW.portal_url := 'http://localhost:3000/member/' || NEW.member_slug;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_member_slug ON members;
CREATE TRIGGER trg_set_member_slug
BEFORE INSERT OR UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION set_member_slug();

-- Backfill existing members to trigger the update
UPDATE members SET member_slug = NULL WHERE member_slug IS NULL;
