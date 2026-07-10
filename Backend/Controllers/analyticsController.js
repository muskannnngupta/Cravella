import orderModel from "../Models/orderModel.js";
import userModel from "../Models/userModel.js";
import foodModel from "../Models/foodModel.js";

const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalItems = await foodModel.countDocuments();
        
        const allOrders = await orderModel.find({});
        
        let totalRevenue = 0;
        let totalOrders = allOrders.length;
        let deliveredOrders = 0;

        // Calculate Revenue from delivered orders only (or all orders, let's say all orders for simplicity or only delivered)
        allOrders.forEach(order => {
            if (order.status.toLowerCase() === "delivered") {
                deliveredOrders++;
            }
            totalRevenue += order.amount;
        });

        // Get last 7 days revenue for basic chart data
        const last7Days = [];
        for(let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0,0,0,0);
            
            const nextD = new Date(d);
            nextD.setDate(nextD.getDate() + 1);

            const dayOrders = allOrders.filter(o => {
                const orderDate = new Date(o.date);
                return orderDate >= d && orderDate < nextD;
            });

            const dayRevenue = dayOrders.reduce((acc, curr) => acc + curr.amount, 0);
            
            last7Days.push({
                date: d.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayRevenue
            });
        }

        res.json({
            success: true,
            data: {
                totalUsers,
                totalItems,
                totalOrders,
                totalRevenue,
                deliveredOrders,
                revenueTrend: last7Days
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Error fetching analytics" });
    }
};

export { getAnalytics };
