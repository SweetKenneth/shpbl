CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  copy_no integer NOT NULL UNIQUE,
  owner text NOT NULL,
  issue_date date NOT NULL,
  cert_seal text NOT NULL UNIQUE,
  library_seal text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX certificates_copy_no_idx ON public.certificates (copy_no DESC);

GRANT SELECT ON public.certificates TO anon;
GRANT SELECT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Register is public" ON public.certificates FOR SELECT TO anon, authenticated USING (true);

CREATE SEQUENCE public.certificate_copy_no_seq START WITH 1 OWNED BY public.certificates.copy_no;
GRANT USAGE ON SEQUENCE public.certificate_copy_no_seq TO service_role;