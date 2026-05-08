import { ENV } from "./config.js";
import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import express from "express";
import mongoose from "mongoose";
import { UserModel, TagModel, ContentModel, LinkModel } from "./db.js";
import { userAuthMiddleware } from "./auth.js";
import crypto from "crypto";


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
        return res.status(200).json({ message: "You are signed up." });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(403).json({
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
        return res.status(403).json({ error: 'Invalid email or password.' });
    }

    let passwordMatch;
    try {
        passwordMatch = await bcrypt.compare(password, foundUser.password);
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong.' });
    }

    if (!passwordMatch) {
        return res.status(403).json({ error: 'Invalid email or password.' });
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

const contentTypes = ["image", "audio", "video", "article", "tweet", "document", "link", "other"] as const;

app.post("/api/v1/content", async (req: express.Request, res: express.Response) => {
    const requiredBody = z.object({
        link: z.string().url(),
        type: z.enum(contentTypes),
        title: z.string(),
        tags: z.array(z.string().transform((tag) => tag.toLowerCase().trim())).optional(),
    })

    const result = requiredBody.safeParse(req.body);

    if (!result.success) {
        return res.status(411).json({
            error: "Invalid input. " + result.error.format()
        });
    }

    let foundTags: any[] = [];
    let newTags: string[] = [];
    let insertedTags: any[] = [];
    try {
        foundTags = await TagModel.find({
            title: { $in: result.data.tags || [] }
        }).lean();

        const foundTagsSet = new Set(foundTags.map(tag => tag.title));

        newTags = (result.data.tags || []).filter((tag) => !foundTagsSet.has(tag));

        if (newTags.length > 0) {
            insertedTags = await TagModel.insertMany(newTags.map((tag) => ({ title: tag })));
        }
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }

    const { link, type, title } = result.data;
    try {
        await ContentModel.create({
            link: link,
            type: type,
            title: title,
            tags: [...foundTags, ...insertedTags].map((tag) => tag._id),
            userId: req.user._id
        })

        return res.status(201).json({
            message: "Content created."
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.get("/api/v1/contents", async (req: express.Request, res: express.Response) => {
    const userId = req.user._id;

    try {
        const contents = await ContentModel.find({ userId: userId }).populate("tags").sort({ createdAt: -1 }).lean();
        return res.status(200).json({
            contents: contents
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.get("/api/v1/content/title", async (req: express.Request, res: express.Response) => {
    const title: string = req.query.title as string;
    const userId = req.user._id;

    if (!title) {
        return res.status(411).json({
            error: "Title query parameter is required."
        });
    }

    try {
        const content = await ContentModel.find({ title: title, userId: userId }).populate("tags").sort({ createdAt: -1 }).lean();

        return res.status(200).json({
            contents: content
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.get("/api/v1/content/:id", async (req: express.Request, res: express.Response) => {
    const contentId = req.params.id as string;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({
            error: "Invalid content ID."
        });
    }

    try {
        const content = await ContentModel.findOne({ _id: contentId, userId: userId }).populate("tags").lean();
        if (!content) {
            return res.status(404).json({
                error: "Content not found."
            });
        }
        return res.status(200).json({
            content: content
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.delete("/api/v1/content/:id", async (req: express.Request, res: express.Response) => {
    const contentId = req.params.id as string;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
        return res.status(400).json({
            error: "Invalid content ID."
        });
    }

    try {
        const deleted = await ContentModel.findOneAndDelete({
            _id: contentId,
            userId: userId
        });

        if (!deleted) {
            return res.status(404).json({
                error: "Content not found."
            });
        }

        return res.status(200).json({
            message: "Content deleted."
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.post("/api/v1/brain/share", async (req: express.Request, res: express.Response) => {
    const share = req.body.share;
    const userId = req.user._id;

    if (typeof share !== "boolean") {
        return res.status(411).json({
            error: "Share field is required and must be a boolean."
        });
    }

    try {
        if (share) {
            const existingLink = await LinkModel.findOne({ userId }).lean();

            if (existingLink) {
                return res.status(200).json({
                    link: `/api/v1/brain/${existingLink.hash}`
                })
            }

            const hash = crypto.randomBytes(10).toString("hex");

            await LinkModel.create({
                hash: hash,
                userId: userId
            })

            return res.status(200).json({
                link: `/api/v1/brain/${hash}`
            });
        } else {
            await LinkModel.deleteOne({
                userId: userId
            });

            return res.status(200).json({
                message: "Share link removed."
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});

app.get("/api/v1/brain/:sharelink", async (req: express.Request, res: express.Response) => {
    const hash = req.params.sharelink as string;

    try {
        const link = await LinkModel.findOne({ hash: hash }).lean();

        if (!link) {
            return res.status(404).json({
                error: "Invalid share link."
            });
        }

        const contents = await ContentModel.find({ userId: link.userId }).populate("tags").lean();

        const user = await UserModel.findById(link.userId).lean();

        return res.status(200).json({
            username: user?.username,
            contents: contents
        });
    } catch (err) {
        return res.status(500).json({
            error: "Something went wrong."
        });
    }
});


startServer();