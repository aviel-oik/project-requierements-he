export const roleMiddleware = (requiredRole) => { 
    return (req, res, next) => {
        if (!req.user)
            return res.status(401).json({ message: "not role in request" });
        if (req.user.role !== requiredRole)
            return res.status(403).json({ message: "Just Admin allowed" });
        next();
    };
}   