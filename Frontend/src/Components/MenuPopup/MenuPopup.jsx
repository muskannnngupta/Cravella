import { useContext, useState } from 'react';
import './MenuPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';

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

const MenuPopup = ({ setShowMenuCard }) => {
  const { foodList, url } = useContext(StoreContext);
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories from foodList
  const categories = ["All", ...new Set(foodList.map(item => {
    // Normalize category display name
    const cat = item.category;
    if (cat.toLowerCase() === "salad") return "Salads";
    if (cat.toLowerCase() === "rolls") return "Rolls";
    if (cat.toLowerCase() === "dessert" || cat.toLowerCase() === "deserts") return "Desserts";
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }))];

  const matchCategory = (itemCat) => {
    if (activeCategory === "All") return true;
    
    const sel = activeCategory.toLowerCase();
    const item = itemCat.toLowerCase();
    
    if (sel === item) return true;
    if (sel.startsWith(item) || item.startsWith(sel)) return true;
    if ((sel.includes("desert") || sel.includes("dessert")) && (item.includes("desert") || item.includes("dessert"))) return true;
    
    return false;
  };

  const filteredItems = foodList.filter(item => matchCategory(item.category));

  return (
    <div className='menu-popup-overlay'>
      <div className='menu-card'>
        {/* Header */}
        <div className='menu-card-header'>
          <div className='menu-card-brand'>
            <span className='brand-decorator'>✦</span>
            <h1>CRAVELLA CAFE & RESTRO</h1>
            <span className='brand-decorator'>✦</span>
          </div>
          <p className='menu-card-subtitle'>Our Culinary Masterpieces</p>
          <img 
            onClick={() => setShowMenuCard(false)} 
            src={assets.cross_icon} 
            alt="Close" 
            className="menu-card-close" 
          />
        </div>

        {/* Categories Tabs */}
        <div className='menu-card-tabs'>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              className={`menu-tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Content */}
        <div className='menu-card-content'>
          <div className='menu-items-grid'>
            {filteredItems.map((item) => (
              <div className='menu-item-row' key={item._id}>
                <div className='menu-item-image-wrapper' style={{ position: 'relative' }}>
                  <img src={url + "/images/" + item.image} alt={item.name} className='menu-item-thumbnail' />
                  <div className="veg-nonveg-tag-overlay" style={{ bottom: '5px', left: '5px', padding: '3px' }}>
                    <span className={`veg-nonveg-tag ${checkIsVeg(item.name) ? 'veg' : 'non-veg'}`}></span>
                  </div>
                </div>
                <div className='menu-item-details'>
                  <div className='menu-item-title-line'>
                    <h3 className='menu-item-name'>{item.name}</h3>
                    <span className='menu-item-connector'></span>
                    <span className='menu-item-price'>${item.price}</span>
                  </div>
                  <p className='menu-item-desc'>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className='menu-card-footer'>
          <p>* Freshly cooked and served hot. Please let us know of any allergies before placing your order. *</p>
        </div>
      </div>
    </div>
  );
};

export default MenuPopup;
