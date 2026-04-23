import { motion } from 'framer-motion';
import { Scale, Zap, Globe, ArrowLeft, Terminal, Cpu, Braces } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Terms() {
  return (
    <div className="bg-[#B0FFFA] min-h-screen">
      
      {/* 1. HERO - THE MAGIC CONTRACT */}
      <section className="pt-40 pb-20 px-6 border-b-8 border-[#FF0087] bg-[#B0FFFA]">
        <div className="max-w-7xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#FF0087] mb-12 hover:gap-6 transition-all relative z-50 pointer-events-auto">
            <ArrowLeft size={16} /> GO_BACK
          </Link>
          <h1 className="text-[15vw] md:text-[18vw] font-black italic tracking-tighter text-[#FF0087] leading-[0.7] uppercase mb-10 select-none">
            OUR <br /> <span className="text-transparent" style={{ WebkitTextStroke: '2px #FF0087' }}>RULES.</span>
          </h1>
          <div className="flex items-center gap-4 text-[#FF0087] opacity-60">
             <span className="text-xs font-black uppercase tracking-widest italic">Last Update: May 2026</span>
          </div>
        </div>
      </section>

      {/* 2. THE PROTOCOL LIST */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="space-y-32">
          
          {/* RULE 01 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 flex items-center gap-8">
              <span className="text-[10vw] font-black italic text-[#FF0087] leading-none opacity-20">01</span>
              <div className="w-16 h-16 bg-[#FF0087] rounded-2xl flex items-center justify-center text-[#B0FFFA]">
                <Zap size={32} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-5xl font-black italic text-[#FF0087] uppercase mb-6 tracking-tighter">Be Kind</h2>
              <p className="text-2xl font-bold text-[#FF0087] leading-tight uppercase italic opacity-90">
                Use Nestly to create beautiful and happy stories. We don't allow any harmful, mean, or inappropriate content. If you break the rules, you won't be able to use the magic anymore.
              </p>
            </div>
          </div>

          {/* RULE 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 flex items-center gap-8">
              <span className="text-[10vw] font-black italic text-[#FF0087] leading-none opacity-20">02</span>
              <div className="w-16 h-16 bg-[#00F7FF] rounded-2xl flex items-center justify-center text-[#FF0087]">
                <Globe size={32} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-5xl font-black italic text-[#FF0087] uppercase mb-6 tracking-tighter">Your Stories</h2>
              <p className="text-2xl font-bold text-[#FF0087] leading-tight uppercase italic opacity-90">
                You own the stories you create with Nestly. You can share them with anyone you like! Just remember that our AI is here to help you dream, not to hurt anyone.
              </p>
            </div>
          </div>

          {/* RULE 03 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4 flex items-center gap-8">
              <span className="text-[10vw] font-black italic text-[#FF0087] leading-none opacity-20">03</span>
              <div className="w-16 h-16 bg-[#FF7DB0] rounded-2xl flex items-center justify-center text-[#FF0087]">
                <Scale size={32} />
              </div>
            </div>
            <div className="lg:col-span-8">
              <h2 className="text-5xl font-black italic text-[#FF0087] uppercase mb-6 tracking-tighter">The Deal</h2>
              <p className="text-2xl font-bold text-[#FF0087] leading-tight uppercase italic opacity-90">
                We might update these rules sometimes as we grow. When you join Nestly, you agree to follow these simple steps to keep the magic safe for everyone.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. THE CODE FOOTER */}
      <section className="bg-[#FF0087] py-40 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <h2 className="text-[10vw] font-black italic text-[#B0FFFA] uppercase leading-none mb-10 tracking-tighter">
            READY TO <br /> DREAM.
          </h2>
          <div className="flex justify-center">
             <Link to="/auth" className="px-10 py-4 border-4 border-[#B0FFFA] text-[#B0FFFA] text-xl font-black italic uppercase tracking-widest rounded-3xl hover:bg-[#B0FFFA] hover:text-[#FF0087] transition-all">
               JOIN THE MAGIC
             </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
