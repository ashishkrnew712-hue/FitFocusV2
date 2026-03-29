-- Copy and paste this into the Supabase SQL Editor to create your database!

-- Create Workouts Table
CREATE TABLE public.workouts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  duration_seconds integer NOT NULL,
  total_volume_kg integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Create Policies
CREATE POLICY "Users can insert their own workouts."
  ON public.workouts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workouts."
  ON public.workouts FOR SELECT
  USING (auth.uid() = user_id);

-- Optional: Example table for specific exercise sets logged during a workout
CREATE TABLE public.workout_sets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    workout_id uuid REFERENCES public.workouts ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES auth.users NOT NULL,
    exercise_name text NOT NULL,
    weight_kg numeric,
    reps integer,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own sets."
  ON public.workout_sets FOR ALL
  USING (auth.uid() = user_id);
