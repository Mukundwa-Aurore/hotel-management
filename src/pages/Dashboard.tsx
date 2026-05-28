import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Hotel, Calendar, Settings, User } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 rounded-full p-3">
              <Hotel className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">3</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Hotels</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-teal-100 rounded-full p-3">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">{user?.role}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Your Role</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">9</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Available Rooms</h3>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 rounded-full p-3">
              <Settings className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-800">Active</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">System Status</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Explore Hotels</h2>
          <p className="text-blue-100 mb-6">
            Browse our selection of premium hotels and find the perfect room for your stay.
          </p>
          <Link
            to="/hotels"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
          >
            View Hotels
          </Link>
        </div>

        {isAdmin && (
          <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Admin Controls</h2>
            <p className="text-teal-100 mb-6">
              Manage hotels, rooms, and view all customer bookings.
            </p>
            <div className="flex gap-4">
              <Link
                to="/hotels"
                className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition"
              >
                Manage Hotels
              </Link>
              <Link
                to="/bookings"
                className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition"
              >
                View Bookings
              </Link>
            </div>
          </div>
        )}

        {!isAdmin && (
          <div className="bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl shadow-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
            <p className="text-teal-100 mb-6">
              View and manage all your reservations in one place.
            </p>
            <Link
              to="/bookings"
              className="inline-flex items-center gap-2 bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition"
            >
              View My Bookings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
