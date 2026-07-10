import './Home.css'
import Header from '../../Components/Navbar/Header/Header'
import Exploremenu from '../../Components/Navbar/Exploremenu/Exploremenu'
import { useState } from 'react'
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay'
import AppDownload from '../../Components/AppDownload/AppDownload'
import MenuPopup from '../../Components/MenuPopup/MenuPopup'


const Home = () => {

  const [category, setcategory] = useState("All");
  const [showMenuCard, setShowMenuCard] = useState(false);

  return (
    <>
      {showMenuCard && <MenuPopup setShowMenuCard={setShowMenuCard} />}
      <div>
          <Header setShowMenuCard={setShowMenuCard} /> 
          <Exploremenu category = {category} setcategory={setcategory} />
          <FoodDisplay  category = {category}/>
          <AppDownload />
      </div>
    </>
  )
}

export default Home
