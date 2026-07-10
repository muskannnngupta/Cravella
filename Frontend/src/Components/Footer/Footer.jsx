import "./Footer.css";
import { assets } from "../../assets/assets";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const handleScroll = (e, elementId) => {
    e.preventDefault();
    if (isHomePage) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  const year = new Date().getFullYear();

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <span className="logo-text">Cravella<span className="logo-dot">.</span></span>
          <p>
            Cravella is your premium neighborhood food partner. We bridge the gap between your favorite restaurants and your cravings, delivering hot, delicious meals right to your doorstep. With secure payments, live order tracking, and a curated culinary selection, Cravella makes dining in feel like dining out.
          </p>
          <div className="footer-social-icons">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
          </div>
        </div>
        <div className="footer-content-center">
          <h2>COMPANY</h2>
          <ul>
            <li><a href="/" onClick={(e) => handleScroll(e, "root")}>Home</a></li>
            <li><a href="#explore-menu" onClick={(e) => handleScroll(e, "explore-menu")}>Our Menu</a></li>
            <li><a href="#app-download" onClick={(e) => handleScroll(e, "app-download")}>Mobile App</a></li>
            <li><a href="/#footer" onClick={(e) => handleScroll(e, "footer")}>Contact Us</a></li>
          </ul>
        </div>
        <div className="footer-content-right">
          <h2>GET IN TOUCH</h2>
          <ul>
            <li>+91 8463298339</li>
            <li><a href="mailto:contact@cravella.com">contact@cravella.com</a></li>
          </ul>
        </div>

        <hr />
        <p className="footer-copyright">
          Copyright © {year} Cravella.com - All Right Reserved.{" "}
        </p>
      </div>
    </div>
  );
};

export default Footer;
