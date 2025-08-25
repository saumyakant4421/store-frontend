import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './pages/Signup';
import Login from './pages/Login';
import StoreList from './pages/StoreList';
import AdminDashboard from './pages/AdminDashboard';
import StoreOwnerDashboard from './pages/storeOwner';
import Profile from './pages/Profile';
import { AuthProvider } from './hooks/useAuth';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/stores" element={<StoreList />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/store-owner/:storeId" element={<StoreOwnerDashboard />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;