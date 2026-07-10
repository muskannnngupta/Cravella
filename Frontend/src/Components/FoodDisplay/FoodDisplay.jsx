import { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../Context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const matchCategory = (selected, itemCat) => {
  if (!selected || !itemCat) return false;
  const sel = selected.toLowerCase();
  const item = itemCat.toLowerCase();
  
  if (sel === "all" || sel === item) return true;
  
  // Handle desert/dessert spelling differences
  const isDesertSel = sel.includes("desert") || sel.includes("dessert");
  const isDesertItem = item.includes("desert") || item.includes("dessert");
  if (isDesertSel && isDesertItem) return true;
  
  // Handle prefix matches (e.g., salad/salads, rolls/roll, sandwich/sandwiches)
  if (sel.startsWith(item) || item.startsWith(sel)) return true;
  
  return false;
};

const FoodDisplay = ({ category }) => {
  const { foodList, searchQuery } = useContext(StoreContext);
  return (
    <div className="food-display">
      <span className="food-display-heading">
        <h2>Top dishes near you</h2>
      </span>
      <div className="food-display-list">
        {foodList.map((item, index) => {
          const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
          if (matchCategory(category, item.category) && matchesSearch) {
            return (
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
            );
          }
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
