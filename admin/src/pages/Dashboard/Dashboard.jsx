import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { assets } from "../../assets/assets";

const Dashboard = ({ url }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(url + "/api/analytics");
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [url]);

  if (loading) {
    return <div className="dashboard-loading">Loading Analytics...</div>;
  }

  if (!stats) {
    return <div className="dashboard-error">Error loading data.</div>;
  }

  const maxRevenue = Math.max(...stats.revenueTrend.map(r => r.revenue), 1); // Avoid division by zero

  return (
    <div className="dashboard-container">
      <h3>Store Overview</h3>
      
      <div className="stats-cards-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}>
            <span>👥</span>
          </div>
          <div className="stat-card-info">
            <h4>Total Users</h4>
            <h2>{stats.totalUsers}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: "#fce4ec", color: "#c2185b" }}>
            <span>🍔</span>
          </div>
          <div className="stat-card-info">
            <h4>Menu Items</h4>
            <h2>{stats.totalItems}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: "#e8f5e9", color: "#388e3c" }}>
            <span>📦</span>
          </div>
          <div className="stat-card-info">
            <h4>Total Orders</h4>
            <h2>{stats.totalOrders}</h2>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ backgroundColor: "#fff8e1", color: "#f57c00" }}>
            <span>💰</span>
          </div>
          <div className="stat-card-info">
            <h4>Total Revenue</h4>
            <h2>${stats.totalRevenue.toFixed(2)}</h2>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h4>Revenue - Last 7 Days</h4>
          <div className="bar-chart-container">
            {stats.revenueTrend.map((day, idx) => (
              <div key={idx} className="bar-wrapper">
                <div className="bar-column">
                  <div 
                    className="bar-fill" 
                    style={{ height: `${(day.revenue / maxRevenue) * 100}%` }}
                    title={`$${day.revenue}`}
                  ></div>
                </div>
                <span className="bar-label">{day.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="summary-card">
          <h4>Delivery Status</h4>
          <div className="summary-list">
            <div className="summary-list-item">
              <span>Delivered</span>
              <strong>{stats.deliveredOrders}</strong>
            </div>
            <div className="summary-list-item">
              <span>Pending/Processing</span>
              <strong>{stats.totalOrders - stats.deliveredOrders}</strong>
            </div>
            <div className="summary-list-item">
              <span>Completion Rate</span>
              <strong>{stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
