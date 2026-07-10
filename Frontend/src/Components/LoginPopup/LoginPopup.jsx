import { useState, useContext } from 'react'
import './Loginpopup.css'
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext'; 
import axios from 'axios';

const LoginPopup = ({setshowlogin}) => {

    const {url , setToken, loadCartData} = useContext(StoreContext);

    const [currstate,setcurrstate] = useState("Login");
    const [data,setdata] = useState({
        name : "",
        email : "",
        password : ""
    });
    const [otpInput, setOtpInput] = useState("");
    const [statusMsg, setStatusMsg] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleResendOtp = async () => {
        let type = "";
        if (currstate === "Verify Login OTP") type = "login";
        else if (currstate === "Verify Register OTP") type = "register";
        else if (currstate === "Reset Password") type = "reset";

        if (!type) return;

        setIsSubmitting(true);
        setStatusMsg("");
        try {
            const res = await axios.post(`${url}/api/user/resend-otp`, { email: data.email, type });
            if (res.data.success) {
                setStatusMsg(res.data.message);
                setResendCooldown(30); // 30 seconds cooldown
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Error resending OTP. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setdata((prev) => {
            return { ...prev, [name]: value };
        });
    };

    const onlogin = async (event) => {
        event.preventDefault();
        setStatusMsg("");
        setIsSubmitting(true);
        
        try {
            if (currstate === "Forgot Password") {
                const res = await axios.post(`${url}/api/user/forgot-password`, { email: data.email });
                if (res.data.success) {
                    setStatusMsg(res.data.message);
                    setcurrstate("Reset Password");
                    setOtpInput("");
                } else {
                    alert(res.data.message);
                }
                return;
            }

            if (currstate === "Reset Password") {
                const res = await axios.post(`${url}/api/user/reset-password`, { email: data.email, otp: otpInput, newPassword: data.password });
                if (res.data.success) {
                    alert(res.data.message);
                    setcurrstate("Login");
                } else {
                    alert(res.data.message);
                }
                return;
            }

            if (currstate === "Verify Register OTP") {
                const res = await axios.post(`${url}/api/user/verify-register-otp`, { email: data.email, otp: otpInput });
                if (res.data.success) {
                    setToken(res.data.token);
                    localStorage.setItem("token", res.data.token);
                    await loadCartData(res.data.token);
                    setshowlogin(false);
                } else {
                    alert(res.data.message);
                }
                return;
            }

            if (currstate === "Verify Login OTP") {
                const res = await axios.post(`${url}/api/user/verify-login-otp`, { email: data.email, otp: otpInput });
                if (res.data.success) {
                    setToken(res.data.token);
                    localStorage.setItem("token", res.data.token);
                    await loadCartData(res.data.token);
                    setshowlogin(false);
                } else {
                    alert(res.data.message);
                }
                return;
            }

            let newurl = url;
            if(currstate === "Login"){
                newurl += "/api/user/login";
            }
            else{
                newurl += "/api/user/register";
            }

            const response = await axios.post(newurl, data);
            if(response.data.success){
                if (response.data.otpRequired) {
                    setStatusMsg(response.data.message);
                    if (currstate === "Sign Up" || response.data.isNotVerified) {
                        setcurrstate("Verify Register OTP");
                    } else {
                        setcurrstate("Verify Login OTP");
                    }
                    setOtpInput("");
                } else {
                    setToken(response.data.token);
                    localStorage.setItem("token", response.data.token);
                    await loadCartData(response.data.token);
                    setshowlogin(false);
                }
            }
            else{
                alert(response.data.message);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }


  return (
    
    <div className='login-popup'>
        <form  className="login-popup-container" onSubmit={onlogin}>
            <div className="login-popup-title">
                <h2>{currstate}</h2>
                <img onClick={() => setshowlogin(false)}  src={assets.cross_icon} alt="" />

            </div>
            <div className="login-popup-input">
                {currstate === "Sign Up" && (
                 <input type="text" placeholder='Your name' required name='name' onChange={onChangeHandler} value={data.name} />
                )}
                
                {(currstate === "Login" || currstate === "Sign Up" || currstate === "Forgot Password" || currstate === "Verify Login OTP" || currstate === "Verify Register OTP" || currstate === "Reset Password") && (
                 <input type="email" placeholder='Email' required name='email' onChange={onChangeHandler} value={data.email} />
                )}

                {(currstate === "Reset Password" || currstate === "Verify Login OTP" || currstate === "Verify Register OTP") && (
                 <input type="text" placeholder='Enter 6-digit OTP' required value={otpInput} onChange={(e) => setOtpInput(e.target.value)} />
                )}
                
                {(currstate === "Login" || currstate === "Sign Up" || currstate === "Reset Password") && (
                 <input type="password" placeholder={currstate === 'Reset Password' ? 'New Password' : 'Password'} required name='password' onChange={onChangeHandler} value={data.password} />
                )}

                <button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="btn-spinner"></div>
                      <span>
                        {currstate.includes("OTP") || currstate.includes("Reset") ? "Verifying..." : "Processing..."}
                      </span>
                    </>
                  ) : (
                    currstate === "Sign Up" ? "Create Account" : 
                    currstate === "Forgot Password" ? "Send Reset OTP" : 
                    currstate === "Reset Password" ? "Reset Password" : 
                    currstate === "Verify Login OTP" ? "Verify & Login" : 
                    currstate === "Verify Register OTP" ? "Verify Account" : "Login"
                  )}
                </button>
                
                {statusMsg && <p style={{color: 'green', fontSize: '12px'}}>{statusMsg}</p>}

                {(currstate === "Verify Login OTP" || currstate === "Verify Register OTP" || currstate === "Reset Password") && (
                  <p style={{fontSize: '12px', marginTop: '5px', textAlign: 'center'}}>
                    Didn't receive the code?{' '}
                    {resendCooldown > 0 ? (
                      <span style={{color: 'gray', cursor: 'not-allowed', fontWeight: '500'}}>Resend in {resendCooldown}s</span>
                    ) : (
                      <span onClick={handleResendOtp} style={{color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '500'}}>Resend OTP</span>
                    )}
                  </p>
                )}

                {(currstate === "Login" || currstate === "Sign Up") && (
                  <div className="login-popup-condition">
                      <input type="checkbox" required />
                      <p>By Continuing, I agree to the term of use and Privacy Policy</p>
                  </div>
                )}
                
                {currstate === "Login" ? (
                  <>
                    <p>Create a new account? <span onClick={() => setcurrstate("Sign Up")}>Click here</span></p>
                    <p>Forgot password? <span onClick={() => setcurrstate("Forgot Password")}>Click here</span></p>
                  </>
                ) : currstate === "Sign Up" ? (
                  <p>Already have an account? <span onClick={() => setcurrstate("Login")}>Login here</span></p>
                ) : (
                  <p>Back to <span onClick={() => setcurrstate("Login")}>Login</span></p>
                )}
            </div>
        </form>
      
    </div>
  )
}

export default LoginPopup
