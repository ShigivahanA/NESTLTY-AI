import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import NeueAufnahme3 from "../assests/sample.m4a";


export default function AudioDemo() {
   const [isPlaying, setIsPlaying] = useState(false);
   const [progress, setProgress] = useState(0);
   const [currentTime, setCurrentTime] = useState('0:00');
   const [duration, setDuration] = useState('0:00');

   const audioRef = useRef(null);

   useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const updateProgress = () => {
         const current = audio.currentTime;
         const total = audio.duration;
         if (!isNaN(total)) {
            setProgress((current / total) * 100);
            setCurrentTime(formatTime(current));
            setDuration(formatTime(total));
         }
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('loadedmetadata', updateProgress);
      return () => {
         audio.removeEventListener('timeupdate', updateProgress);
         audio.removeEventListener('loadedmetadata', updateProgress);
      };
   }, []);

   const formatTime = (time) => {
      const min = Math.floor(time / 60);
      const sec = Math.floor(time % 60);
      return `${min}:${sec < 10 ? '0' : ''}${sec}`;
   };

   const togglePlay = () => {
      if (isPlaying) {
         audioRef.current.pause();
      } else {
         audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
   };

   return (
      <section className="py-20 px-6 bg-[#B0FFFA] relative overflow-hidden mt-[8rem] mb-[8rem]">
         <audio
            ref={audioRef}
            src={NeueAufnahme3}
            onEnded={() => setIsPlaying(false)}
         />

         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

            {/* Left: Text Content - Tighter */}
            <div className="flex-1 text-center lg:text-left z-10">
               <div className="inline-flex items-center gap-4 text-[#00F7FF] font-black tracking-[0.5em] text-[10px] uppercase mb-6 italic">
                  <div className="h-px w-8 bg-[#00F7FF]" />
                  Audio Proof
               </div>
               <h2 className="text-5xl md:text-7xl font-black text-[#FF0087] tracking-tighter leading-none italic uppercase mb-8">
                  THE <span className="text-[#00F7FF]">VOICE</span> <br /> OF DREAMS.
               </h2>
               <p className="text-lg md:text-xl font-bold text-[#FF7DB0] leading-tight mb-10 max-w-lg">
                  Soft, cinematic, and infinitely comforting. One tap to hear how your child's night begins.
               </p>

               <div className="flex items-center justify-center lg:justify-start gap-10 opacity-60">
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-[#FF0087]">HQ</span>
                     <span className="text-[8px] font-black tracking-widest uppercase">Lossless</span>
                  </div>
                  <div className="flex flex-col">
                     <span className="text-3xl font-black text-[#00F7FF]">3D</span>
                     <span className="text-[8px] font-black tracking-widest uppercase">Atmos</span>
                  </div>
               </div>
            </div>

            {/* Right: The High-End Compact Player */}
            <div className="flex-1 relative w-full max-w-lg">
               <motion.div
                  whileHover={{ y: -5, rotateY: 5 }}
                  className="bg-[#FF0087] p-8 md:p-10 rounded-[4rem] shadow-2xl border-4 border-[#FF7DB0] relative overflow-hidden"
               >
                  {/* Header */}
                  <div className="flex justify-between items-center mb-8 relative z-10">
                     <div className="flex items-center gap-2">
                        <Volume2 size={18} className="text-[#B0FFFA]" />
                        <span className="text-[10px] font-black text-[#B0FFFA] uppercase tracking-widest">Audio</span>
                     </div>
                  </div>

                  {/* Visualizer - Smooth Sine Wave Pattern */}
                  <div className="relative h-48 w-full rounded-[2.5rem] bg-[#B0FFFA]/5 border-2 border-[#B0FFFA]/10 mb-8 flex items-center justify-center overflow-hidden">
                     <div className="flex items-center gap-1.5 px-8 h-full">
                        {[...Array(20)].map((_, i) => (
                           <motion.div
                              key={i}
                              animate={{
                                 height: isPlaying ? [20, 80, 40, 60, 20] : 10,
                                 opacity: isPlaying ? 1 : 0.2
                              }}
                              transition={{
                                 duration: 2,
                                 repeat: Infinity,
                                 ease: "easeInOut",
                                 delay: i * 0.1
                              }}
                              className="w-2.5 bg-[#00F7FF] rounded-full"
                           />
                        ))}
                     </div>

                     {/* Floating Glow */}
                     <motion.div
                        animate={{ opacity: isPlaying ? [0.1, 0.3, 0.1] : 0 }}
                        className="absolute inset-0 bg-[#00F7FF] blur-3xl pointer-events-none"
                     />
                  </div>

                  {/* Track Info */}
                  <div className="flex items-center justify-between mb-8 relative z-10">
                     <div>
                        <h4 className="text-2xl font-black text-[#B0FFFA] italic uppercase tracking-tighter">Midnight Forest</h4>
                        <span className="text-[10px] font-black text-[#00F7FF] uppercase tracking-widest">Procedural Narrator</span>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-black text-[#B0FFFA] opacity-40 uppercase mb-1">Time Remaining</div>
                        <div className="text-sm font-black text-[#B0FFFA]">{duration}</div>
                     </div>
                  </div>

                  {/* Controls - Symmetrical Grid */}
                  <div className="grid grid-cols-3 items-center mb-8 relative z-10">
                     <div className="flex justify-end">
                        <button className="text-[#B0FFFA] hover:text-[#00F7FF] transition-colors">
                           <SkipBack size={24} />
                        </button>
                     </div>

                     <div className="flex justify-center">
                        <motion.button
                           whileHover={{ scale: 1.1 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={togglePlay}
                           className="w-20 h-20 bg-[#B0FFFA] rounded-full flex items-center justify-center text-[#FF0087] shadow-xl"
                        >
                           {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                        </motion.button>
                     </div>

                     <div className="flex justify-start">
                        <button className="text-[#B0FFFA] hover:text-[#00F7FF] transition-colors">
                           <SkipForward size={24} />
                        </button>
                     </div>
                  </div>

                  {/* Progress & Real Timeline */}
                  <div className="relative z-10">
                     <div className="flex justify-between text-[8px] font-black text-[#B0FFFA] opacity-60 uppercase mb-3 px-1">
                        <span>{currentTime}</span>
                        <div className="flex items-center gap-1">
                           <Clock size={8} />
                           <span>Live Playback</span>
                        </div>
                     </div>
                     <div className="relative h-2 bg-[#B0FFFA]/20 rounded-full cursor-pointer group">
                        <motion.div
                           animate={{ width: `${progress}%` }}
                           className="absolute inset-0 bg-[#00F7FF] shadow-[0_0_15px_#00F7FF] rounded-full"
                        />
                        <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#B0FFFA] rounded-full border-2 border-[#00F7FF] opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `${progress}%`, marginLeft: '-8px' }} />
                     </div>
                  </div>
               </motion.div>
            </div>

         </div>
      </section>
   );
}
