import axios from "axios";
import { useState, useRef } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export default function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    async function handleSignup() {
        if (!username || !email || !password) {
            return alert("Please fill all fields");
        }

        try {
            setLoading(true);
            const response = await axios.post(
                "http://localhost:5000/api/v1/signup",
                {
                    username,
                    email,
                    password
                }
            );

            console.log(response.data);
            alert("Signup successful");
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                alert(
                    err.response?.data?.message ||
                    "Something went wrong"
                );
            } else {
                alert("Unexpected error occurred");
            }

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-primary-bg p-4">
            <div className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-xl">

                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold">
                        Create Account
                    </h1>
                    <p className="mt-2 text-gray-500">
                        Join Cortexa
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4">
                    <Input
                        ref={usernameRef}
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && username.trim() !== "") {
                                emailRef.current?.focus();
                            }
                        }}
                    />

                    <Input
                        ref={emailRef}
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && email.trim() !== "") {
                                passwordRef.current?.focus();
                            }
                        }}
                    />

                    <Input
                        ref={passwordRef}
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && password.trim() !== "") {
                                buttonRef.current?.click();
                            }
                        }}
                    />
                </div>

                {/* Button */}
                <div className="mt-6 flex justify-center">
                    <button
                        ref={buttonRef}
                        className="w-full"
                    >
                        <Button
                            variant="primary"
                            size="xl"
                            text={loading ? "Loading..." : "Sign Up"}
                            onClick={handleSignup}
                            disabled={loading}
                        />
                    </button>
                </div>
            </div>
        </div>
    )
}