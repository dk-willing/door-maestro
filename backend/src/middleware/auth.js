const jwt = require("jsonwebtoken");

function createAuthMiddleware(jwtSecret) {
  return (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      req.admin = jwt.verify(header.slice(7), jwtSecret);
      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

module.exports = { createAuthMiddleware };
