import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MessageCircle, Send, ArrowLeft, Target, Disc, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { submitContactForm } from '../services/db';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await submitContactForm(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || "Failed to send message.");
    }
  };

  return (
    <div className="bg-[#B0FFFA] min-h-screen">
      
      {/* 1. HERO - THE SIGNAL HUB */}
      <section className="pt-40 pb-20 px-6 border-b-8 border-[#FF0087] bg-[#B0FFFA]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10">
          <div className="max-w-3xl">
            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.5em] text-[#FF0087] mb-12 hover:gap-6 transition-all relative z-50 pointer-events-auto">
              <ArrowLeft size={16} /> GO_BACK
            </Link>
            <h1 className="text-[15vw] md:text-[18vw] font-black italic tracking-tighter text-[#FF0087] leading-[0.7] uppercase mb-10 select-none">
              SAY <br /> <span className="text-[#00F7FF]">HELLO.</span>
            </h1>
          </div>
          <div className="pb-4 text-right hidden lg:block">
            <p className="text-xl font-black italic text-[#FF0087] uppercase leading-none opacity-40">Online 24/7</p>
          </div>
        </div>
      </section>

      {/* 2. THE CHANNELS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          
          {/* DIRECT CHANNELS */}
          <div className="lg:col-span-5 space-y-16">
            <div className="bg-[#FF0087] p-12 rounded-[4rem] text-[#B0FFFA] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00F7FF] blur-[80px] opacity-20" />
              <Mail className="mb-8 group-hover:rotate-12 transition-transform" size={48} />
              <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Email Us</h3>
              <p className="text-2xl font-bold opacity-80 uppercase italic leading-none mb-10">hello@nestly.ai</p>
              <div className="w-12 h-1 bg-[#00F7FF]" />
            </div>

            <div className="border-8 border-[#FF0087] p-12 rounded-[4rem] text-[#FF0087] group hover:bg-[#FF0087] hover:text-[#B0FFFA] transition-all duration-500">
              <MessageCircle className="mb-8" size={48} />
              <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-4">Social</h3>
              <p className="text-2xl font-bold opacity-80 uppercase italic leading-none mb-10">@nestly_magic</p>
              <div className="w-12 h-1 bg-[#FF0087] group-hover:bg-[#B0FFFA]" />
            </div>

            <div className="flex gap-4">
              <div className="p-10 bg-[#00F7FF] rounded-[3rem] flex-grow flex items-center justify-center group overflow-hidden relative">
                <Target size={64} className="text-[#FF0087] relative z-10 group-hover:scale-150 transition-transform duration-500" />
              </div>
              <div className="p-10 bg-[#FF7DB0] rounded-[3rem] flex-grow flex items-center justify-center">
                <ShieldCheck size={64} className="text-[#FF0087]" />
              </div>
            </div>
          </div>

          {/* THE MESSAGE CORE */}
          <div className="lg:col-span-7 bg-[#FF0087] rounded-[5rem] p-16 md:p-24 shadow-[0_60px_120px_rgba(255,0,135,0.25)] relative group overflow-hidden">
            <div className="absolute inset-0 bg-[#B0FFFA]/5 rounded-[5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10 h-full flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-32 h-32 bg-[#B0FFFA] text-[#FF0087] rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <CheckCircle2 size={64} strokeWidth={3} />
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-5xl font-black italic uppercase text-[#B0FFFA] tracking-tighter">MESSAGE SENT!</h2>
                    <p className="text-xl font-bold text-[#00F7FF] uppercase tracking-widest leading-none">Your magic is on its way to us.</p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B0FFFA]">Your Name</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="WHAT'S YOUR NAME?"
                        className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-6 text-4xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/20 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter"
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B0FFFA]">Your Email</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="WHERE TO REPLY?"
                        className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-6 text-4xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/20 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B0FFFA]">Your Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="HOW CAN WE HELP?"
                      className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-6 text-4xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/20 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-red-400 font-bold uppercase text-xs tracking-widest">{errorMessage}</p>
                  )}

                  <motion.button 
                    disabled={status === 'loading'}
                    whileHover={{ scale: 0.95 }}
                    whileTap={{ scale: 0.9 }}
                    type="submit"
                    className="w-full bg-[#B0FFFA] text-[#FF0087] py-10 rounded-[3rem] text-4xl font-black italic uppercase tracking-tighter flex items-center justify-center gap-6 hover:bg-[#00F7FF] transition-all group disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="animate-spin" size={48} />
                    ) : (
                      <>
                        SEND MAGIC <Send size={32} className="group-hover:translate-x-4 group-hover:-translate-y-4 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
