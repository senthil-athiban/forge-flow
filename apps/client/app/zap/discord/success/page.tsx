"use client";
import { CheckCircle2 } from "lucide-react";

export default function SlackSuccessPage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Discord Connected Successfully!
        </h1>
        <p className="text-gray-600 mb-4">
          Your Discord server has been connected. Redirecting back...
        </p>
      </div>
    </div>
  );
}