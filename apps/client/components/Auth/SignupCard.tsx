"use client";
import React, { useState } from "react";
import { Github } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Google from "../Provider/Google";
import AuthService from "@/services/auth.service";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { FloatingLabelInput } from "../Profile/ProfileCard";
import Loader from "../ui/loader";

const SignupCard = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [passowrd, setpassowrd] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await AuthService.register({
        email: email,
        password: passowrd,
        name: name,
      });
      if (res) {
        toast.success(res?.message);
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Failed to signup", error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Card className="w-[440px] p-2 shadow-lg bg-white/70 background-blur-sm border border-indigo-200">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r bg-clip-text text-transparent from-indigo-600 to-indigo-400">
          Forge Flow
        </CardTitle>
        <CardDescription className="text-md text-muted-foreground">
          Welcome!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-y-2">
          <Button
            variant={"outline"}
            className="h-11 hover:bg-indigo-400 hover:text-white"
          >
            <Google />
            Continue with google
          </Button>
          <Button
            variant={"outline"}
            className="h-11 hover:bg-indigo-400 hover:text-white"
          >
            <Github className="mr-2 w-8 h-8" />
            Continue with github
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-muted-foreground">OR</span>
          </div>
        </div>

        <form
          action=""
          className="space-y-4"
          onSubmit={(e: any) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FloatingLabelInput
            id="name"
            label="Name"
            onChange={(e: any) => setName(e.target.value)}
            value={name}
            key={"name"}
            type="text"
          />
          <FloatingLabelInput
            id="email"
            label="Email"
            onChange={(e: any) => setEmail(e.target.value)}
            value={email}
            key={"email"}
            type="text"
          />
          <FloatingLabelInput
            id="password"
            label="Password"
            onChange={(e: any) => setpassowrd(e.target.value)}
            value={passowrd}
            key={"password"}
            type="password"
          />
          <Button variant={"primary"} className="w-full" type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <div className="text-center text-muted-foreground text-xs">
          Already have an account?{" "}
          <Link href={"/login"} className="text-xs text-indigo-600 underline">
            Login here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupCard;
