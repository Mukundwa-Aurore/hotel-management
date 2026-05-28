import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import HotelsPage from './pages/Hotels';
import RoomsPage from './pages/Rooms';
import BookRoomPage from './pages/BookRoom';
import BookingsPage from './pages/Bookings';
import HotelFormPage from './pages/HotelForm';
import RoomFormPage from './pages/RoomForm';
import DashboardPage from './pages/Dashboard';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hotels"
        element={
          <PrivateRoute>
            <HotelsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/hotels/new"
        element={
          <AdminRoute>
            <HotelFormPage />
          </AdminRoute>
        }
      />
      <Route
        path="/hotels/edit/:id"
        element={
          <AdminRoute>
            <HotelFormPage />
          </AdminRoute>
        }
      />
      <Route
        path="/hotels/:hotelId/rooms"
        element={
          <PrivateRoute>
            <RoomsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/rooms/new"
        element={
          <AdminRoute>
            <RoomFormPage />
          </AdminRoute>
        }
      />
      <Route
        path="/rooms/edit/:id"
        element={
          <AdminRoute>
            <RoomFormPage />
          </AdminRoute>
        }
      />
      <Route
        path="/book"
        element={
          <PrivateRoute>
            <BookRoomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <PrivateRoute>
            <BookingsPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
