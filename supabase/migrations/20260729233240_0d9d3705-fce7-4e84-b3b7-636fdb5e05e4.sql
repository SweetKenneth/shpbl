ALTER TABLE public.certificates ADD COLUMN IF NOT EXISTS note text;

UPDATE public.certificates
SET owner = 'Publisher Verification Copy',
    cert_seal = '7e3b10bfcee245214f343bdd5f04d359addc373ce6c632394a47f4af408a53cd',
    note = 'Issued during launch verification before public circulation.'
WHERE copy_no = 1
  AND owner = 'Test Reader';