# Hotel Management System

A complete hotel booking and management system built with Spring Boot and React.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (Admin/Customer)
- Secure password hashing with BCrypt

### Hotel Management
- CRUD operations for hotels (Admin only)
- CRUD operations for rooms (Admin only)
- View hotels and rooms (All authenticated users)

### Room Booking
- Book rooms with check-in/check-out dates
- Automatic availability checking
- Real-time room availability verification

### Booking Management
- View booking history
- Cancel bookings (before check-in)
- Admin can view all bookings

### Billing
- Automatic bill generation via database trigger
- Bills calculated based on nights × room price
- View billing details for bookings

### Email Notifications
- Booking confirmation emails (configurable)

## Prerequisites

Before running the application, make sure you have:

1. **Java 17 or higher**
   - Download from: https://adoptium.net/

2. **Apache Maven 3.8+**
   - Download from: https://maven.apache.org/download.cgi

3. **Node.js 18 or higher**
   - Download from: https://nodejs.org/

4. **PostgreSQL database** (already configured with Supabase)

## Database Setup

The database is already set up with Supabase. The schema includes:

- **users**: User accounts with authentication
- **hotels**: Hotel information
- **rooms**: Room details linked to hotels
- **bookings**: Booking records
- **billing**: Auto-generated billing records

A trigger automatically creates billing entries when a booking is inserted.

## Running the Application

### Option 1: Using Startup Scripts (Recommended)

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Option 2: Manual Start

**1. Start the Backend:**
```bash
cd hotel-management-backend
mvn spring-boot:run
```

The backend will start on http://localhost:8080

**2. Start the Frontend (new terminal):**
```bash
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## Testing the Application

### 1. Register a New User

1. Open http://localhost:5173 in your browser
2. Click "Register here"
3. Fill in the registration form:
   - Name: Your name
   - Email: your@email.com
   - Password: (minimum 6 characters)
4. Click "Register"

### 2. Login

1. Use your registered credentials
2. You'll be redirected to the dashboard

### 3. Browse Hotels

1. Click "Hotels" in the navigation
2. You'll see sample hotels already in the database:
   - Grand Plaza Hotel (New York)
   - Ocean View Resort (Miami)
   - Mountain Lodge (Denver)

### 4. View Rooms

1. Click "View Rooms" on any hotel
2. See available rooms with prices and types
3. Room types: Single, Double, Suite

### 5. Book a Room

1. Click "Book Now" on any available room
2. Select check-in and check-out dates
3. Review the estimated total
4. Click "Confirm Booking"
5. You'll see the booking confirmation with final amount

### 6. View Your Bookings

1. Click "Bookings" in the navigation
2. See all your reservations
3. View booking details and billing amounts
4. Cancel bookings if needed (before check-in)

### 7. Admin Features

To test admin features, you need an admin account.

**Note**: The system currently registers users as customers by default. To create an admin account, you would need to manually update the role in the database.

Admins can:
- Add/Edit/Delete hotels
- Add/Edit/Delete rooms
- View all customer bookings

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Hotels
- `GET /api/hotels` - Get all hotels
- `GET /api/hotels/{id}` - Get hotel by ID
- `POST /api/hotels` - Create hotel (Admin only)
- `PUT /api/hotels/{id}` - Update hotel (Admin only)
- `DELETE /api/hotels/{id}` - Delete hotel (Admin only)

### Rooms
- `GET /api/rooms/hotel/{hotelId}` - Get rooms by hotel
- `GET /api/rooms/hotel/{hotelId}/available` - Get available rooms for dates
- `GET /api/rooms/{id}` - Get room by ID
- `POST /api/rooms` - Create room (Admin only)
- `PUT /api/rooms/{id}` - Update room (Admin only)
- `DELETE /api/rooms/{id}` - Delete room (Admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my` - Get user's bookings
- `GET /api/bookings` - Get all bookings (Admin only)
- `DELETE /api/bookings/{id}` - Cancel booking

### Billing
- `GET /api/billings/{bookingId}` - Get billing by booking ID

## Running Tests

### Backend Unit Tests

```bash
cd hotel-management-backend
mvn test
```

Tests cover:
- User authentication service
- Hotel service
- Booking service
- JWT token validation

## Configuration

### Backend (application.properties)

Key configurations in `hotel-management-backend/src/main/resources/application.properties`:

```properties
# Database (uses Supabase by default)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JWT
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=86400000

# Email (optional)
spring.mail.host=${MAIL_HOST}
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
```

### Frontend (.env)

```properties
VITE_API_BASE_URL=http://localhost:8080/api
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-key>
```

## Troubleshooting

### Backend won't start

1. Check if PostgreSQL is running
2. Verify database credentials
3. Check if port 8080 is available
4. Ensure Java 17+ is installed

### Frontend won't start

1. Run `npm install` to install dependencies
2. Check if port 5173 is available
3. Ensure Node.js 18+ is installed

### Can't connect to backend

1. Verify backend is running on http://localhost:8080
2. Check CORS settings in backend
3. Ensure `.env` has correct `VITE_API_BASE_URL`

### Booking fails

1. Check if room is available for selected dates
2. Verify check-out date is after check-in
3. Ensure you're authenticated

## Technology Stack

### Backend
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL (Supabase)
- Lombok
- Spring Mail

### Frontend
- React 18
- TypeScript
- React Router
- Tailwind CSS
- Lucide React Icons
- Fetch API

## License

This project is open source and available for educational purposes.
