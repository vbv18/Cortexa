import { ENV } from "./config.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import { UserModel, TagModel, ContentModel, LinkModel } from "./db.js";
import { userAuthMiddleware } from "./auth.js";


const app = express();
app.use(express.json());
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`${req.method} - ${req.path} : ${new Date().toUTCString()}`);
    next();
});


async function startServer() {
    try {
        await mongoose.connect(ENV.MONGODB_URL);

        app.listen(ENV.PORT, () => {
            console.log(`Server running on port: ${ENV.PORT}`);
        });

    } catch (err) {
        console.log(err);
    }
}


app.post("/api/v1/signup", async (req: express.Request, res: express.Response) => {
    const requiredBody = z.object({
        username: z.string().min(3),
        email: z.string().email().transform(val => val.toLowerCase().trim()),
        password: z.string().min(4)
    })
    const result = requiredBody.safeParse(req.body);

    if (!result.success) {
        return res.status(411).json({
            error: "Invalid Input. " + result.error.format()
        });
    }

    const { username, email, password } = result.data;

    try {
        const hashedPassword = await bcrypt.hash(password, ENV.SALT_ROUNDS);

        await UserModel.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: "user"
        });
        return res.status(201).json({ message: "You are signed up." });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(400).json({
                error: "Username or email already exists."
            })
        }
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.post("/api/v1/signin", async (req: express.Request, res: express.Response) => {
    const requiredBody = z.object({
        username: z.string().min(1),
        password: z.string().min(4)
    })

    const result = requiredBody.safeParse(req.body);

    if (!result.success) {
        return res.status(411).json({
            error: "Invalid input. " + result.error.format()
        })
    }

    let { username, password } = result.data;

    let foundUser;
    try {
        foundUser = await UserModel.findOne({ username: username }).lean();
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let passwordMatch;
    try {
        passwordMatch = await bcrypt.compare(password, foundUser.password);
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({
        id: foundUser._id
    }, ENV.JWT_SECRET, {
        expiresIn: "1h"
    });

    return res.status(200).json({
        token: token
    });
});


app.use(userAuthMiddleware);





startServer();
