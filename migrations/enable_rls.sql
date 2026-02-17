-- Enable RLS on all tables
ALTER TABLE "Clinic" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Doctor" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Survey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AdminUser" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TreatmentMenu" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuestionOption" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Question" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RateLimit" ENABLE ROW LEVEL SECURITY;

-- By default, enabling RLS denies all access to the 'anon' and 'authenticated' roles 
-- (which are used by Supabase Client) unless a policy explicitly allows it.
-- The 'postgres' user and 'service_role' key will still have access (bypassing RLS).
