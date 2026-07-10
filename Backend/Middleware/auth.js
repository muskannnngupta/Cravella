import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    const {token} = req.headers;

    if(!token){
        return res.status(401).json({success: false, message: "Unauthorized"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = req.user || {};
        req.user.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Invalid token"})
    }

}

export default authMiddleware;