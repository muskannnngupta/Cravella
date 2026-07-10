import { useContext, useState, useEffect } from 'react'
import { assets } from '../../assets/assets'
import './Navbar.css'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({setshowlogin}) => {

    const [menu,setmenu] = useState("Home");
    const {getTotalCartAmount,token,setToken,setCartItems} = useContext(StoreContext)

    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    const handleScrollLink = (e, elementId, menuName) => {
        e.preventDefault();
        setmenu(menuName);
        if (isHomePage) {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        }
    }

    const logout = () => {
        setToken("");
        localStorage.removeItem("token");
        setCartItems({});
        navigate('/');
    }

  return (
    <div className='navbar'>
        <Link to='/' className="logo-text">Cravella<span className="logo-dot">.</span></Link>
        <ul className="navbar-menu">
            <Link  to='/' onClick={() => setmenu("Home")}  className={menu==="Home" ? "active" : ""} >Home</Link>
            <a href={isHomePage ? '#explore-menu' : '/#explore-menu'} onClick={(e) => handleScrollLink(e, 'explore-menu', 'Menu')} className={menu==="Menu" ? "active" : ""} >Menu</a>
            <a href={isHomePage ? '#app-download' : '/#app-download'} onClick={(e) => handleScrollLink(e, 'app-download', 'Mobile-App')} className={menu==="Mobile-App" ? "active" : ""} >Mobile-App</a>
            <a href={isHomePage ? '#footer' : '/#footer'} onClick={(e) => handleScrollLink(e, 'footer', 'Contact us')} className={menu==="Contact us" ? "active" : ""} >Contact us</a>
        </ul>
        <div className="navbar-right">
            <div className="navbar-search-container" onClick={() => navigate('/search')}>
                <img 
                    src={assets.search_icon} 
                    alt="Search" 
                    className="search-icon" 
                />
            </div>
            <Link to="/cart" className="navbar-search-icon" onClick={() => setmenu("Cart")}>
                <img src={assets.basket_icon} alt="basket" />
                <div className={getTotalCartAmount() === 0?"":"dot"}></div>
            </Link>
            {!token ? <button onClick={() => setshowlogin(true)}>Sign In</button>
             : <div className = "navbar-profile">
                <img src={assets.profile_icon} alt="Profile" className="profile-icon" onClick={() => navigate('/profile')} style={{cursor: 'pointer'}} />
                <ul className="nav">
                    <li onClick={() => navigate('/profile')}><img src={assets.profile_icon} alt="Profile" style={{ width: '20px', height: '20px' }} /><p>My Profile</p></li>
                    <hr />
                    <li onClick={() => navigate('/myorders')}><img src={assets.bag_icon} alt="Orders" /><p>My Orders</p></li>
                    <hr />
                    <li onClick={logout}>
                        <img src={assets.logout_icon} alt="Logout" />
                        <p>Logout</p>
                    </li>
                </ul>
             </div> }
        </div>
      
    </div>
  )
}

export default Navbar
