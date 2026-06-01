-- Normalize business status: migrate 'active' to 'approved'
-- The public filtering logic expects 'approved' for visibility
-- Admin moderation uses: pending, approved, rejected, suspended
UPDATE "Business" SET status = 'approved' WHERE status = 'active';
