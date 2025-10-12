import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  return jwt.sign({ userData: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
};

export default generateToken;