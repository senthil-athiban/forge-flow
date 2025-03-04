import Hero from "@/components/Home/Hero";
import Features from "@/components/Home/Features";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
