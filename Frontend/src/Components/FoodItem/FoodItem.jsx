import { useContext } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";

const checkIsVeg = (name) => {
  if (!name) return true;
  const lowercaseName = name.toLowerCase();
  const nonVegKeywords = [
    "chicken", "fish", "egg", "meat", "pork", "beef", 
    "mutton", "prawn", "shrimp", "salmon", "tuna", 
    "turkey", "lamb", "bacon", "pepperoni", "ham"
  ];
  return !nonVegKeywords.some(keyword => lowercaseName.includes(keyword));
};

const FoodItem = ({ id, name, price, description, image, category, averageRating }) => {

  const {cartItems, addToCart, removeFromCart, url, setActiveDetailItem, favorites, toggleFavorite} = useContext(StoreContext);
  
  const isFavorite = favorites.includes(id);

  return (
    <div className="food-item" onClick={() => setActiveDetailItem({ _id: id, name, price, description, image, category, averageRating })}>
      <div className="food-item-img-container">
        <img src={url+"/images/"+image} alt="" className="food-item-image" />
        <div className="veg-nonveg-tag-overlay">
          <span className={`veg-nonveg-tag ${checkIsVeg(name) ? 'veg' : 'non-veg'}`}></span>
        </div>
        <div 
          className="favorite-icon-overlay" 
          onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
        >
          {isFavorite ? '❤️' : '🤍'}
        </div>
        {!cartItems[id] ? (
          <img
            src={assets.add_icon_white}
            alt=""
            className="add"
            onClick={(e) => { e.stopPropagation(); addToCart(id); }}
          />
        ) : (
          <div className="food-item-counter" onClick={(e) => e.stopPropagation()}>
            <img
              src={assets.remove_icon_red}
              alt=""
              onClick={(e) => { e.stopPropagation(); removeFromCart(id); }}
            />
            <p>{cartItems[id]}</p>
            <img
              src={assets.add_icon_green}
              alt=""
              onClick={(e) => { e.stopPropagation(); addToCart(id); }}
            />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="food-item-rating-badge">
            <span className="rating-badge-star">★</span>
            <span>{averageRating || 5}</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">${price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
