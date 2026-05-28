/*
 # Billing Auto-Generation Trigger

 1. Purpose
   - Automatically creates a billing record when a new booking is inserted
   - Calculates the total amount based on room price and number of nights
   
 2. How it works
   - Trigger fires AFTER INSERT on bookings table
   - Calculates nights = check_out - check_in
   - Gets room price from rooms table
   - Calculates total = room_price * nights
   - Inserts new record into billing table
   
 3. Functions used
   - calculate_billing_amount(): Trigger function
   - Uses trigger to ensure data consistency
*/

-- Create function to calculate and insert billing
CREATE OR REPLACE FUNCTION calculate_billing_amount()
RETURNS TRIGGER AS $$
DECLARE
  room_price numeric;
  nights integer;
  total_amount numeric;
BEGIN
  -- Get room price
  SELECT price INTO room_price
  FROM rooms
  WHERE id = NEW.room_id;
  
  -- Calculate number of nights
  nights := (NEW.check_out - NEW.check_in);
  
  -- Calculate total amount
  total_amount := room_price * nights;
  
  -- Insert billing record
  INSERT INTO billing (booking_id, amount, generated_at)
  VALUES (NEW.id, total_amount, now());
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_insert_billing ON bookings;
CREATE TRIGGER trigger_insert_billing
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION calculate_billing_amount();