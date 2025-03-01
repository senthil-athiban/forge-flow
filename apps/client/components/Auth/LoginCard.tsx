"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { BACKEND_URL } from "@/app/config";
import { useRouter, useSearchParams } from "next/navigation";
import AuthService from "@/services/auth.service";
import { saveToLocalStorage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/constants/storage-keys.constant";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FloatingLabelInput } from "../Profile/ProfileCard";
import { Github } from "lucide-react";
import Google from "../Provider/Google";

const LoginCard = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  console.log('BACKEND_URL:', BACKEND_URL);
  const handleGoogleAuth = async () => {
    window.location.href = `${BACKEND_URL}/api/v1/auth/google`;
  };

  const handleGithubAuth = async () => {
    window.location.href = `${BACKEND_URL}/api/v1/auth/github`;
  };

  const onSubmit = async () => {
    try {
      const res = await AuthService.login({
        email: email,
        password: password,
      });
      const accessToken = res.accesstoken;
      saveToLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleLoginStatus = useCallback(() => {
    const verified = searchParams.get("verified");
    const expired = searchParams.get("expired");
    const invalid = searchParams.get("invalid");
    if (verified === "true") {
      toast.success("Email verified successfully. You can now log in.");
    }

    if (expired === "true") {
      toast.error("Email verification token has expired. Please signup again.");
    }

    if (invalid === "true") {
      toast.error(
        "Invalid email verification token. Please try again or request a new verification email."
      );
    }
  }, [searchParams]);

  useEffect(() => {
    handleLoginStatus();
  }, [searchParams, handleLoginStatus]);

  return (
    <Card className="w-[440px] p-2 shadow-lg bg-white/70 background-blur-sm border border-indigo-100">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl tracking-wide text-indigo-600 font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
          Forge flow
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground">
          Welcome back!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Button
            variant="outline"
            className="w-full h-11 font-medium border-2 hover:bg-indigo-300 hover:text-white"
            onClick={handleGoogleAuth}
          >
            <Google />
            Continue with Google
          </Button>
          <Button
            variant="outline"
            className="w-full h-11 font-medium border-2 hover:bg-indigo-300 hover:text-white"
            onClick={handleGithubAuth}
          >
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-muted-foreground">
              OR
            </span>
          </div>
        </div>
        <form className="flex flex-col gap-y-4" onSubmit={(e) => {e.preventDefault(); onSubmit();}}>
          <FloatingLabelInput
            id="email"
            label="Email*"
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
            key={"email"}
            type="text"
          />
          <FloatingLabelInput
            id="password"
            label="Password*"
            onChange={(e: any) => setPassword(e.target.value)}
            value={password}
            key={"password"}
            type="password"
          />
          <Link
            href={"/signup"}
            className="text-indigo-600 hover:text-indigo-700 font-normal text-xs underline"
          >
            forgot password?
          </Link>
          <Button
            type="submit"
            variant={"primary"}
            size={"lg"}
            className="w-full h-11"
          >
            Login
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center">
        <div className="text-xs text-muted-foreground">
          Don{"'"}t have an account yet?{" "}
          <Link
            href={"/signup"}
            className="text-indigo-600 hover:text-indigo-700 font-medium underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginCard;
