import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import AudioDemo from '../components/AudioDemo';
import Pricing from '../components/Pricing';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Landing() {
  return (
    <div className="relative bg-[#B0FFFA] text-[#FF0087] min-h-screen font-sans selection:bg-[#FF0087] selection:text-[#B0FFFA]">
      <Hero />
      <HowItWorks />
      <Features />
      <AudioDemo />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
