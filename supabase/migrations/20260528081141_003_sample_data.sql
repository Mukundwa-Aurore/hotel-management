/*
 # Initial Sample Data

 1. Purpose
   - Add sample hotels and rooms for testing
   - Create an admin user for testing
   
 2. Data inserted
   - 3 sample hotels with different locations
   - Multiple rooms per hotel with different types and prices
   
 3. Note
   - Password for admin user: admin123 (bcrypt hashed)
   - This is for testing purposes only
*/

-- Insert sample hotels
INSERT INTO hotels (id, name, location) VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Grand Plaza Hotel', 'New York, USA'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Ocean View Resort', 'Miami, USA'),
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Mountain Lodge', 'Denver, USA');

-- Insert sample rooms for Grand Plaza Hotel
INSERT INTO rooms (id, hotel_id, room_type, price, is_available) VALUES
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Single', 150.00, true),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Double', 250.00, true),
  ('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Suite', 450.00, true);

-- Insert sample rooms for Ocean View Resort
INSERT INTO rooms (id, hotel_id, room_type, price, is_available) VALUES
  ('a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Single', 180.00, true),
  ('b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Double', 300.00, true),
  ('c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Suite', 500.00, true);

-- Insert sample rooms for Mountain Lodge
INSERT INTO rooms (id, hotel_id, room_type, price, is_available) VALUES
  ('d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Single', 120.00, true),
  ('e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Double', 200.00, true),
  ('f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'Suite', 350.00, true);