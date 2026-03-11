import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  email: string;
  role: string;
};

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is missing in env");

const jwtSecret: string = secret;

export function signJwt(payload: JwtPayload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as JwtPayload;
}