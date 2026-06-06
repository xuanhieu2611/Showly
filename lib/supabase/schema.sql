-- Showly Database Schema
-- Run this as a migration in Supabase SQL Editor

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLES
-- ============================================================

-- Core identity (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  account_type TEXT CHECK (account_type IN ('artist', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artist public profile
CREATE TABLE IF NOT EXISTS public.artist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT CHECK (char_length(bio) <= 300),
  city TEXT NOT NULL,
  district TEXT NOT NULL,
  price_range TEXT CHECK (price_range IN ('contact', 'under_200k', '200k_500k', '500k_1m', 'above_1m')),
  years_experience TEXT CHECK (years_experience IN ('under_1', '1_3', '3_5', '5_plus')),
  instagram_url TEXT,
  tiktok_url TEXT,
  contact_info TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artist specialties (one-to-many)
CREATE TABLE IF NOT EXISTS public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  specialty TEXT CHECK (specialty IN ('nail', 'makeup', 'hair'))
);

-- Portfolio photos
CREATE TABLE IF NOT EXISTS public.portfolio_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  title TEXT,
  description TEXT CHECK (char_length(description) <= 200),
  sort_order INTEGER DEFAULT 0,
  is_cover BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Style tags on photos
CREATE TABLE IF NOT EXISTS public.photo_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES public.portfolio_photos(id) ON DELETE CASCADE,
  tag_slug TEXT NOT NULL,
  specialty TEXT NOT NULL
);

-- Client reviews
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT CHECK (char_length(review_text) <= 150),
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(artist_id, reviewer_id)
);

-- Profile view analytics (privacy-safe)
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID REFERENCES public.artist_profiles(id) ON DELETE CASCADE,
  viewer_ip_hash TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_artist_profiles_username ON public.artist_profiles(username);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_city ON public.artist_profiles(city);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_district ON public.artist_profiles(district);
CREATE INDEX IF NOT EXISTS idx_artist_profiles_published ON public.artist_profiles(is_published);
CREATE INDEX IF NOT EXISTS idx_specialties_artist_id ON public.specialties(artist_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_photos_artist_id ON public.portfolio_photos(artist_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_photos_sort ON public.portfolio_photos(artist_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_reviews_artist_id ON public.reviews(artist_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_artist_id ON public.profile_views(artist_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at on artist_profiles
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_artist_profiles_updated_at
  BEFORE UPDATE ON public.artist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enforce only one cover photo per artist (unset previous cover)
CREATE OR REPLACE FUNCTION public.enforce_single_cover_photo()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_cover = TRUE THEN
    UPDATE public.portfolio_photos
    SET is_cover = FALSE
    WHERE artist_id = NEW.artist_id
      AND id != NEW.id
      AND is_cover = TRUE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_single_cover
  BEFORE INSERT OR UPDATE ON public.portfolio_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_single_cover_photo();

-- Auto-create user row from auth.users on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Users: can read own row, update own row
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Artist profiles: published profiles are public, owner can edit
CREATE POLICY "Published artist profiles are public" ON public.artist_profiles
  FOR SELECT USING (is_published = TRUE OR auth.uid() = user_id);

CREATE POLICY "Artists can insert own profile" ON public.artist_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Artists can update own profile" ON public.artist_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Specialties: readable if profile is public, editable by owner
CREATE POLICY "Specialties readable with published profile" ON public.specialties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND (ap.is_published = TRUE OR ap.user_id = auth.uid())
    )
  );

CREATE POLICY "Artists can manage own specialties" ON public.specialties
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND ap.user_id = auth.uid()
    )
  );

-- Portfolio photos: public if artist is published, editable by owner
CREATE POLICY "Photos readable with published profile" ON public.portfolio_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND (ap.is_published = TRUE OR ap.user_id = auth.uid())
    )
  );

CREATE POLICY "Artists can manage own photos" ON public.portfolio_photos
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND ap.user_id = auth.uid()
    )
  );

-- Photo tags: same as portfolio photos
CREATE POLICY "Tags readable with published profile" ON public.photo_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_photos pp
      JOIN public.artist_profiles ap ON ap.id = pp.artist_id
      WHERE pp.id = photo_id AND (ap.is_published = TRUE OR ap.user_id = auth.uid())
    )
  );

CREATE POLICY "Artists can manage own photo tags" ON public.photo_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_photos pp
      JOIN public.artist_profiles ap ON ap.id = pp.artist_id
      WHERE pp.id = photo_id AND ap.user_id = auth.uid()
    )
  );

-- Reviews: public for published artists, insert by logged-in users
CREATE POLICY "Reviews are public for published artists" ON public.reviews
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND ap.is_published = TRUE
    )
  );

CREATE POLICY "Logged-in users can write reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Reviewers can update own reviews" ON public.reviews
  FOR UPDATE USING (auth.uid() = reviewer_id);

-- Profile views: insert only (privacy-safe, no raw data)
CREATE POLICY "Anyone can log a profile view" ON public.profile_views
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Artists can view own profile stats" ON public.profile_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.artist_profiles ap
      WHERE ap.id = artist_id AND ap.user_id = auth.uid()
    )
  );
