'use client';
import React from "react";
import PrimaryButton from "./Button/PrimaryButton";
import SecondaryButton from "./Button/SecondaryButton";
import { Check } from "lucide-react";

const features = [
  {
    "content": "Free forever for core features"
  },
  {
    "content": "More apps than any other platform"
  },{
    "content": "Cutting-edge AI features"
  }
]

const Hero = () => {
  return (
    <div className="mt-10 p-1 gap-y-4 h-[50vh] justify-center">
      <div className="flex flex-col items-center gap-y-10">
        <div className="text-7xl font-bold text-center whitespace-pre-line">
          {"Automate as fast as you can type"}
        </div>
        <div className="text-lg font-normal text-center">
          AI gives you automation superpowers, and Zapier puts them to work.
          Pairing AI and Zapier helps you turn ideas into workflows and bots
          that work for you.
        </div>
        <div className="btn flex justify-center gap-4">
          <PrimaryButton onClick={() => {}} size="lg">Get Started</PrimaryButton>
          <SecondaryButton onClick={() => {}} size="lg">Contact Sales</SecondaryButton>
        </div>
        <div className="flex gap-x-10">
          {
            features.length && features.map((feature, index) => {
              return (
                <div key={index} className="flex gap-x-2 items-center">
                  <Check size={20} />
                  <span>{feature.content}</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  );
};

export default Hero;
