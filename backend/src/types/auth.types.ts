import express from "express";

export type JWTPayload = {
    id: string
}

export type AuthRequest = express.Request & {
    user?: any,
    admin?: any
}