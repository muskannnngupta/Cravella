import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar.jsx";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home.jsx";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Footer from "./Components/Footer/Footer.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import FoodDetailPopup from "./Components/FoodDetailPopup/FoodDetailPopup.jsx";
import LoginPopup from "./Components/LoginPopup/LoginPopup.jsx";
import Verify from "./Pages/Verify/Verify.jsx";
import Myorder from "./Pages/MyOrders/Myorder.jsx";
import Search from "./Pages/Search/Search.jsx";

const App = () => {
  const [showlogin,setshowlogin] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <div className="splash-loader-content">
            <div className="splash-food-animation">
              <span className="splash-food-item item-1">🍔</span>
              <span className="splash-food-item item-2">🍕</span>
              <span className="splash-food-item item-3">🥗</span>
              <span className="splash-food-item item-4">🍰</span>
            </div>
            <div className="splash-logo">
              Cravella<span className="logo-dot">.</span>
            </div>
            <p className="splash-tagline">Every Craving, Delivered</p>
          </div>
        </div>
      )}
      {showlogin?<LoginPopup setshowlogin = {setshowlogin}/>:<></>}
      <FoodDetailPopup />
      <div className={`app ${showSplash ? "" : "visible"}`}>
        <Navbar setshowlogin = {setshowlogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/cart" element={<Cart setShowLogin={setshowlogin} />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/myorders" element={<Myorder />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
