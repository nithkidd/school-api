import jwt from "jsonwebtoken";

// JWT Authentication Middleware
export const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        message: "Access token is required",
      });
    }

    // Verify token
    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      (err, user) => {
        if (err) {
          return res.status(403).json({
            message: "Invalid or expired token",
          });
        }

        // Add user info to request object
        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      message: "Internal server error during authentication",
    });
  }
};

// Middleware to check if user is authenticated (returns user info if token exists)
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      req.user = null;
      return next();
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key",
      (err, user) => {
        if (err) {
          req.user = null;
        } else {
          req.user = user;
        }
        next();
      }
    );
  } catch (error) {
    req.user = null;
    next();
  }
};
