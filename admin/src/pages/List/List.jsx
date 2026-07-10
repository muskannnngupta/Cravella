import React, { useState, useEffect, useCallback } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      console.log("API Response:", response.data);
      if (response.data.success) {
        console.log("Foods fetched:", response.data.data);
        setList(response.data.data);
      } else {
        toast.error("Error fetching list");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Failed to fetch food list");
    }
  }, [url]);

  const deleteFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      console.log("Delete Response:", response.data);
      if (response.data.success) {
        toast.success("Food item deleted successfully");
        fetchList(); // Refresh the list after deletion
      } else {
        toast.error("Failed to delete food item");
      }
    } catch (error) {
      console.error("Error deleting food item:", error);
      toast.error("Error deleting food item");
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  return (
    <div className='list'>
      <div className='list-header'>
        <h1>Food List</h1>
        <button className='refresh-btn' onClick={fetchList}>Refresh</button>
      </div>
      {list.length === 0 ? (
        <div className='empty-state'>
          <p>No food items added yet. Add items from the Add page to see them here.</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td><img src={`${url}/images/${item.image}`} alt={item.name} /></td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>${item.price}</td>
                <td className='action'>
                  <button onClick={() => deleteFood(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default List
