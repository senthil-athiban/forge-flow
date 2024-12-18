import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col max-w-7xl m-auto p-4">
      <Hero />
      <HeroVideo />
    </main>
  );
}
