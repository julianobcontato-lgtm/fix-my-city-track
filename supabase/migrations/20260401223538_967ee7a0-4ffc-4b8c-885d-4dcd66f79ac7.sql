-- Drop the overly permissive SELECT policy
DROP POLICY "Profiles are viewable by everyone" ON public.profiles;

-- Create owner-only SELECT policy
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);