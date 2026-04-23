import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, BookHeart, ArrowRight, User, LogOut, LayoutDashboard, Globe, Zap, Crown } from 'lucide-react';
import { auth } from '../services/db';
import { useSubscription } from '../SubscriptionContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { subscription, plans } = useSubscription();

  useEffect(() => {
    // Initial user check
    auth.getUser().then(({ data: { user } }) => setUser(user));

    // Listen for auth changes
    const { data: { subscription: authSub } } = auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isLoggedIn = !!user;

  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -120, opacity: 0 }
  };

  const menuVariants = {
    closed: {
      clipPath: "circle(0% at calc(100% - 40px) 40px)",
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    open: {
      clipPath: "circle(150% at calc(100% - 40px) 40px)",
      transition: { type: "spring", stiffness: 20, restDelta: 2 }
    }
  };

  const linkVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: { delay: 0.1 * i, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }
    })
  };

  const currentPlan = subscription ? plans[subscription.tier] : null;

  return (
    <>
      <motion.nav
        variants={navVariants}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-[100] px-6 py-6 flex justify-between items-center pointer-events-none"
      >
        <Link to="/" className="flex items-center space-x-2 pointer-events-auto group">
          <div className="p-2 bg-[#000000] rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <BookHeart className="w-6 h-6 text-[#ffffff]" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-[#000000]">Nestly</span>
        </Link>

        <div className="flex items-center gap-4 pointer-events-auto">
          {isLoggedIn && subscription && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10"
            >
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${subscription.tier === 'elite' ? 'bg-[#FF0087] text-[#B0FFFA]' : subscription.tier === 'pro' ? 'bg-[#00F7FF] text-[#FF0087]' : 'bg-white/20'}`}>
                {subscription.tier === 'elite' ? <Crown size={14} /> : <Zap size={14} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF0087]">
                {currentPlan.name} • {subscription.stories_generated}/{currentPlan.limit === Infinity ? '∞' : currentPlan.limit}
              </span>
            </motion.div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 rounded-2xl bg-[#00F7FF] flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(0,247,255,0.4)] transition-transform active:scale-90 relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-8 h-8 text-[#FF0087] " />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                  <Menu className="w-8 h-8 text-[#FF0087]" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-[90] bg-[#FF0087] flex flex-col justify-center items-center px-6 overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00F7FF] rounded-full blur-[150px] opacity-20" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#B0FFFA] rounded-full blur-[150px] opacity-20" />

            <div className="relative z-10 w-full max-w-7xl px-6 flex flex-col items-center space-y-4 md:space-y-2">
              {!isLoggedIn ? (
                <>
                  {[
                    { name: 'Home', path: '/' },
                    { name: 'Privacy', path: '/privacy' },
                    { name: 'Terms', path: '/terms' },
                    { name: 'Contact', path: '/contact' },
                    { name: 'Join The Magic', path: '/auth' }
                  ].map((item, i) => (
                    <motion.div key={item.name} custom={i} variants={linkVariants} initial="hidden" animate="visible" className="w-full text-center">
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-[7vw] font-black text-[#B0FFFA] hover:text-[#00F7FF] transition-colors leading-[0.9] tracking-tighter uppercase italic block whitespace-nowrap md:whitespace-normal"
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </>
              ) : (
                <>
                  <div className="mb-10 text-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#00F7FF] mb-2 block">ACCOUNT</span>
                    <h3 className="text-4xl font-black italic uppercase text-[#B0FFFA]">{user.email.split('@')[0]}</h3>
                    {subscription && (
                      <div className="mt-4 flex items-center justify-center gap-4 bg-white/10 px-6 py-2 rounded-2xl border border-white/5">
                        <Zap size={16} className="text-[#00F7FF]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#B0FFFA]">{currentPlan.name} Plan</span>
                      </div>
                    )}
                  </div>

                  {[
                    { name: 'Home', path: '/' },
                    { name: 'Dashboard', path: '/dashboard' },
                    { name: 'Profile Setting', path: '/dashboard/profiles' },
                    {
                      name: 'Log Out',
                      path: '/',
                      onClick: async () => {
                        await auth.signOut();
                        setIsOpen(false);
                      }
                    }
                  ].map((item, i) => (
                    <motion.div key={item.name} custom={i} variants={linkVariants} initial="hidden" animate="visible" className="w-full">
                      <Link
                        to={item.path}
                        onClick={item.onClick || (() => setIsOpen(false))}
                        className="text-3xl sm:text-4xl md:text-6xl lg:text-[5vw] font-black text-[#B0FFFA] hover:text-[#00F7FF] transition-colors flex items-center justify-center space-x-6 tracking-tighter uppercase italic leading-none"
                      >
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                </>
              )}
            </div>

            {/* Footer in Menu */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-12 text-[#FF7DB0] font-bold tracking-widest text-xs uppercase"
            >
              Nestly © 2026 • Personalized for your little hero
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
