import { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ setShowMenuCard }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const offers = [
    {
      title: "Cravella Gourmet Fest",
      subtitle: "FLAT 50% DISCOUNT",
      desc: "Experience culinary excellence delivered hot. Use the code below on checkout.",
      code: "CRAVE50",
      bgClass: "slide-pink"
    },
    {
      title: "Weekend Sweet Treats",
      subtitle: "20% OFF ALL DESSERTS",
      desc: "Satisfy your sweet tooth with our curated collection of delicious cakes & desserts.",
      code: "CRAVE20",
      bgClass: "slide-blue"
    },
    {
      title: "Sunday Special Feast",
      subtitle: "FLAT 10% OFF EVERYTHING",
      desc: "Order hot, fresh meals anytime and get flat 10% off your entire cart.",
      code: "CRAVE10",
      bgClass: "slide-yellow"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [offers.length]);

  return (
    <div className='header-carousel-wrapper'>
      {offers.map((offer, idx) => (
        <div 
          className={`header-slide ${offer.bgClass} ${currentSlide === idx ? 'active' : ''}`} 
          key={idx}
        >
          <div className="header-content">
             <div className="offer-tag">🔥 Special Limited Offer</div>
             <h1>{offer.subtitle}</h1>
             <h2>{offer.title}</h2>
             <p>{offer.desc}</p>
             <div className="promo-badge-container">
               <span className="promo-label">Use Code:</span>
               <span className="promo-code" onClick={() => {
                 navigator.clipboard.writeText(offer.code);
                 alert(`Promo code "${offer.code}" copied to clipboard!`);
               }}>{offer.code} 📋</span>
             </div>
             <div className="header-buttons">
               <button className="btn-primary" onClick={() => {
                 const element = document.getElementById('explore-menu');
                 if (element) element.scrollIntoView({ behavior: 'smooth' });
               }}>Order Now</button>
               <button className="btn-secondary" onClick={() => setShowMenuCard(true)}>View Menu Card</button>
             </div>
          </div>
        </div>
      ))}
      <div className="carousel-dots">
        {offers.map((_, idx) => (
          <span 
            key={idx} 
            className={`dot ${currentSlide === idx ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Header;
