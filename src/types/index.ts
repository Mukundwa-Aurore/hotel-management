export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  roomCount: number;
}

export interface Room {
  id: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  price: number;
  isAvailable: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  roomId: string;
  roomType: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
  billingAmount: number;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
