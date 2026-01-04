// middleware/assignGuestId.middleware.js
import { v4 as uuid } from "uuid";

export default function assignGuestId(req, res, next) {
  // If user is logged in → skip guest logic
  if (req.user) return next();

  // Check if guestId exists in cookies
  if (!req.cookies.guestId) {
    const newGuestId = uuid();

    // Determine if running on localhost or production
    const isLocalhost =
      req.hostname === "localhost" ||
      req.hostname === "127.0.0.1" ||
      req.get("origin")?.includes("localhost") ||
      process.env.NODE_ENV === "development";

    // Dynamic cookie configuration based on environment
    const cookieOptions = {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: isLocalhost ? "lax" : "none",
      secure: !isLocalhost, // true for production (HTTPS), false for localhost (HTTP)
    };

    res.cookie("guestId", newGuestId, cookieOptions);

    req.guestId = newGuestId;
  } else {
    req.guestId = req.cookies.guestId;
  }

  next();
}
