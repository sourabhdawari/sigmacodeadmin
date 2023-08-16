import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profle";
import { auth } from "./firebase";
import { useAppDispatch } from "./hooks/storeHook";
import { login } from "./features/authSlice";
import AuthRoutes from "./components/HOC/AuthRoutes";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Logo from "./pages/Logo";
import Resume from "./pages/Resume";
import SocialPosts from "./pages/SocialPosts";
import Campaign from "./pages/Campaigns";
import ContactData from "./pages/ContactData";
import Navbar from "./components/Header/Navbar";

const App = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email) {
        dispatch(
          login({
            email: user.email,
            id: user.uid,
            photoUrl: user?.photoURL || null,
          })
        );
      }
      setLoading(false); // Set loading to false after authentication check
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    // Show loading screen while checking authentication
    return <p>Loading...</p>;
  }

  return (
    <>
    <Routes>

      <Route element={<AuthRoutes />}>
        <Route path="profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/logo" element={<Logo />} />
        <Route path="/campaign" element={<Campaign />} />
        <Route path="/socialposts" element={<SocialPosts />} />
        <Route path="/resume" element={<Resume />} />
        
        <Route path="/contacted" element={<ContactData />} />
      </Route>
      <Route path="auth" element={<Auth />} />
    </Routes>
    </>
  );
};

export default App;