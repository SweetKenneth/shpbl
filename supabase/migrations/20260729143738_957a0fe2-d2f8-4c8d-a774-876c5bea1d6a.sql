CREATE TABLE public.analytics_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event text NOT NULL,
  path text NOT NULL DEFAULT '/',
  referrer_host text,
  session_id text NOT NULL,
  device text,
  screen_w integer,
  country text,
  props jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT ALL ON public.analytics_events TO service_role;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE INDEX analytics_events_created_at_idx ON public.analytics_events (created_at DESC);
CREATE INDEX analytics_events_event_idx ON public.analytics_events (event, created_at DESC);
CREATE INDEX analytics_events_path_idx ON public.analytics_events (path, created_at DESC);
CREATE INDEX analytics_events_session_idx ON public.analytics_events (session_id, created_at DESC);