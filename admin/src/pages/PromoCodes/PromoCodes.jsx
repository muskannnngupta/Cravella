import { useState, useEffect } from "react";
import axios from "axios";
import "./PromoCodes.css";

const PromoCodes = ({ url }) => {
  const [promos, setPromos] = useState([]);
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  const fetchPromos = async () => {
    try {
      const response = await axios.get(url + "/api/promo/list");
      if (response.data.success) {
        setPromos(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [url]);

  const handleAddPromo = async (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return;

    try {
      const response = await axios.post(url + "/api/promo/add", {
        code: newCode,
        discountPercentage: Number(newDiscount)
      });
      if (response.data.success) {
        alert("Promo added successfully!");
        setNewCode("");
        setNewDiscount("");
        fetchPromos();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Error adding promo code");
    }
  };

  const handleTogglePromo = async (id) => {
    try {
      const response = await axios.post(url + "/api/promo/toggle", { id });
      if (response.data.success) {
        fetchPromos();
      }
    } catch (error) {
      console.error(error);
      alert("Error toggling promo status");
    }
  };

  return (
    <div className="promo-admin">
      <h3>Manage Promo Codes</h3>
      
      <div className="add-promo-section">
        <h4>Create New Promo Code</h4>
        <form onSubmit={handleAddPromo} className="add-promo-form">
          <input 
            type="text" 
            placeholder="Code (e.g. SUMMER20)" 
            value={newCode} 
            onChange={(e) => setNewCode(e.target.value)}
            required
          />
          <input 
            type="number" 
            placeholder="Discount %" 
            value={newDiscount} 
            onChange={(e) => setNewDiscount(e.target.value)}
            required
            min="1"
            max="100"
          />
          <button type="submit">Add Promo Code</button>
        </form>
      </div>

      <div className="promo-list-section">
        <h4>Active Promo Codes</h4>
        <table className="promo-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {promos.map((promo) => (
              <tr key={promo._id}>
                <td><strong>{promo.code}</strong></td>
                <td>{promo.discountPercentage}%</td>
                <td>
                  <span className={`status-badge ${promo.isActive ? 'active' : 'inactive'}`}>
                    {promo.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>
                  <button 
                    className={`toggle-btn ${promo.isActive ? 'disable' : 'enable'}`}
                    onClick={() => handleTogglePromo(promo._id)}
                  >
                    {promo.isActive ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {promos.length === 0 && <p className="no-promos">No promo codes found.</p>}
      </div>
    </div>
  );
};

export default PromoCodes;
