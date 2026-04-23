import { motion } from 'framer-motion';
import { Shield, Lock, Eye, ArrowLeft, Fingerprint, Database, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Privacy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="bg-[#B0FFFA] min-h-screen">
      
      {/* 1. HERO SHARD */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden border-b-8 border-[#FF0087]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00F7FF] blur-[150px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF0087] blur-[150px] opacity-10" />
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#FF0087] mb-12 hover:gap-6 transition-all border-b-2 border-[#FF0087] pb-2 relative z-50 pointer-events-auto">
            <ArrowLeft size={16} /> GO_BACK
          </Link>
          
          <motion.h1 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[15vw] md:text-[18vw] font-black italic tracking-tighter text-[#FF0087] leading-[0.7] uppercase mb-10 select-none"
          >
            STAY.<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px #FF0087' }}>SAFE.</span>
          </motion.h1>

          <div className="flex justify-center gap-4">
             <div className="px-6 py-2 bg-[#FF0087] text-[#B0FFFA] text-[10px] font-black uppercase tracking-widest rounded-full italic">Safe Mode: On</div>
             <div className="px-6 py-2 border-2 border-[#FF0087] text-[#FF0087] text-[10px] font-black uppercase tracking-widest rounded-full italic">Ver. 1.0</div>
          </div>
        </div>
      </section>

      {/* 2. THE CORE PROTOCOLS */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          
          {/* CARD 1 */}
          <motion.div variants={itemVariants} className="bg-[#FF0087] p-12 rounded-[3.5rem] group hover:-translate-y-4 transition-transform duration-500">
            <Fingerprint className="text-[#00F7FF] mb-8" size={64} />
            <h3 className="text-3xl font-black italic text-[#B0FFFA] uppercase mb-6 leading-none">No <br /> Tracking</h3>
            <p className="text-[#B0FFFA] font-bold opacity-80 uppercase italic text-sm leading-relaxed">
              We never track your face, your location, or your data. Nestly is built for kids, so your privacy comes first—always.
            </p>
          </motion.div>

          {/* CARD 2 */}
          <motion.div variants={itemVariants} className="bg-[#B0FFFA] border-8 border-[#FF0087] p-12 rounded-[3.5rem] shadow-[20px_20px_0px_#FF0087] group hover:shadow-none hover:translate-x-4 hover:translate-y-4 transition-all duration-500">
            <Database className="text-[#FF0087] mb-8" size={64} />
            <h3 className="text-3xl font-black italic text-[#FF0087] uppercase mb-6 leading-none">Your <br /> Words</h3>
            <p className="text-[#FF0087] font-bold opacity-80 uppercase italic text-sm leading-relaxed">
              Every story you create belongs to you. We don't sell your data, and we don't share your secrets. Your stories are safe here.
            </p>
          </motion.div>

          {/* CARD 3 */}
          <motion.div variants={itemVariants} className="bg-[#00F7FF] p-12 rounded-[3.5rem] group hover:-translate-y-4 transition-all duration-500">
            <Globe className="text-[#FF0087] mb-8" size={64} />
            <h3 className="text-3xl font-black italic text-[#FF0087] uppercase mb-6 leading-none">Fully <br /> Secure</h3>
            <p className="text-[#FF0087] font-black opacity-90 uppercase italic text-sm leading-relaxed">
              We follow the world's strictest safety rules for children. You can trust us to keep your family's dreams private.
            </p>
          </motion.div>

        </motion.div>
      </section>

      {/* 3. THE DATA SHUTTER */}
      <section className="bg-[#FF0087] py-32 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-grow">
            <h2 className="text-[8vw] font-black italic text-[#B0FFFA] uppercase leading-[0.8] mb-10 tracking-tighter">
              YOU ARE <br /> IN CONTROL.
            </h2>
            <p className="text-2xl font-bold text-[#B0FFFA] italic uppercase leading-tight mb-10 opacity-90">
              We only save what you want us to. You can delete everything with one simple click.
            </p>
            <div className="space-y-4">
              {[
                { label: "Take Your Data", code: "EXPORT" },
                { label: "Delete Everything", code: "ERASE" },
                { label: "Stop All Tracking", code: "STOP" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-4 border-b-2 border-[#B0FFFA]/20">
                  <span className="text-[#B0FFFA] font-black italic uppercase tracking-widest">{item.label}</span>
                  <span className="bg-[#B0FFFA] text-[#FF0087] px-3 py-1 rounded-lg text-[10px] font-black">{item.code}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-96 h-96 bg-[#B0FFFA] rounded-full flex items-center justify-center relative overflow-hidden group">
            <Eye className="text-[#FF0087] relative z-20 group-hover:scale-150 transition-transform duration-700" size={120} />
            <div className="absolute inset-0 bg-[#00F7FF] opacity-0 group-hover:opacity-20 transition-opacity" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
