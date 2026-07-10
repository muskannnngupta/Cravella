import express from 'express'
import { addFood , listfood , removefood, rateFood} from '../Controllers/foodController.js'
import authMiddleware from '../Middleware/Auth.js'

import multer from 'multer'

const foodRouter = express.Router();

//image storage engine
const storage = multer.diskStorage({
    destination:"Uploads",
    filename:(req,file,cb) => {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

foodRouter.post("/add",upload.single("image"),addFood);
foodRouter.get("/list",listfood);
foodRouter.post("/remove",removefood);
foodRouter.post("/rate", authMiddleware, rateFood);







export default foodRouter;