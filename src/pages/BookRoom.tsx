import { FormEvent, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiService } from '../services/axios';
import { Calendar, DollarSign, CreditCard, ArrowLeft } from 'lucide-react';

export default function BookRoomPage() {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('roomId');
  const hotelId = searchParams.get('hotelId');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [billingAmount, setBillingAmount] = useState(0);
  const navigate = useNavigate();

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiService.createBooking(roomId!, checkIn, checkOut);
      setBillingAmount(response.billingAmount);
      setSuccess(true);
      setTimeout(() => {
        navigate('/bookings');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center mb-4">
            <CreditCard className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">Your booking has been successfully created.</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 text-2xl font-bold text-teal-600">
              <DollarSign className="h-6 w-6" />
              {billingAmount.toFixed(2)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Total Amount</p>
          </div>
          <p className="text-sm text-gray-500 mt-4">Redirecting to your bookings...</p>
        </div>
      </div>
    );
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Book Your Stay</h1>
        <p className="text-gray-600 mb-8">Complete your reservation details</p>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition"
                />
              </div>
            </div>
          </div>

          {checkIn && checkOut && calculateNights() > 0 && (
            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Duration</span>
                <span className="font-semibold text-gray-800">{calculateNights()} nights</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Estimated Total</span>
                  <span className="text-3xl font-bold text-teal-600">~${(calculateNights() * 150).toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Final amount will be calculated based on room price
                </p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !checkIn || !checkOut || calculateNights() <= 0}
            className="w-full bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
}
