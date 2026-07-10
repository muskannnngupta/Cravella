
import "./Exploremenu.css";
import { menu_list } from "../../../assets/assets";

const Exploremenu = ({category,setcategory}) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore Our Menu</h1>
      <p className="explore-menu-text">
        Discover a world of flavors with our diverse menu, crafted to satisfy
        every craving. From savory appetizers to indulgent desserts, our
        offerings are designed to delight your taste buds and elevate your
        dining experience.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div onClick={() => setcategory(prev => (prev === item.menu_name ? "All" : item.menu_name))} className="explore-menu-item" key={index}>
              <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default Exploremenu;
