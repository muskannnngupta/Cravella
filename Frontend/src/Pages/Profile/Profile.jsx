import { useContext, useState, useEffect, useCallback } from "react";
import "./Profile.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const Profile = () => {
  const { token, profile, updateProfile, loading, url, setToken, setCartItems, addToCart, setActiveDetailItem, favorites, food_list } = useContext(StoreContext);
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.body.classList.contains("dark-mode");
  });

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("darkMode", next.toString());
      if (next) {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      return next;
    });
  };

  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  
  const [tickets, setTickets] = useState([]);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketOrderId, setTicketOrderId] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !token) {
      navigate("/");
    }
  }, [token, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setName(profile.name || "");
        setAvatar(profile.avatar || "");
        const addr = profile.address || {};
        setStreet(addr.street || "");
        setCity(addr.city || "");
        setState(addr.state || "");
        setZipcode(addr.zipcode || "");
        setCountry(addr.country || "");
        setPhone(addr.phone || "");
      }, 0);
    }
  }, [profile]);

  const fetchUserOrders = useCallback(async () => {
    try {
      const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, [token, url]);

  const fetchUserTickets = useCallback(async () => {
    try {
      const response = await axios.get(url + "/api/support/user", { headers: { token } });
      if (response.data.success) {
        setTickets(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }, [url, token]);

  useEffect(() => {
    if (token) {
      fetchUserOrders();
      fetchUserTickets();
    }
  }, [token, fetchUserOrders, fetchUserTickets]);

  useEffect(() => {
    if (profile && profile._id) {
      const socket = io(url);
      socket.emit("join", profile._id);

      socket.on("orderStatusUpdate", (data) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === data.orderId ? { ...order, status: data.status } : order
          )
        );
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [profile, url]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("Please upload an image smaller than 1MB for your profile picture.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result;
        setAvatar(base64Data);
        const address = { street, city, state, zipcode, country, phone };
        await updateProfile(name, address, base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: "", type: "" });
    
    const address = { street, city, state, zipcode, country, phone };
    const res = await updateProfile(name, address, avatar);
    
    setUpdating(false);
    if (res.success) {
      setMessage({ text: "Saved default shipping address updated successfully!", type: "success" });
    } else {
      setMessage({ text: res.message || "Failed to update profile", type: "error" });
    }
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      alert("Please enter subject and message.");
      return;
    }
    setTicketSubmitting(true);
    try {
      const res = await axios.post(url + "/api/support/create", {
        orderId: ticketOrderId,
        subject: ticketSubject,
        message: ticketMessage
      }, { headers: { token } });
      
      if (res.data.success) {
        alert("Support ticket created successfully. Our team will contact you soon.");
        setTicketSubject("");
        setTicketMessage("");
        setTicketOrderId("");
        fetchUserTickets();
      } else {
        alert(res.data.message || "Failed to create ticket");
      }
    } catch (error) {
      console.error("Ticket error", error);
      alert("Error submitting ticket");
    } finally {
      setTicketSubmitting(false);
    }
  };

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    setCartItems({});
    navigate("/");
  };

  const handleReorder = (items) => {
    items.forEach(item => {
      addToCart(item._id || item.id);
    });
    alert("Dishes added to your cart!");
    navigate("/cart");
  };

  const getStatusStep = (status) => {
    if (!status) return 1;
    const lowercaseStatus = status.toLowerCase();
    if (lowercaseStatus === "food processing") return 1;
    if (lowercaseStatus === "out for delivery") return 2;
    if (lowercaseStatus === "delivered") return 3;
    return 1;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + order.amount, 0);
  const activeOrders = orders.filter(order => order.status.toLowerCase() !== "delivered");
  const orderHistory = orders.filter(order => order.status.toLowerCase() === "delivered");

  return (
    <div className="zomato-profile-container">
      {/* Cover and User Information Card */}
      <div className="zomato-profile-header">
        <div className="zomato-cover-banner"></div>
        
        <div className="zomato-user-info-row">
          <div className="zomato-avatar-wrapper">
            <div className="zomato-avatar">
              {avatar ? (
                <img src={avatar} alt="Profile" className="zomato-avatar-img" />
              ) : (
                name ? name.split(" ").map(n => n[0]).join("").toUpperCase() : "C"
              )}
              <label htmlFor="avatar-upload" className="avatar-edit-overlay">
                📷
              </label>
              <input 
                type="file" 
                id="avatar-upload" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                style={{ display: "none" }}
              />
            </div>
          </div>
          
          <div className="zomato-user-meta-col">
            <h2>{name || "Cravella Customer"}</h2>
            <p className="user-location">📍 {city ? `${city}, ${country}` : "Delivery Location Not Set"}</p>
            <p className="user-email">✉️ {profile?.email}</p>
          </div>

          <div className="zomato-user-stats-row">
            <div className="zomato-stat-badge">
              <span className="stat-label">Total spent</span>
              <span className="stat-value text-green">${totalSpent.toFixed(2)}</span>
            </div>
            <div className="zomato-stat-badge">
              <span className="stat-label">Orders placed</span>
              <span className="stat-value text-red">{orders.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="zomato-profile-body">
        {/* Left Side Sidebar Navigation Options */}
        <div className="zomato-sidebar">
          <h3 className="sidebar-section-title">Online Ordering</h3>
          <div className="sidebar-menu-links">
            <button 
              className={`sidebar-link ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              🚴 Active Orders ({activeOrders.length})
            </button>
            <button 
              className={`sidebar-link ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              📜 Order History ({orderHistory.length})
            </button>
            <button 
              className={`sidebar-link ${activeTab === "address" ? "active" : ""}`}
              onClick={() => setActiveTab("address")}
            >
              🏠 My Address Book
            </button>
            <button 
              className={`sidebar-link ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              ❤️ My Favorites
            </button>
            <button 
              className={`sidebar-link ${activeTab === "support" ? "active" : ""}`}
              onClick={() => setActiveTab("support")}
            >
              🎧 Help & Support
            </button>
            <button 
              className="sidebar-link"
              onClick={toggleTheme}
              style={{ borderTop: '1px solid #f2f2f2', borderRadius: '0', marginTop: '10px', paddingTop: '15px' }}
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
            <button 
              className="sidebar-link logout-link"
              onClick={logout}
              style={{ marginTop: '5px', borderTop: 'none', paddingTop: '10px' }}
            >
              🚪 Log Out
            </button>
          </div>
        </div>

        {/* Right Side Tab Panel Content */}
        <div className="zomato-content-panel">
          {activeTab === "orders" && (
            <div className="tab-pane">
              <h3 className="pane-title">Active Orders</h3>
              <p className="pane-desc">Track progress of your pending meals.</p>
              
              {activeOrders.length === 0 ? (
                <div className="zomato-empty-state">
                  <div className="empty-state-icon">🚴</div>
                  <h4>No active orders right now</h4>
                  <p>Order some hot dishes and they will show up here for live tracking!</p>
                  <button className="empty-state-btn" onClick={() => navigate("/")}>Order Now</button>
                </div>
              ) : (
                <div className="zomato-orders-list">
                  {activeOrders.map((order, idx) => {
                    const step = getStatusStep(order.status);
                    return (
                      <div key={idx} className="zomato-order-card">
                        <div className="order-card-top">
                          <div className="restaurant-info">
                            <span className="restaurant-icon">🍳</span>
                            <div>
                              <h4>Cravella Gourmet Kitchen</h4>
                              <p className="order-timestamp">Placed on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <span className="order-cost">${order.amount}.00</span>
                        </div>
                        
                        <div className="order-items-summary">
                          <strong>Items ordered:</strong> {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}
                        </div>

                        <div className="zomato-stepper-wrapper">
                          <div className="delivery-timeline-pill">
                            {step === 1 && <p>⏳ Preparing: Cooking your delicious meal (25 - 35 Mins)</p>}
                            {step === 2 && <p>🚴 Dispatched: Driver is on the way (10 - 15 Mins)</p>}
                          </div>
                          
                          <div className="zomato-stepper">
                            <div className="stepper-step active">
                              <div className="step-bullet">✔</div>
                              <p className="step-text">Placed</p>
                            </div>
                            <div className={`stepper-connector ${step >= 1 ? "active" : ""}`}></div>
                            <div className={`stepper-step ${step >= 1 ? "active" : ""}`}>
                              <div className="step-bullet">{step >= 1 ? "✔" : "2"}</div>
                              <p className="step-text">Preparing</p>
                            </div>
                            <div className={`stepper-connector ${step >= 2 ? "active" : ""}`}></div>
                            <div className={`stepper-step ${step >= 2 ? "active" : ""}`}>
                              <div className="step-bullet">{step >= 2 ? "✔" : "3"}</div>
                              <p className="step-text">Dispatched</p>
                            </div>
                            <div className={`stepper-connector ${step >= 3 ? "active" : ""}`}></div>
                            <div className={`stepper-step ${step >= 3 ? "active" : ""}`}>
                              <div className="step-bullet">{step >= 3 ? "✔" : "4"}</div>
                              <p className="step-text">Delivered</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="tab-pane">
              <h3 className="pane-title">Order History</h3>
              <p className="pane-desc">Dishes you ordered in the past.</p>
              
              {orderHistory.length === 0 ? (
                <div className="zomato-empty-state">
                  <div className="empty-state-icon">📜</div>
                  <h4>No order history found</h4>
                  <p>You haven't completed any orders yet.</p>
                </div>
              ) : (
                <div className="zomato-orders-list">
                  {orderHistory.map((order, idx) => (
                    <div key={idx} className="zomato-order-card history-card">
                      <div className="order-card-top">
                        <div className="restaurant-info">
                          <span className="restaurant-icon">🍳</span>
                          <div>
                            <h4>Cravella Gourmet Kitchen</h4>
                            <p className="order-timestamp">Delivered on {new Date(order.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className="order-cost">${order.amount}.00</span>
                      </div>

                      <div className="order-items-summary">
                        <strong>Dishes:</strong> {order.items.map(item => `${item.name} x ${item.quantity}`).join(", ")}
                      </div>

                      <div className="zomato-card-actions">
                        <span className="delivered-badge">Delivered successfully ✅</span>
                        <div className="action-buttons-group">
                          <button 
                            className="btn-secondary-outline"
                            onClick={() => handleReorder(order.items)}
                          >
                            Reorder
                          </button>
                          <button 
                            className="btn-primary-filled"
                            onClick={() => {
                              if (order.items[0]) {
                                const item = order.items[0];
                                setActiveDetailItem({
                                  _id: item._id || item.id,
                                  name: item.name,
                                  price: item.price,
                                  description: item.description || "",
                                  image: item.image || "",
                                  category: item.category || ""
                                });
                              }
                            }}
                          >
                            Rate Food
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "address" && (
            <div className="tab-pane">
              <h3 className="pane-title">My Address Book</h3>
              <p className="pane-desc">Manage default details pre-filled during checkout.</p>
              
              {message.text && (
                <div className={`alert-message ${message.type}`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="zomato-address-form">
                <div className="form-grid-section">
                  <div className="form-group-full">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="form-group-full">
                    <label>Email Address (Read-only)</label>
                    <input 
                      type="email" 
                      value={profile?.email || ""} 
                      disabled 
                      className="disabled-input"
                    />
                  </div>
                  
                  <div className="form-group-full margin-top-15">
                    <label>Street Address</label>
                    <input 
                      type="text" 
                      value={street} 
                      onChange={(e) => setStreet(e.target.value)} 
                      required 
                      placeholder="Street name and number"
                    />
                  </div>
                  
                  <div className="form-flex-row">
                    <div className="flex-1 form-group-col">
                      <label>City</label>
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)} 
                        required 
                        placeholder="City"
                      />
                    </div>
                    <div className="flex-1 form-group-col">
                      <label>State</label>
                      <input 
                        type="text" 
                        value={state} 
                        onChange={(e) => setState(e.target.value)} 
                        required 
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="form-flex-row">
                    <div className="flex-1 form-group-col">
                      <label>Zip Code</label>
                      <input 
                        type="text" 
                        value={zipcode} 
                        onChange={(e) => setZipcode(e.target.value)} 
                        required 
                        placeholder="Zip code"
                      />
                    </div>
                    <div className="flex-1 form-group-col">
                      <label>Country</label>
                      <input 
                        type="text" 
                        value={country} 
                        onChange={(e) => setCountry(e.target.value)} 
                        required 
                        placeholder="Country"
                      />
                    </div>
                  </div>

                  <div className="form-group-full">
                    <label>Contact Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      required 
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <button type="submit" disabled={updating} className="btn-primary-filled w-full margin-top-20">
                  {updating ? "Saving Changes..." : "Save Address Book"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "favorites" && (
            <div className="tab-pane">
              <h3 className="pane-title">My Favorites</h3>
              <p className="pane-desc">Dishes you have liked.</p>
              
              {favorites.length === 0 ? (
                <div className="zomato-empty-state">
                  <div className="empty-state-icon">❤️</div>
                  <h4>No favorites found</h4>
                  <p>You haven't liked any dishes yet.</p>
                  <button className="empty-state-btn" onClick={() => navigate("/")}>Explore Menu</button>
                </div>
              ) : (
                <div className="zomato-orders-list">
                  {favorites.map((favId, idx) => {
                    const item = food_list.find(f => f._id === favId);
                    if (!item) return null;
                    return (
                      <div key={idx} className="zomato-order-card history-card">
                        <div className="order-card-top" style={{alignItems: 'center'}}>
                          <div className="restaurant-info" style={{alignItems: 'center'}}>
                            <img src={url+"/images/"+item.image} style={{width: '60px', borderRadius: '8px'}} alt="" />
                            <div style={{marginLeft: '15px'}}>
                              <h4 style={{margin: '0', fontSize: '16px'}}>{item.name}</h4>
                              <p className="order-timestamp" style={{margin: '4px 0 0 0'}}>{item.category}</p>
                            </div>
                          </div>
                          <span className="order-cost" style={{fontSize: '18px'}}>${item.price}</span>
                        </div>
                        <div className="zomato-card-actions" style={{marginTop: '15px'}}>
                          <div className="action-buttons-group">
                            <button 
                              className="btn-primary-filled"
                              onClick={() => addToCart(item._id)}
                            >
                              Add to Cart
                            </button>
                            <button 
                              className="btn-secondary-outline"
                              onClick={() => {
                                setActiveDetailItem({
                                  _id: item._id,
                                  name: item.name,
                                  price: item.price,
                                  description: item.description || "",
                                  image: item.image || "",
                                  category: item.category || "",
                                  averageRating: item.averageRating || 5
                                });
                              }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "support" && (
            <div className="tab-pane">
              <h3 className="pane-title">Help & Support</h3>
              <p className="pane-desc">Reach out to our customer support team for any issues.</p>
              
              <div className="zomato-support-container">
                <div className="support-form-section">
                  <h4>Create a New Ticket</h4>
                  <form onSubmit={handleTicketSubmit} className="zomato-address-form">
                    <div className="form-group-full margin-top-15">
                      <label>Related Order (Optional)</label>
                      <select 
                        value={ticketOrderId} 
                        onChange={(e) => setTicketOrderId(e.target.value)}
                        className="support-select"
                      >
                        <option value="">-- Select an Order --</option>
                        {orders.map((o, i) => (
                          <option key={i} value={o._id}>
                            Order {o._id.substring(0, 8)} - ${o.amount} - {new Date(o.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-full margin-top-15">
                      <label>Subject</label>
                      <input 
                        type="text" 
                        value={ticketSubject} 
                        onChange={(e) => setTicketSubject(e.target.value)} 
                        required 
                        placeholder="E.g. Issue with delivery"
                      />
                    </div>
                    <div className="form-group-full margin-top-15">
                      <label>Message</label>
                      <textarea 
                        value={ticketMessage} 
                        onChange={(e) => setTicketMessage(e.target.value)} 
                        required 
                        placeholder="Describe your issue..."
                        rows="4"
                      />
                    </div>
                    <button type="submit" disabled={ticketSubmitting} className="btn-primary-filled w-full margin-top-20">
                      {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                  </form>
                </div>

                <div className="support-history-section margin-top-20">
                  <h4>Your Tickets</h4>
                  {tickets.length === 0 ? (
                    <p>No support tickets found.</p>
                  ) : (
                    <div className="zomato-orders-list">
                      {tickets.map((t, idx) => (
                        <div key={idx} className="zomato-order-card">
                          <div className="order-card-top">
                            <div>
                              <h4>{t.subject}</h4>
                              <p className="order-timestamp">Submitted on {new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                            <span className={`order-status-badge ${t.status === 'Pending' ? 'pending' : 'replied'}`}>{t.status}</span>
                          </div>
                          <div className="order-items-summary margin-top-15">
                            <strong>Your Message:</strong> {t.message}
                          </div>
                          {t.reply && (
                            <div className="admin-reply-box margin-top-15" style={{ backgroundColor: "#f9f9f9", padding: "10px", borderLeft: "3px solid #ff3333" }}>
                              <strong>Admin Reply:</strong> {t.reply}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
