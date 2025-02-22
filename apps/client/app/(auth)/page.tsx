import Hero from "@/components/Hero";
import HeroVideo from "@/components/HeroVideo";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex flex-col max-w-7xl m-auto p-4">
      <Navbar />
      <Hero />
      <HeroVideo />
    </main>
  );
}
