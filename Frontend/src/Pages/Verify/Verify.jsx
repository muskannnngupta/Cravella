import { useContext, useEffect } from 'react'
import "./verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';

const Verify = () => {
    const [searchparams] = useSearchParams();
    const success = searchparams.get("success");
    const orderId = searchparams.get("order");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const response = await axios.post(url + "/api/order/verify", { success, orderId });
                if (response.data.success) {
                    navigate("/myorders");
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Verification failed:", error);
                navigate("/");
            }
        }
        verifyPayment();
    }, [url, success, orderId, navigate]);

    return (
        <div className='verify'>
            <div className="spinner"></div>
        </div>
    )
}

export default Verify;
