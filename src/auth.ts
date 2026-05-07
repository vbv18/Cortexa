import { z } from "zod";
import express from "express";
import { ENV } from "./config.js";
import jwt from "jsonwebtoken";
import { UserModel } from "./db.js";
import type mongoose from "mongoose";

const app = express();
app.use(express.json());

export function createAuthMiddleware(
    Model: mongoose.Model<any>,
    role: string
) {
    return async (req, res, next) => {
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                error: "Unauthorized access."
            })
        }

        let decodedDetails;
        try {
            decodedDetails = jwt.verify(token, ENV.JWT_SECRET);
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

            req[role] = found;
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