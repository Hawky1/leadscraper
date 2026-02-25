-- Create searches table
CREATE TABLE searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_type TEXT NOT NULL,
  location TEXT NOT NULL,
  lead_type TEXT NOT NULL,
  leads_count INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  search_id UUID REFERENCES searches(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  phone TEXT,
  website_url TEXT,
  has_website BOOLEAN DEFAULT false,
  google_place_id TEXT,
  rating NUMERIC(2,1),
  address TEXT,
  ai_design_score INTEGER CHECK (ai_design_score >= 1 AND ai_design_score <= 10),
  ai_critique TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own searches" 
ON searches FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own searches" 
ON searches FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view leads from their searches" 
ON leads FOR SELECT 
USING (EXISTS (
    SELECT 1 FROM searches 
    WHERE searches.id = leads.search_id AND searches.user_id = auth.uid()
));
CREATE POLICY "Users can delete their own searches" 
ON searches FOR DELETE 
USING (auth.uid() = user_id);

-- Create roadmaps table
CREATE TABLE roadmaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  target_niche TEXT NOT NULL,
  goal TEXT NOT NULL,
  experience_level TEXT,
  budget TEXT,
  time_commitment TEXT,
  generated_plan JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for roadmaps
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

-- Roadmaps policies
CREATE POLICY "Users can view their own roadmaps" 
ON roadmaps FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmaps" 
ON roadmaps FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmaps" 
ON roadmaps FOR DELETE 
USING (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can view their own notifications" 
ON notifications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON notifications FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" 
ON notifications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" 
ON notifications FOR DELETE 
USING (auth.uid() = user_id);
