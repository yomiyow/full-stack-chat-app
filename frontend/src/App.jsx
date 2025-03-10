import { Routes, Route, Navigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

import Navbar from "./components/Navbar";
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignupPage';
import LogInPage from './pages/LogInPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { useEffect } from "react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) return (
    <div className="flex items-center justify-center h-screen">
      <span className="loading loading-dots loading-lg"></span>
    </div>
  );

  return (
    < div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={(authUser) ? <HomePage /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={(!authUser) ? <SignUpPage /> : <Navigate to="/" />}
        ></Route>
        <Route
          path="/login"
          element={(!authUser) ? <LogInPage /> : <Navigate to="/" />}
        ></Route>
        <Route path="/settings" element={<SettingsPage />}></Route>
        <Route
          path="/profile"
          element={(authUser) ? < ProfilePage /> : <Navigate to="/login" />}
        ></Route>
      </Routes>

      <Toaster />
    </div >
  );
};

export default App;
