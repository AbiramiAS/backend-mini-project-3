import { userData } from "../model/users.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readFileSync } from "fs";

const userDB = {
  users: userData,
  setUsers: function (data) {
    this.users = data;
  },
};

dotenv.config();
export const getRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  const existingUser = userDB.users.find(
    (data) => data.refreshToken === refreshToken
  );
  if (!existingUser) return res.sendStatus(403);

  //JWT token verification
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "90s" }
    );
    res.json({ accessToken });
  });
};
export default getRefreshToken;
