import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    PORT: z.string(),
    JWT_SECRET: z.string(),
    MONGODB_URL: z.string(),
    SALT_ROUNDS: z.string()
})

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("Invalid environment variables:", parsedEnv.error.format());
    process.exit(1);
}

const parsedData = parsedEnv.data;

export const ENV = {
    PORT: parsedData.PORT,
    JWT_SECRET: parsedData.JWT_SECRET,
    MONGODB_URL: parsedData.MONGODB_URL,
    SALT_ROUNDS: parseInt(parsedData.SALT_ROUNDS)
};