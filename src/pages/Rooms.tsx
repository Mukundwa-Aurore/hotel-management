import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/axios';
import { Room, Hotel } from '../types';
import { Bed, DollarSign, Calendar, ArrowLeft, Plus, Edit2, Trash2, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function RoomsPage() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [showAvailability, setShowAvailability] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const fetchData = async () => {
    try {
      const [hotelData, roomsData] = await Promise.all([
        apiService.getHotelById(hotelId!),
        apiService.getRoomsByHotel(hotelId!),
      ]);
      setHotel(hotelData);
      setRooms(roomsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) return;
    try {
      const data = await apiService.getAvailableRooms(hotelId!, checkIn, checkOut);
      setRooms(data);
      setShowAvailability(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      await apiService.deleteRoom(id);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleNotifyUnavailable = async (id: string) => {
    if (!window.confirm('Notify affected users that this room is unavailable?')) return;
    try {
      await apiService.notifyRoomUnavailable(id);
      alert('Notifications sent to users with bookings for this room.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const bookRoom = (roomId: string) => {
    navigate(`/book?roomId=${roomId}&hotelId=${hotelId}`);
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
      <button
        onClick={() => navigate('/hotels')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Hotels
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{hotel?.name}</h1>
        <p className="text-gray-600 mt-1">{hotel?.location}</p>
      </div>

      {isAuthenticated && !isAdmin && (
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Check Availability</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={checkAvailability}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Check Availability
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          {showAvailability ? 'Available Rooms' : 'All Rooms'}
        </h2>
        {isAdmin && (
          <button
            onClick={() => navigate(`/rooms/new?hotelId=${hotelId}`)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Room
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
      )}

      {rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No rooms available
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-teal-400 to-blue-400 flex items-center justify-center">
                <Bed className="h-16 w-16 text-white opacity-80" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-800">{room.roomType}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    room.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {room.isAvailable ? 'Available' : 'Booked'}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 mb-4">
                  <DollarSign className="h-5 w-5 mr-1 text-teal-600" />
                  <span className="text-2xl font-bold text-gray-800">{room.price}</span>
                  <span className="text-gray-500 ml-1">/ night</span>
                </div>
                <div className="flex gap-2">
                  {isAuthenticated && !isAdmin && room.isAvailable && (
                    <button
                      onClick={() => bookRoom(room.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-teal-600 text-white px-3 py-2 rounded-lg hover:bg-teal-700 transition"
                    >
                      <Calendar className="h-4 w-4" />
                      Book Now
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => navigate(`/rooms/edit/${room.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleNotifyUnavailable(room.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"
                        title="Notify affected users that this room is unavailable"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
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
