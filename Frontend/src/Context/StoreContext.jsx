/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem("cartItems");
      return localCart ? JSON.parse(localCart) : {};
    } catch (error) {
      console.error("Failed to parse cartItems from localStorage:", error);
      return {};
    }
  });

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(true);
  const [foodList, setFoodList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", address: {} });
  const [favorites, setFavorites] = useState([]);
  const [activeDetailItem, setActiveDetailItem] = useState(null);

  const addToCart =  async (Id) => {
    if (!cartItems[Id]) {
      setCartItems((prev) => ({ ...prev, [Id]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [Id]: prev[Id] + 1 }));
    }
    if(token){
      try {
        // Call your backend API to update the cart on the server
        const response = await axios.post(`${url}/api/cart/add`, {itemId: Id}, {
          headers: { token }
        });
        console.log("Add to cart response:", response.data);
      } catch(error) {
        console.error("Error adding to cart:", error.response?.data || error.message);
      }
    }
  };
  const removeFromCart = async (Id) => {
    setCartItems((prev) => ({ ...prev, [Id]: prev[Id] - 1 }));
    if(token){
      // Call your backend API to update the cart on the server
      await axios.post(`${url}/api/cart/remove`, {itemId: Id},{headers : {token}});
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = foodList.find((product) => product._id === item);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
  
      const response = await axios.get(`${url}/api/food/list`);
      setFoodList(response.data.data);
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.get(`${url}/api/cart/get`, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartdata); 
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  }

  const fetchProfile = async (userToken) => {
    const activeToken = userToken || token;
    if (!activeToken) return;
    try {
      const response = await axios.get(`${url}/api/user/profile`, { headers: { token: activeToken } });
      if (response.data.success) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const updateProfile = async (name, address, avatar) => {
    if (!token) return { success: false, message: "Not logged in" };
    try {
      const response = await axios.post(`${url}/api/user/profile`, { name, address, avatar }, { headers: { token } });
      if (response.data.success) {
        setProfile(prev => ({
          ...prev,
          name: response.data.data.name,
          address: response.data.data.address,
          avatar: response.data.data.avatar
        }));
        return { success: true, message: "Profile updated successfully" };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return { success: false, message: error.message };
    }
  };

  const submitReview = async (foodId, rating, comment) => {
    if (!token) return { success: false, message: "Please log in to submit a review" };
    try {
      const response = await axios.post(`${url}/api/review/add`, { foodId, rating, comment }, { headers: { token } });
      if (response.data.success) {
        return { success: true, message: "Review submitted successfully" };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error submitting review:", error);
      return { success: false, message: error.message };
    }
  };

  const fetchFavorites = async (userToken) => {
    const activeToken = userToken || token;
    if (!activeToken) return;
    try {
      const response = await axios.get(`${url}/api/user/favorites`, { headers: { token: activeToken } });
      if (response.data.success) {
        setFavorites(response.data.data.map(f => typeof f === 'object' ? f._id : f));
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const toggleFavorite = async (foodId) => {
    if (!token) return { success: false, message: "Please log in to add favorites" };
    try {
      const response = await axios.post(`${url}/api/user/favorites`, { foodId }, { headers: { token } });
      if (response.data.success) {
        setFavorites(response.data.favorites);
        return { success: true, message: response.data.message };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return { success: false, message: error.message };
    }
  };

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    async function loadData() {
      try {
        const savedTheme = localStorage.getItem("darkMode");
        if (savedTheme === "true") {
          document.body.classList.add("dark-mode");
        }
        await fetchFoodList();
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function loadUserData() {
      if (token) {
        try {
          await loadCartData(token);
          await fetchProfile(token);
          await fetchFavorites(token);
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setProfile(null);
        setFavorites([]);
      }
    }
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const contextValue = {
    foodList,
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loadCartData,
    loading,
    searchQuery,
    setSearchQuery,
    promoDiscount,
    setPromoDiscount,
    promoCode,
    setPromoCode,
    profile,
    setProfile,
    fetchProfile,
    updateProfile,
    submitReview,
    favorites,
    toggleFavorite,
    activeDetailItem,
    setActiveDetailItem,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
export default StoreContextProvider;
