import { useState, useContext, useEffect, useCallback } from 'react'
import "./myorder.css"
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets.js'

const Myorder = () => {

    const [data,setdata] = useState([]);
    const {url,token} = useContext(StoreContext);

    const fetchorder = useCallback(async () => {
        try {
            const response = await axios.post(url+"/api/order/userorders",{},{headers:{token}});
            setdata(response.data.data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }, [url, token]);

    useEffect(() => {
        if(token){
            setTimeout(() => {
                fetchorder();
            }, 0);
        }
    }, [token, fetchorder])

    const getStatusStep = (status) => {
        if (!status) return 1;
        const lowercaseStatus = status.toLowerCase();
        if (lowercaseStatus === "food processing") return 1;
        if (lowercaseStatus === "out for delivery") return 2;
        if (lowercaseStatus === "delivered") return 3;
        return 1;
    };

  return (
    <div className='my-orders'>
       <h2>My Orders</h2>
       <div className="container">
        {
            data.map((order,index) => {
                const step = getStatusStep(order.status);
                return(
                    <div className='my-orders-order' key={index}>
                        <div className="order-details-grid">
                            <img src={assets.parcel_icon} alt="Parcel icon" />
                            <p>{order.items.map((item,idx) => {
                                if (idx === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                } else {
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items.length}</p>
                            <button onClick={fetchorder}>Track Order</button>
                        </div>
                        <div className="order-stepper-container">
                            <div className="order-delivery-time">
                              {step === 1 && <p className="delivery-time-text">⏳ Estimated Delivery: <strong>25 - 35 Mins</strong> (Preparing your delicious meal)</p>}
                              {step === 2 && <p className="delivery-time-text">🚴 Estimated Delivery: <strong>10 - 15 Mins</strong> (Out for delivery! On the way)</p>}
                              {step === 3 && <p className="delivery-time-text">✅ Delivered: Enjoy your meal!</p>}
                            </div>
                            <div className="order-stepper">
                              <div className="step active">
                                <div className="bullet">✔</div>
                                <p>Order Placed</p>
                              </div>
                              <div className={`step-line ${step >= 1 ? "active" : ""}`}></div>
                              <div className={`step ${step >= 1 ? "active" : ""}`}>
                                <div className="bullet">{step >= 1 ? "✔" : "2"}</div>
                                <p>Preparing</p>
                              </div>
                              <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
                              <div className={`step ${step >= 2 ? "active" : ""}`}>
                                <div className="bullet">{step >= 2 ? "✔" : "3"}</div>
                                <p>Dispatched</p>
                              </div>
                              <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
                              <div className={`step ${step >= 3 ? "active" : ""}`}>
                                <div className="bullet">{step >= 3 ? "✔" : "4"}</div>
                                <p>Delivered</p>
                              </div>
                            </div>
                        </div>
                    </div>
                )
            })
        }
       </div>
    </div>
  )
}

export default Myorder;
