"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";

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
  onChange
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePassword = () => setShowPassword(prev => !prev);
  return (
    <div className="relative">
      <input
        id={id}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
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
          ${isFocused || value ? 
            'bg-white px-2 text-indigo-600 left-2' : 
            'text-gray-500 left-4 top-3 scale-100'
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
      {type === 'password' && (
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
            {showPassword ? 'Hide password' : 'Show password'}
          </span>
        </button>
      )}
    </div>
  );
};

const ProfileCard = () => {
  const [formData, setFormData] = useState<FormInput>({
    name: '',
    email: '',
    oldPassword: '',
    newPassword: ''
  });

  const handleChange = (field: keyof FormInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </Button>
            </div>
          </div>

          <form className="flex-1 space-y-4">
            <FloatingLabelInput
              id="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
            />
            <FloatingLabelInput
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
            />
            <FloatingLabelInput
              id="oldPassword"
              label="Current Password"
              type="password"
              value={formData.oldPassword}
              onChange={handleChange('oldPassword')}
            />
            <FloatingLabelInput
              id="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange('newPassword')}
            />

            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                className="mr-2"
              >
                Cancel
              </Button>
              <Button variant={"primary"}>
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