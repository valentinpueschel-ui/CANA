import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Story } from "@/components/sections/Story";
import { Pieces } from "@/components/sections/Pieces";
import { FoundingBatch } from "@/components/sections/FoundingBatch";
import { BlessingCard } from "@/components/sections/BlessingCard";
import { JoinTable } from "@/components/sections/JoinTable";
import { Faq } from "@/components/sections/Faq";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Story />
        <Pieces />
        <FoundingBatch />
        <BlessingCard />
        <JoinTable />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
