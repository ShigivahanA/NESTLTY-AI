import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Globe, MessageCircle, ArrowRight, Check, Loader2, BookHeart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../services/db';

export default function Footer() {
   const currentYear = new Date().getFullYear();
   const [email, setEmail] = useState('');
   const [status, setStatus] = useState('idle'); // idle, loading, success, error

   const handleSubscribe = async (e) => {
      e.preventDefault();
      if (!email) return;
      setStatus('loading');
      try {
         await subscribeNewsletter(email);
         setStatus('success');
         setEmail('');
         setTimeout(() => setStatus('idle'), 5000);
      } catch (err) {
         console.error(err);
         setStatus('error');
         setTimeout(() => setStatus('idle'), 3000);
      }
   };

   return (
      <footer className="bg-[#FF0087] pt-32 pb-12 px-6 relative overflow-hidden">

         {/* 1. BACKGROUND DECOR - SUBTLE DEPTH */}
         <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] flex items-center justify-center pointer-events-none">
            <h1 className="text-[40vw] font-black italic tracking-tighter uppercase text-[#B0FFFA]">N</h1>
         </div>

         <div className="max-w-7xl mx-auto relative z-10">

            {/* 2. THE BRUTALIST GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-end pb-32 border-b-8 border-[#B0FFFA]">

               {/* LEFT: THE SIGNATURE MISSION */}
               <div className="relative">
                  <div className="flex items-center gap-4 mb-8">
                     <h2 className="text-6xl font-black italic tracking-tighter text-[#B0FFFA] uppercase leading-none">Nestly.</h2>
                  </div>

                  <p className="text-4xl md:text-5xl font-black text-[#B0FFFA] leading-[0.85] uppercase tracking-tighter max-w-xl italic">
                     Crafting Safe <br />
                     <span className="text-transparent" style={{ WebkitTextStroke: '2px #B0FFFA' }}>Celestial</span> Shards <br />
                     for Tiny Dreamers.
                  </p>
               </div>

               {/* RIGHT: THE NAVIGATION HUB - STACKED & ROWED */}
               <div className="flex flex-col gap-20">

                  {/* TOP: NEWSLETTER BOX */}
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black tracking-[0.4em] text-[#00F7FF] uppercase italic">/Newsletter</h4>
                     <p className="text-[#B0FFFA] text-lg font-bold uppercase italic leading-tight">
                        Get nightly magic delivered to your inbox.
                     </p>

                     <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md relative">
                        <input
                           required
                           type="email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           placeholder={status === 'success' ? "THANK YOU!" : "YOUR@EMAIL.COM"}
                           className={`bg-transparent border-2 p-4 rounded-xl text-[#B0FFFA] font-black italic text-xs outline-none flex-grow transition-all ${status === 'success' ? 'border-green-400 placeholder:text-green-400' : 'border-[#B0FFFA]/30 focus:border-[#00F7FF]'}`}
                           disabled={status === 'loading' || status === 'success'}
                        />
                        <button
                           type="submit"
                           disabled={status === 'loading' || status === 'success'}
                           className={`px-8 rounded-xl font-black italic text-xs transition-all flex items-center justify-center min-w-[100px] ${status === 'success' ? 'bg-green-400 text-white' : 'bg-[#B0FFFA] text-[#FF0087] hover:bg-[#00F7FF] shadow-[0_0_15px_rgba(176,255,250,0.3)]'}`}
                        >
                           {status === 'loading' ? <Loader2 className="animate-spin" size={16} /> : status === 'success' ? <Check size={16} strokeWidth={4} /> : 'JOIN'}
                        </button>
                     </form>
                  </div>

                  {/* BOTTOM: LEGAL LINKS - ROW WISE */}
                  <div className="flex flex-wrap items-center gap-x-12 gap-y-6 border-t-2 border-[#B0FFFA]/10 pt-10">
                     {[
                        { label: "PRIVACY", path: "/privacy" },
                        { label: "TERMS", path: "/terms" },
                        { label: "CONTACT", path: "/contact" }
                     ].map((link) => (
                        <Link
                           key={link.path}
                           to={link.path}
                           className="group flex items-center gap-2 text-[10px] font-black tracking-[0.3em] uppercase text-[#B0FFFA] hover:text-[#00F7FF] transition-all"
                        >
                           {link.label}
                           <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </Link>
                     ))}
                  </div>

               </div>
            </div>

            {/* 3. THE KINETIC STRIP */}
            <div className="pt-12 flex flex-col md:flex-row justify-between items-center gap-12">

               <div className="flex items-center gap-10">
                  <div className="text-[10px] font-black tracking-widest text-[#B0FFFA] opacity-50 uppercase">
                     © {currentYear} • NESTLY ECOSYSTEM
                  </div>
                  <div className="h-4 w-[2px] bg-[#B0FFFA]/20 hidden md:block" />
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-[#00F7FF] rounded-full animate-ping" />
                     <span className="text-[10px] font-black tracking-widest text-[#B0FFFA] opacity-90 uppercase">Status: 100% Safe</span>
                  </div>
               </div>

               <div className="flex items-center gap-6">
                  {[Globe, MessageCircle, Mail].map((Icon, i) => (
                     <motion.button
                        key={i}
                        whileHover={{ y: -8, color: "#00F7FF" }}
                        className="p-4 border-2 border-[#B0FFFA]/20 text-[#B0FFFA] rounded-[1rem] hover:border-[#00F7FF] transition-all"
                     >
                        <Icon size={20} />
                     </motion.button>
                  ))}
               </div>

            </div>

         </div>

         {/* DECORATIVE TOP DIVIDER SHARD */}
         <div className="absolute top-0 left-0 w-40 h-2 bg-[#B0FFFA]" />
         <div className="absolute top-0 right-0 w-20 h-2 bg-[#00F7FF]" />
      </footer>
   );
}
