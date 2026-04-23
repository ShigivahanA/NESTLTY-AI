import { motion } from 'framer-motion';
import { Stars } from 'lucide-react';

export default function Loader({ message = "PREPARING MAGIC..." }) {
  // Split message into parts to colorize parts of it
  const words = message.split(' ');
  
  return (
    <div className="min-h-screen bg-[#B0FFFA] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border-[100px] border-[#FF0087]/5 rounded-full border-dashed" 
        />
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#FF0087] rounded-full blur-[200px] opacity-10" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#00F7FF] rounded-full blur-[200px] opacity-10" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-32 h-32 md:w-48 md:h-48 mb-8 md:mb-12">
          {/* Rotating Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-8 border-[#FF0087] border-dashed rounded-full" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 border-8 border-[#00F7FF] border-dotted rounded-full" 
          />
          
          {/* Central Icon */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 flex items-center justify-center text-[#FF0087]"
          >
            <Stars size={60} className="md:w-20 md:h-20" />
          </motion.div>
        </div>

        <h2 className="text-4xl md:text-7xl font-black italic text-[#FF0087] uppercase tracking-tighter text-center leading-[0.9]">
          {words.map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-[#00F7FF]" : ""}>
              {word}{' '}
              {i === 1 && <br />}
            </span>
          ))}
        </h2>
        
        {/* Animated Dots */}
        <div className="flex gap-3 justify-center mt-10">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                delay: i * 0.2, 
                repeat: Infinity, 
                duration: 1.5,
                ease: "easeInOut"
              }}
              className="w-4 h-4 bg-[#FF7DB0] rounded-full shadow-[0_0_15px_rgba(255,125,176,0.5)]" 
            />
          ))}
        </div>

        {/* Subtle Text */}
        <motion.p 
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] text-[#FF0087]"
        >
          Connecting to Cosmic Servers
        </motion.p>
      </motion.div>
    </div>
  );
}
