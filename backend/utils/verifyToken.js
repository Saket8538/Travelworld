import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
    const token = req.cookies.accessToken
    console.log(token);
    if (!token) {
        return res.status(401)
            .json({ success: false, msg: "Access denied. You're not authorized" })
    }
    // if token exists
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ success: false, message: "Token is invalid or expired" })
        }
        req.user = user
        next()
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.body.userID || req.user.role === 'admin') {
            console.log(req.user.id);
            console.log(req.body.userID);
            next();
        } else {
            res.status(401)
                .json({ success: false, message: "You're not authorized to access" })
        }
    });
}

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.role === 'admin') {
            next()
        } else {
            return res.status(401).json({ success: false, msg: "You're not authorized" })
        }
    })
}