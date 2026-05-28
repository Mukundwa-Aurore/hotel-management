const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiService {
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Registration failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore empty JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errorMessage = 'Login failed';
      try {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } catch (e) {
        // Ignore empty JSON
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getHotels() {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }

    return response.json();
  }

  async getHotelById(id: string) {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch hotel');
    }

    return response.json();
  }

  async createHotel(name: string, location: string) {
    const response = await fetch(`${API_BASE_URL}/hotels`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, location }),
    });

    if (!response.ok) {
      throw new Error('Failed to create hotel');
    }

    return response.json();
  }

  async updateHotel(id: string, name: string, location: string) {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ name, location }),
    });

    if (!response.ok) {
      throw new Error('Failed to update hotel');
    }

    return response.json();
  }

  async deleteHotel(id: string) {
    const response = await fetch(`${API_BASE_URL}/hotels/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }
  }

  async getRoomsByHotel(hotelId: string) {
    const response = await fetch(`${API_BASE_URL}/rooms/hotel/${hotelId}`, {
      headers: this.getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }

    return response.json();
  }

  async getAvailableRooms(hotelId: string, checkIn: string, checkOut: string) {
    const response = await fetch(
      `${API_BASE_URL}/rooms/hotel/${hotelId}/available?checkIn=${checkIn}&checkOut=${checkOut}`,
      {
        headers: this.getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch available rooms');
    }

    return response.json();
  }

  async createRoom(hotelId: string, roomType: string, price: number, isAvailable: boolean) {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ hotelId, roomType, price, isAvailable }),
    });

    if (!response.ok) {
      throw new Error('Failed to create room');
    }

    return response.json();
  }

  async updateRoom(id: string, hotelId: string, roomType: string, price: number, isAvailable: boolean) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ hotelId, roomType, price, isAvailable }),
    });

    if (!response.ok) {
      throw new Error('Failed to update room');
    }

    return response.json();
  }

  async deleteRoom(id: string) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete room');
    }
  }

  async notifyRoomUnavailable(id: string) {
    const response = await fetch(`${API_BASE_URL}/rooms/${id}/notify-unavailable`, {
      method: 'POST',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to notify users about unavailable room');
    }
  }

  async createBooking(roomId: string, checkIn: string, checkOut: string) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ roomId, checkIn, checkOut }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create booking');
    }

    return response.json();
  }

  async getMyBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings/my`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch bookings');
    }

    return response.json();
  }

  async getAllBookings() {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch all bookings');
    }

    return response.json();
  }

  async cancelBooking(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel booking');
    }
  }

  async getBilling(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/billings/${bookingId}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch billing');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
