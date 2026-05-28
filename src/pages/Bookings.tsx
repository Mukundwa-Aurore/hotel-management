import { useEffect, useState } from 'react';
import { apiService } from '../services/axios';
import { Booking } from '../types';
import { Calendar, MapPin, Bed, DollarSign, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, [isAdmin]);

  const fetchBookings = async () => {
    try {
      const data = isAdmin
        ? await apiService.getAllBookings()
        : await apiService.getMyBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiService.cancelBooking(bookingId);
      fetchBookings();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Booked';
      case 'CANCELLED':
        return 'Cancelled';
      case 'COMPLETED':
        return 'Completed';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {isAdmin ? 'All Bookings' : 'My Bookings'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isAdmin ? 'Manage all customer bookings' : 'View and manage your reservations'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      {bookings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No bookings found
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{booking.hotelName}</h3>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {booking.roomType}
                    </div>
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.userName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end gap-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-teal-600">
                    <DollarSign className="h-5 w-5" />
                    {booking.billingAmount.toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  {booking.status === 'CONFIRMED' && new Date(booking.checkIn) > new Date() && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
