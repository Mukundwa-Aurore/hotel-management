# Hotel Management System

A complete hotel booking and management system built with Spring Boot and React.

## Features

### User Management
- User registration and authentication with JWT
- Role-based access control (umu admin en a customer ofks)
- Secure password hashing with BCrypt

### Hotel Management
- CRUD operations for hotels 
- CRUD operations for rooms 
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
