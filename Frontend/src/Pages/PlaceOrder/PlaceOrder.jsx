import { useContext, useEffect } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount,token , food_list,url,cartItems,loading, promoDiscount, profile } = useContext(StoreContext);
  const [data,setdata] = useState({
    first_name:"",
    last_name:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onchangehandeler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata(data => ({...data,[name]:value}))
  }

  const placeOder = async (event) => {

    event.preventDefault();
    try {
      let order_items = [];
      food_list.map((item) => {
        if(cartItems[item._id]>0){
          let itemInfo = { ...item };
          itemInfo["quantity"] = cartItems[item._id];
          order_items.push(itemInfo);
        }
      })
      const subtotal = getTotalCartAmount();
      const discountAmount = Math.round((subtotal * promoDiscount / 100) * 100) / 100;
      const deliveryFee = subtotal === 0 ? 0 : 2;
      const totalAmount = subtotal === 0 ? 0 : subtotal - discountAmount + deliveryFee;

      let order_data = {
        address : data,
        items:order_items,
        amount:totalAmount,
        promoDiscount: promoDiscount
      }
      let response = await axios.post(url+"/api/order/place",order_data,{headers:{token}});
      if (response.data.sucess) {
        const {session_url} = response.data;
        window.location.replace(session_url);
      }
      else{
        alert("Error: " + (response.data.message || "Failed to place order"));
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error: " + (error.response?.data?.message || error.message));
    }

  }

  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      const parts = (profile.name || "").split(" ");
      const first = parts[0] || "";
      const last = parts.slice(1).join(" ") || "";
      const addr = profile.address || {};
      
      setTimeout(() => {
        setdata({
          first_name: first,
          last_name: last,
          email: profile.email || "",
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          zipcode: addr.zipcode || "",
          country: addr.country || "",
          phone: addr.phone || ""
        });
      }, 0);
    }
  }, [profile]);

  useEffect(() => {
    if (loading) return;
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount() === 0){
       navigate('/cart')
    }
  },[token, navigate, getTotalCartAmount, loading])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <form className="place-order" onSubmit={placeOder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='first_name' onChange={onchangehandeler} value={data.first_name} type="text" placeholder="First Name" />
          <input required name='last_name' onChange={onchangehandeler} value={data.last_name} type="text" placeholder="Last Name" />
        </div>
        <input required name='email' onChange={onchangehandeler} value={data.email} type="email" placeholder="Email Address" />
        <input required name='street' onChange={onchangehandeler} value={data.street} type="text" placeholder="street" />
        <div className="multi-fields">
          <input required name='city' onChange={onchangehandeler} value={data.city} type="text" placeholder="City" />
          <input required name='state' onChange={onchangehandeler} value={data.state} type="text" placeholder="state" />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onchangehandeler} value={data.zipcode}type="text" placeholder="Zip Code" />
          <input required name='country' onChange={onchangehandeler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input required name='phone' onChange={onchangehandeler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart total</h2>
          <div>
            <div className="cart-totals-detail">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            {promoDiscount > 0 && (
              <>
                <div className="cart-totals-detail" style={{ color: '#0f8a5f' }}>
                  <p>Discount ({promoDiscount}%)</p>
                  <p>-${Math.round((getTotalCartAmount() * promoDiscount / 100) * 100) / 100}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-totals-detail">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-totals-detail">
              <p>Total</p>
              <p>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() - Math.round((getTotalCartAmount() * promoDiscount / 100) * 100) / 100 + 2}</p>
            </div>
            <button type="submit">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
