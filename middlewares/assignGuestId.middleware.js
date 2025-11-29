import { v4 as uuidv4 } from "uuid";

export const ensureGuestId = (req, res, next) => {
  let guestId = req.cookies.guestId;

  // Create only ONCE
  if (!guestId) {
    guestId = uuidv4();

    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }

  req.guestId = guestId;
  next();
};
