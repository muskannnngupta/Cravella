import { Fragment, useContext, useState } from 'react'
import './Cart.css'
import axios from 'axios'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = ({ setShowLogin }) => {
  const { 
    cartItems, 
    foodList, 
    removeFromCart, 
    getTotalCartAmount,
    url,
    loading,
    promoDiscount,
    setPromoDiscount,
    promoCode,
    setPromoCode,
    token
  } = useContext(StoreContext)

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState(promoCode);

  const handlePromoSubmit = async () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      alert("Please enter a promo code");
      return;
    }
    
    try {
      const response = await axios.post(url + "/api/promo/validate", { code });
      if (response.data.success) {
        setPromoDiscount(response.data.discountPercentage);
        setPromoCode(code);
        alert(`Promo code applied successfully! ${response.data.discountPercentage}% discount applied.`);
      } else {
        alert(response.data.message || "Invalid promo code");
        setPromoDiscount(0);
        setPromoCode("");
      }
    } catch (error) {
      console.error("Error validating promo code", error);
      alert("Error validating promo code");
    }
  };

  const subtotal = getTotalCartAmount();
  const discountAmount = Math.round((subtotal * promoDiscount / 100) * 100) / 100;
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const totalAmount = subtotal === 0 ? 0 : subtotal - discountAmount + deliveryFee;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Dish</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {foodList.map((item) => {
          if(cartItems[item._id] > 0 ){
            return (
              <Fragment key={item._id}>
              <div className="cart-items-title cart-items-item">
                  
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p className='cross' onClick={() => removeFromCart(item._id)}>x</p>
              </div>
              <hr />
              </Fragment>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart total</h2>
          <div>
            <div className="cart-totals-detail">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            {promoDiscount > 0 && (
              <>
                <div className="cart-totals-detail" style={{ color: '#0f8a5f' }}>
                  <p>Discount ({promoCode} - {promoDiscount}%)</p>
                  <p>-${discountAmount}</p>
                </div>
                <hr />
              </>
            )}
            <div className="cart-totals-detail">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-totals-detail">
              <b>Total</b>
              <b>${totalAmount}</b>
            </div>
            <button onClick={() => {
              if (!token) {
                alert("Please login first to proceed to checkout!");
                setShowLogin(true);
              } else {
                navigate('/order');
              }
            }}>PROCEED TO CHECKOUT</button>
          </div>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promocode, enter it here</p>
            <div className="cart-promocode-input">
              <input 
                type="text" 
                placeholder='promocode' 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
              />
              <button onClick={handlePromoSubmit}>Submit</button>
            </div>
            {promoDiscount > 0 && (
              <p style={{ color: '#0f8a5f', fontSize: '13px', marginTop: '8px' }}>
                Active Code: <strong>{promoCode}</strong> ({promoDiscount}% discount applied)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
