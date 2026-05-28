/*
 # Hotel Management System Initial Schema

 1. New Tables
   - `users`: Stores user accounts with authentication details
     - `id` (uuid, primary key)
     - `name` (text, user's full name)
     - `email` (text, unique, user's email for login)
     - `password` (text, hashed password)
     - `role` (text, either 'admin' or 'customer')
     - `created_at` (timestamp)
   
   - `hotels`: Hotel information
     - `id` (uuid, primary key)
     - `name` (text, hotel name)
     - `location` (text, hotel address/location)
     - `created_at` (timestamp)
   
   - `rooms`: Room details for each hotel
     - `id` (uuid, primary key)
     - `hotel_id` (uuid, foreign key to hotels)
     - `room_type` (text, e.g., 'Single', 'Double', 'Suite')
     - `price` (numeric, price per night)
     - `is_available` (boolean, availability status)
     - `created_at` (timestamp)
   
   - `bookings`: Booking records
     - `id` (uuid, primary key)
     - `user_id` (uuid, foreign key to users)
     - `room_id` (uuid, foreign key to rooms)
     - `check_in` (date, check-in date)
     - `check_out` (date, check-out date)
     - `status` (text, 'confirmed', 'cancelled', 'completed')
     - `created_at` (timestamp)
   
   - `billing`: Billing records
     - `id` (uuid, primary key)
     - `booking_id` (uuid, foreign key to bookings)
     - `amount` (numeric, total billing amount)
     - `generated_at` (timestamp)

 2. Security
   - Enable RLS on all tables
   - Policies ensure users can only access their own data
   - Admins have broader access for management

 3. Important Notes
   - All tables use UUID primary keys
   - Foreign key constraints ensure referential integrity
   - RLS policies restrict data access based on user role
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

-- Hotels table
CREATE TABLE IF NOT EXISTS hotels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id uuid NOT NULL REFERENCES hotels(id) ON DELETE CASCADE,
  room_type text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in date NOT NULL,
  check_out date NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- Billing table
CREATE TABLE IF NOT EXISTS billing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  generated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Hotels policies (public read, admin write)
CREATE POLICY "Anyone can view hotels"
  ON hotels FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage hotels"
  ON hotels FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update hotels"
  ON hotels FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete hotels"
  ON hotels FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Rooms policies (public read, admin write)
CREATE POLICY "Anyone can view rooms"
  ON rooms FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage rooms"
  ON rooms FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update rooms"
  ON rooms FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete rooms"
  ON rooms FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Bookings policies
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Billing policies
CREATE POLICY "Users can view own bills"
  ON billing FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = billing.booking_id 
      AND bookings.user_id = auth.uid()
    )
    OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_hotel_id ON rooms(hotel_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_billing_booking_id ON billing(booking_id);