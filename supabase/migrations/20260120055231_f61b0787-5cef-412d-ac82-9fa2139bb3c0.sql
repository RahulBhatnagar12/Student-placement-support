-- Create placement_submissions table
CREATE TABLE public.placement_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  roll_number TEXT NOT NULL,
  branch TEXT NOT NULL,
  programme TEXT NOT NULL,
  personal_note TEXT,
  companies_shortlisted JSONB NOT NULL DEFAULT '[]',
  selected_company TEXT NOT NULL,
  selected_profile TEXT NOT NULL,
  selection_process TEXT NOT NULL,
  technical_questions TEXT,
  hr_questions TEXT,
  preparation_resources TEXT,
  advice_dos TEXT,
  advice_donts TEXT,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.placement_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (all submissions are public)
CREATE POLICY "Anyone can view placement submissions" 
ON public.placement_submissions 
FOR SELECT 
USING (true);

-- Create policy for public insert (anyone can submit)
CREATE POLICY "Anyone can insert placement submissions" 
ON public.placement_submissions 
FOR INSERT 
WITH CHECK (consent_given = true);

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('placement-pdfs', 'placement-pdfs', true);

-- Create storage policy for public read access
CREATE POLICY "Public can view placement PDFs" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'placement-pdfs');

-- Create storage policy for public upload
CREATE POLICY "Anyone can upload placement PDFs" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'placement-pdfs');