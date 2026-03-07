CREATE TABLE public.notified_movies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tmdb_id integer NOT NULL UNIQUE,
  title text NOT NULL,
  notified_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.notified_movies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can manage notified movies" ON public.notified_movies FOR ALL USING (true) WITH CHECK (true);