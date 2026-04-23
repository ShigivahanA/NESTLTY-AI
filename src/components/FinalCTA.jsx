import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { auth } from '../services/db';

export default function FinalCTA() {
   const navigate = useNavigate();
   const [user, setUser] = useState(null);
   const containerRef = useRef(null);

   useEffect(() => {
     auth.getUser().then(({ data: { user } }) => setUser(user));
     const { data: { subscription } } = auth.onAuthStateChange((_event, session) => {
       setUser(session?.user ?? null);
     });
     return () => subscription.unsubscribe();
   }, []);

   const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start end", "end start"]
   });

   const scale = useTransform(scrollYProgress, [0.3, 0.7], [0, 40]);
   const opacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1]);
   const textColor = useTransform(scrollYProgress, [0.4, 0.5], ["#FF0087", "#B0FFFA"]);

   return (
      <section ref={containerRef} className="py-20 md:py-32 bg-[#B0FFFA] relative overflow-hidden flex items-center justify-center">

         {/* THE EXPANDING NEURAL GATE */}
         <motion.div
            style={{ scale, opacity }}
            className="absolute w-40 h-40 bg-[#FF0087] rounded-full z-0"
         />

         <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
            <motion.div
               initial={{ opacity: 0, y: 50 }}
               whileInView={{ opacity: 1, y: 0 }}
               className="flex flex-col items-center"
            >

               <motion.h2
                  style={{ color: textColor }}
                  className="text-6xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase mb-16"
               >
                  CREATE <br />
                  TONIGHT'S <br />
                  STORY <br />
                  <span className="text-[#00F7FF]">IN 30s.</span>
               </motion.h2>

               <div className="flex flex-col items-center gap-10">
                  <button
                     onClick={() => navigate(user ? "/dashboard" : "/auth")}
                     className="group relative px-16 py-8 bg-[#B0FFFA] text-[#FF0087] text-3xl font-black rounded-full shadow-[0_30px_60px_rgba(255,0,135,0.4)] transition-all active:scale-95 flex items-center gap-6 overflow-hidden border-4 border-[#00F7FF] cursor-pointer"
                  >
                     <span className="relative z-10">START THE MAGIC</span>
                     <ArrowRight size={32} className="relative z-10 group-hover:translate-x-3 transition-transform" />

                     {/* Internal Shimmer */}
                     <div className="absolute inset-0 bg-[#00F7FF] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </button>

                  <motion.p
                     style={{ color: textColor }}
                     className="font-black text-xs uppercase tracking-widest italic opacity-60"
                  >
                     Join 10,000+ Dreamers
                  </motion.p>
               </div>
            </motion.div>
         </div>

      </section>
   );
}
