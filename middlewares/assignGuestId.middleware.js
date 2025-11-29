// middleware/assignGuestId.middleware.js
import { v4 as uuid } from "uuid";

export default function assignGuestId(req, res, next) {
  // If user is logged in → skip guest logic
  if (req.user) return next();

  // Check if guestId exists in cookies
  if (!req.cookies.guestId) {
    const newGuestId = uuid();

    res.cookie("guestId", newGuestId, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    req.guestId = newGuestId;
  } else {
    req.guestId = req.cookies.guestId;
  }

  next();
}
