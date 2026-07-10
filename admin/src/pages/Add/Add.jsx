import React, { useRef, useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from 'axios'
import { toast } from 'react-toastify'; 

const Add = ({ url }) => {

  const fileInputRef = useRef(null);

  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onSubmitHandler = async(event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("price", Number(data.price));
    const response = await axios.post(`${url}/api/food/add`, formData);  
    if(response.data.success){
      setData({
        name: "",
        description: "",
        category: "Salad",
        price: ""
      })
      setImage(false);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      // handle error here if needed
    }
  };

  return (
    <div className='add'>

      <form className = 'flex-col' onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
           <p>Upload Image</p>
           <label htmlFor="image" >
            <img src={image?URL.createObjectURL(image):assets.upload_area} alt="Upload area" />
           </label>
           <input ref={fileInputRef} onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input onChange = {onChangeHandler} value = {data.name} type="text" placeholder='Enter Product Name' name = 'name' required />
        </div>
        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea onChange = {onChangeHandler} value = {data.description} placeholder='Enter Product Description' name = 'description' rows = "6" required />
        </div>  
        <div className="add-category-price flex-col">

          <div className="add-category flex-col">
            <p>Category</p>
            <select onChange = {onChangeHandler} value = {data.category} name="category" required>
              <option value="Salad">Salad</option>
              <option value="rolls">Rolls</option>
              <option value="burger">Sandwich</option>
              <option value="pasta">Pasta</option>
              <option value="dessert">Dessert</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p> Product  Price</p>
            <input onChange = {onChangeHandler} value = {data.price} type="number" placeholder='Enter Price' name = 'price' required />
          </div>
        </div>
        <button type="submit" className="add-btn">Add Product</button>
      </form>
      
    </div>
  )
}

export default Add
