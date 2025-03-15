'use client';
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Boxes } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

const features = [
  {
    icon: <Zap className="w-5 h-5 text-indigo-400" />,
    title: "Lightning Fast",
    description: "Create automations in seconds with AI assistance"
  },
  {
    icon: <Shield className="w-5 h-5 text-indigo-400" />,
    title: "Enterprise Ready",
    description: "Bank-level security with 99.99% uptime guarantee"
  },
  {
    icon: <Boxes className="w-5 h-5 text-indigo-400" />,
    title: "1000+ Integrations",
    description: "Connect with all your favorite tools and apps"
  }
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b mt-2 from-indigo-600 via-indigo-400 to-indigo-200 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Gradient Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block mb-8"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-600 to-indigo-400">
              ✨ Workflow Builder
            </span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200 leading-tight mb-6">
            Automation the workflow
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-xl text-indigo-100 max-w-2xl mx-auto">
            Transform your workflow with ForgeFlow AI-powered automation platform. 
            Connect apps, automate tasks, and boost productivity in minutes.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
              onClick={() => {}}
            >
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-indigo-400 text-white hover:bg-indigo-800/50"
              onClick={() => {}}
            >
              Watch Demo
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="bg-indigo-800/30 backdrop-blur-lg rounded-xl p-6 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300"
              >
                <div className="bg-indigo-700/30 rounded-lg p-2 w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-indigo-100">{feature.title}</h3>
                <p className="text-indigo-200/80">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;