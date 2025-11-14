-- Create ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  raw_idea TEXT NOT NULL,
  refinement JSONB,
  product JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create files table for storing file information
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID REFERENCES ideas(id) ON DELETE CASCADE,
  format TEXT NOT NULL CHECK (format IN ('pdf', 'docx')),
  r2_key TEXT NOT NULL,
  download_url TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_ideas_user_id ON ideas(user_id);
CREATE INDEX idx_ideas_created_at ON ideas(created_at DESC);
CREATE INDEX idx_files_idea_id ON files(idea_id);

-- Set up RLS (Row Level Security) - Optional if using auth
-- ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE files ENABLE ROW LEVEL SECURITY;