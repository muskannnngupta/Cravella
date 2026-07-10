import { useContext, useState, useEffect } from 'react';
import './FoodDetailPopup.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

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

const FoodDetailPopup = () => {
  const { 
    activeDetailItem, 
    setActiveDetailItem, 
    cartItems, 
    addToCart, 
    removeFromCart, 
    url, 
    submitReview,
    token
  } = useContext(StoreContext);

  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [ratingMessage, setRatingMessage] = useState("");
  
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const item = activeDetailItem;
  const isVeg = item ? checkIsVeg(item.name) : true;

  const fetchReviews = async () => {
    if (!item) return;
    try {
      setLoadingReviews(true);
      const res = await fetch(url + "/api/review/food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodId: item._id })
      });
      const data = await res.json();
      if (data.success) {
        setReviews(data.data?.reviews || []);
        setAverageRating(data.data?.avgRating || 5);
        setTotalReviews(data.data?.totalReviews || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeDetailItem) {
      fetchReviews();
      setSelectedRating(0);
      setComment("");
    }
  }, [activeDetailItem]);

  const handleSubmitReview = async () => {
    if (!item) return;
    if (!token) {
      alert("Please sign in to rate dishes!");
      return;
    }
    if (selectedRating === 0) {
      alert("Please select a star rating");
      return;
    }
    if (!comment.trim()) {
      alert("Please write a short review");
      return;
    }

    const res = await submitReview(item._id, selectedRating, comment);
    if (res.success) {
      setRatingMessage("Thank you for your rating!");
      setComment("");
      setSelectedRating(0);
      fetchReviews();
      setTimeout(() => setRatingMessage(""), 3000);
    } else {
      alert(res.message);
    }
  };

  if (!activeDetailItem) return null;

  return (
    <div className='detail-popup-overlay' onClick={() => setActiveDetailItem(null)}>
      <div className='detail-popup-card' onClick={(e) => e.stopPropagation()}>
        <button className='close-btn' onClick={() => setActiveDetailItem(null)}>×</button>
        
        <div className='detail-popup-content'>
          {/* Left: Image Container */}
          <div className='detail-image-section'>
            <img src={url + "/images/" + item.image} alt={item.name} className='detail-image' />
            <div className="veg-nonveg-tag-overlay" style={{ bottom: '15px', left: '15px' }}>
              <span className={`veg-nonveg-tag ${isVeg ? 'veg' : 'non-veg'}`}></span>
            </div>
          </div>

          {/* Right: Details Section */}
          <div className='detail-info-section'>
            <span className='detail-category'>{item.category}</span>
            <h2 className='detail-title'>{item.name}</h2>
            
            <p className='detail-price'>${item.price}</p>
            <p className='detail-desc'>{item.description}</p>
            
            <div className='detail-divider'></div>
            
            <div className='detail-specs'>
              <p><strong>Ingredients:</strong> Chef's signature blend of organic grains, fresh green herbs, spices, and premium cold-pressed oil.</p>
              <p><strong>Preparation Time:</strong> 15-20 Mins</p>
              <p><strong>Serving:</strong> Serves 1-2 people</p>
            </div>

            <div className='detail-divider'></div>
            
            {/* Cart Controller Section */}
            <div className='detail-cart-section'>
              {!cartItems[item._id] ? (
                <button className='add-to-cart-btn' onClick={() => addToCart(item._id)}>
                  Add to Cart
                </button>
              ) : (
                <div className="detail-item-counter">
                  <img
                    src={assets.remove_icon_red}
                    alt="Remove"
                    onClick={() => removeFromCart(item._id)}
                  />
                  <p className='count-text'>{cartItems[item._id]}</p>
                  <img
                    src={assets.add_icon_green}
                    alt="Add"
                    onClick={() => addToCart(item._id)}
                  />
                </div>
              )}
            </div>

            <div className='detail-divider'></div>
            
            {/* Reviews Section */}
            <div className='detail-reviews-section'>
              <h3>Customer Reviews ({totalReviews})</h3>
              <div className='reviews-list' style={{maxHeight: '150px', overflowY: 'auto', marginBottom: '15px'}}>
                {loadingReviews ? <p>Loading reviews...</p> : 
                 reviews.length === 0 ? <p style={{color: '#888', fontSize: '13px'}}>No reviews yet. Be the first to review!</p> :
                 reviews.map((rev, idx) => (
                   <div key={idx} style={{borderBottom: '1px solid #eee', paddingBottom: '8px', marginBottom: '8px'}}>
                     <div style={{display: 'flex', justifyContent: 'space-between'}}>
                       <strong style={{fontSize: '13px'}}>{rev.userName}</strong>
                       <span style={{color: '#ff9c00', fontSize: '12px'}}>{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                     </div>
                     <p style={{fontSize: '13px', margin: '4px 0 0 0', color: '#555'}}>{rev.comment}</p>
                   </div>
                 ))
                }
              </div>

              {/* Add Review Form */}
              <div className='add-review-form' style={{backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '8px'}}>
                <h4 style={{margin: '0 0 10px 0', fontSize: '14px'}}>Write a Review</h4>
                <div className='stars-row' style={{marginBottom: '10px'}}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`star-char ${(hoverRating || selectedRating) >= star ? 'filled' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setSelectedRating(star)}
                      style={{fontSize: '20px', cursor: 'pointer', color: (hoverRating || selectedRating) >= star ? '#ff9c00' : '#ccc'}}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder='What did you like about this dish?'
                  style={{width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px', marginBottom: '10px'}}
                  rows='2'
                ></textarea>
                <button 
                  onClick={handleSubmitReview}
                  style={{backgroundColor: '#ff3333', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px'}}
                >
                  Submit Review
                </button>
                {ratingMessage && <span style={{marginLeft: '10px', color: 'green', fontSize: '13px'}}>{ratingMessage}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailPopup;
