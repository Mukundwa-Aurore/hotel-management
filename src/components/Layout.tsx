import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Hotel, LogOut, Calendar, Home, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2">
                  <div className="bg-blue-600 rounded-lg p-2">
                    <Hotel className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xl font-bold text-gray-800">HotelMS</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                  >
                    <Home className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/hotels"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                  >
                    <Hotel className="h-4 w-4" />
                    Hotels
                  </Link>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition"
                  >
                    <Calendar className="h-4 w-4" />
                    Bookings
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline">{user?.name}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    isAdmin ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {isAdmin ? 'Admin' : 'Customer'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
