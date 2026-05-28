import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/axios';
import { Bed, Save, ArrowLeft, DollarSign } from 'lucide-react';

export default function RoomFormPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const hotelId = searchParams.get('hotelId');
  const [selectedHotelId, setSelectedHotelId] = useState(hotelId || '');
  const [roomType, setRoomType] = useState('');
  const [price, setPrice] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      fetchRoom();
    }
  }, [id]);

  const fetchRoom = async () => {
    try {
      const room = await apiService.getRoomsByHotel(selectedHotelId);
      const currentRoom = room.find((r: any) => r.id === id);
      if (currentRoom) {
        setSelectedHotelId(currentRoom.hotelId);
        setRoomType(currentRoom.roomType);
        setPrice(currentRoom.price.toString());
        setIsAvailable(currentRoom.isAvailable);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEdit) {
        await apiService.updateRoom(id!, selectedHotelId, roomType, parseFloat(price), isAvailable);
      } else {
        await apiService.createRoom(selectedHotelId, roomType, parseFloat(price), isAvailable);
      }
      navigate(`/hotels/${selectedHotelId}/rooms`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-teal-100 rounded-full p-3">
            <Bed className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEdit ? 'Edit Room' : 'Add New Room'}
            </h1>
            <p className="text-gray-600 text-sm">
              {isEdit ? 'Update room details' : 'Create a new room entry'}
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel ID</label>
            <input
              type="text"
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              required
              disabled={!!hotelId}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition disabled:bg-gray-100"
              placeholder="Enter hotel ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
            >
              <option value="">Select room type</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Suite">Suite</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Penthouse">Penthouse</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price per Night</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                step="0.01"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                placeholder="Enter price"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isAvailable"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-5 w-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500"
            />
            <label htmlFor="isAvailable" className="text-sm font-medium text-gray-700">
              Room is available
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            {loading ? 'Saving...' : (isEdit ? 'Update Room' : 'Create Room')}
          </button>
        </form>
      </div>
    </div>
  );
}
