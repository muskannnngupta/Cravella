import { useContext, useState } from "react";
import "./Search.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../../Components/FoodItem/FoodItem";

const Search = () => {
  const { foodList } = useContext(StoreContext);
  const [query, setQuery] = useState("");

  const popularKeywords = [
    "Veg", "Non-Veg", "Salad", "Rolls", "Deserts", 
    "Sandwich", "Cake", "Pasta", "Noodles", "Chicken"
  ];

  const handleKeywordClick = (keyword) => {
    setQuery(keyword);
  };

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

  const filteredFood = foodList.filter((item) => {
    if (!query.trim()) return false;
    const lowerQuery = query.toLowerCase().trim();

    if (lowerQuery === "veg") {
      return checkIsVeg(item.name);
    }
    
    if (lowerQuery === "non veg" || lowerQuery === "non-veg" || lowerQuery === "nonveg") {
      return !checkIsVeg(item.name);
    }

    return (
      item.name.toLowerCase().includes(lowerQuery) ||
      item.category.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>Discover Delicious Food</h1>
        <p>Find your favorite dishes, cuisines, or desserts instantly</p>
      </div>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search for pizza, salad, pasta, chicken..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          autoFocus
        />
        {query && (
          <button className="clear-btn" onClick={() => setQuery("")}>
            ✕
          </button>
        )}
      </div>

      <div className="suggestions-container">
        <p className="suggestions-label">Popular Searches:</p>
        <div className="suggestions-list">
          {popularKeywords.map((keyword, index) => (
            <span
              key={index}
              className={`suggestion-badge ${
                query.toLowerCase() === keyword.toLowerCase() ? "active" : ""
              }`}
              onClick={() => handleKeywordClick(keyword)}
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>

      <div className="search-results-section">
        {query.trim() === "" ? (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <h3>What are you craving today?</h3>
            <p>Type in the search bar above or choose a popular search tag to explore.</p>
          </div>
        ) : filteredFood.length > 0 ? (
          <div>
            <h2 className="results-heading">
              Showing {filteredFood.length} result{filteredFood.length > 1 ? "s" : ""} for "{query}"
            </h2>
            <div className="search-results-grid">
              {filteredFood.map((item, index) => (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                  category={item.category}
                  averageRating={item.averageRating}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="no-results-card">
            <div className="no-results-icon">🍽️❌</div>
            <h2>No food items found matching "{query}"</h2>
            <p>We couldn't find anything matching your search. Please check your spelling or search for another delicious dish.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
