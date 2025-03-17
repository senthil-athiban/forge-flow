"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import UserService from "@/services/user.service";

interface FormInput {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
}

export const FloatingLabelInput = ({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword((prev) => !prev);
  return (
    <div className="relative">
      <input
        id={id}
        type={type === "password" ? (showPassword ? "text" : "password") : type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(value.length === 0 ? false : true)}
        className="block px-4 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-indigo-600 peer"
        placeholder=" "
      />
      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] 
          ${
            isFocused || value
              ? "bg-white px-2 text-indigo-600 left-2"
              : "text-gray-500 left-4 top-3 scale-100"
          } 
          peer-focus:px-2 
          peer-focus:text-indigo-600 
          peer-focus:bg-white 
          peer-focus:scale-75 
          peer-focus:-translate-y-4 
          peer-placeholder-shown:scale-100 
          peer-placeholder-shown:translate-y-0`}
      >
        {label}
      </label>
      {type === "password" && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600 focus:outline-none"
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      )}
    </div>
  );
};

const ProfileCard = () => {
  const [formData, setFormData] = useState<FormInput>({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [image, setImage] = useState<File>();

  const handleChange =
    (field: keyof FormInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async () => {
    console.log("image:", image);
    const form = new FormData();
    if (!image) return;
    form.set("file", image);
    form.set("filename", image.name);
    // Log as Object
    console.log("Form data keys:", Array.from(form.keys()));

    const res = await UserService.updateProfile(form);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900">
          My Profile
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-x-6 items-start">
          <form className="flex-1 space-y-4">
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src=""
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-2"
                >
                  <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setImage(e.target.files?.[0])}
                  />
                </Button>
              </div>
            </div>

            <FloatingLabelInput
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange("name")}
            />
            <FloatingLabelInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange("email")}
            />
            <FloatingLabelInput
              id="oldPassword"
              label="Current Password"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange("oldPassword")}
            />
            <FloatingLabelInput
              id="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
            />

            <div className="flex justify-end pt-4">
              <Button variant="outline" type="button" className="mr-2">
                Cancel
              </Button>
              <Button variant={"primary"} type="button" onClick={handleSubmit}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
