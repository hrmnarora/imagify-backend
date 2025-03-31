import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    try {
        console.log("Authorization Header:", req.headers.authorization);
        const token = req.headers.authorization?.split(" ")[1];
    
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ success: false, message: "No token provided" });
        }
    
        console.log("Token:", token);
    
        const decoded = jwt.decode(token, { complete: true });
        console.log("Decoded Token (Without Verification):", decoded);
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Verified Token:", verified);
    
        req.userId = verified.id;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
    
};

export default userAuth;
