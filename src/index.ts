import { ENV } from "./config.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import { UserModel, TagModel, ContentModel, LinkModel } from "./db.js";


async function connectToDB() {
    try {
        await mongoose.connect(ENV.MONGODB_URL);
        console.log('MongoDB connected.');
    }
    catch (err) {
        console.log('############ error ############');
        console.log(err);
    }
}
connectToDB();


const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.path} : ${new Date().toUTCString()}`);
    next();
});


const UserProfileScehma = z.object({
    username: z.string().min(3),
    password: z.string().min(4)
})

// type UserProfile = z.infer<typeof UserProfileScehma>;

app.post("/api/v1/signup", async (req, res) => {
    const requiredBody = z.object({
        username: z.string().min(3),
        email: z.string().email().transform(val => val.toLowerCase().trim()),
        password: z.string().min(4)
    })
    const result = requiredBody.safeParse(req.body);

    if (!result.success) {
        return res.status(411).json({
            error: "Invalid Input"
        });
    }

    const { username, email, password } = result.data;

    try {
        const hashedPassword = await bcrypt.hash(password, ENV.SALT_ROUNDS);

        await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        return res.status(201).json({ message: "You are signed up." });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json
        }
        return res.status(500).json({
            error: "Something went wrong.";
        });
    }
});

app.post("/signin", (req, res) => {

});