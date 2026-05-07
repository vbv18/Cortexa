import express from "express";
import { ENV } from "./config.js";
import jwt from "jsonwebtoken";
import { UserModel } from "./db.js";
import type mongoose from "mongoose";

const app = express();
app.use(express.json());

interface JWTPayload {
    id: string
}

interface AuthRequest extends express.Request {
    user?: any,
    admin?: any
}

export function createAuthMiddleware(
    Model: mongoose.Model<any>,
    role: string
) {
    return async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access."
            })
        }

        let decodedDetails: JWTPayload;
        try {
            decodedDetails = jwt.verify(token, ENV.JWT_SECRET) as JWTPayload;
        } catch (err) {
            return res.status(401).json({
                error: "Invaid or expired token."
            })
        }

        try {
            const found = await Model.findById(decodedDetails.id).lean();

            if (!found) {
                return res.status(401).json({
                    error: "Unauthorized access"
                })
            }

            if (found.role !== role) {
                return res.status(403).json({
                    error: "Forbidden"
                });
            }

            req.user = found;
            next();
        } catch (err) {
            return res.status(500).json({
                error: "Something went wrong."
            })
        }
    }
}

export const userAuthMiddleware = createAuthMiddleware(
    UserModel,
    "user"
);