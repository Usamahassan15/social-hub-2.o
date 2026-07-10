
CREATE TABLE public.drivers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  dob date,
  photo_url text,
  selfie_url text,
  vehicle_no text,
  registration_plate text,
  vehicle_front_url text,
  vehicle_back_url text,
  vehicle_doc_url text,
  vehicle_doc_expiry date,
  license_front_url text,
  license_back_url text,
  license_expiry date,
  id_front_url text,
  id_back_url text,
  id_expiry date,
  referral_code text,
  categories text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'active',
  wallet_balance numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.drivers TO anon, authenticated;
GRANT ALL ON public.drivers TO service_role;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "drivers open" ON public.drivers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.ride_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_id text NOT NULL,
  passenger_name text,
  service_type text NOT NULL,
  category text,
  from_address text,
  to_address text,
  from_lat double precision,
  from_lng double precision,
  to_lat double precision,
  to_lng double precision,
  description text,
  vehicle_size text,
  options text[],
  photos text[],
  fare numeric,
  distance_km numeric,
  schedule_at timestamptz,
  loading_city text,
  loading_address text,
  recipient_name text,
  recipient_phone text,
  driver_id text,
  accepted_offer_id uuid,
  status text NOT NULL DEFAULT 'open',
  chat_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ride_requests TO anon, authenticated;
GRANT ALL ON public.ride_requests TO service_role;
ALTER TABLE public.ride_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ride_requests open" ON public.ride_requests FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.ride_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.ride_requests(id) ON DELETE CASCADE,
  driver_id text NOT NULL,
  driver_name text,
  fare numeric NOT NULL,
  message text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ride_offers TO anon, authenticated;
GRANT ALL ON public.ride_offers TO service_role;
ALTER TABLE public.ride_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ride_offers open" ON public.ride_offers FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.ride_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.ride_requests(id) ON DELETE CASCADE,
  sender_id text NOT NULL,
  sender_role text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ride_messages TO anon, authenticated;
GRANT ALL ON public.ride_messages TO service_role;
ALTER TABLE public.ride_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ride_messages open" ON public.ride_messages FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.driver_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id text NOT NULL,
  request_id uuid REFERENCES public.ride_requests(id) ON DELETE SET NULL,
  amount numeric NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.driver_earnings TO anon, authenticated;
GRANT ALL ON public.driver_earnings TO service_role;
ALTER TABLE public.driver_earnings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "driver_earnings open" ON public.driver_earnings FOR ALL USING (true) WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_offers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ride_messages;

CREATE POLICY "driver-docs read" ON storage.objects FOR SELECT USING (bucket_id = 'driver-docs');
CREATE POLICY "driver-docs write" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'driver-docs');
CREATE POLICY "driver-docs update" ON storage.objects FOR UPDATE USING (bucket_id = 'driver-docs');
CREATE POLICY "driver-docs delete" ON storage.objects FOR DELETE USING (bucket_id = 'driver-docs');
