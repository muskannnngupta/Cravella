import express from "express"
import authMiddleware from "../Middleware/Auth.js"
import { placeorder, verifyOrder, userOrder, listorders, updateStatus } from "../Controllers/orderController.js"

const orderRouter = express.Router();

orderRouter.post("/place",authMiddleware,placeorder);
orderRouter.post("/verify",verifyOrder);
orderRouter.post("/userorders",authMiddleware,userOrder);
orderRouter.get('/list',listorders)
orderRouter.post('/status',updateStatus)
 
export default orderRouter