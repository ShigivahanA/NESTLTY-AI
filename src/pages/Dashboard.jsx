import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, User, ChevronRight, Stars, Sparkles, X, UserPlus, Heart, Smile, Loader2, Zap, Crown, BookOpen, ArrowRight, UserCircle2, Calendar, Wand2 } from 'lucide-react';
import { auth, getChildProfiles, supabase } from '../services/db';
import { useSubscription } from '../SubscriptionContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { subscription, plans } = useSubscription();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOverlay, setShowAddOverlay] = useState(false);

  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newInterests, setNewInterests] = useState('');
  const [newGender, setNewGender] = useState('male'); // Default to male (to match DB constraint)
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await auth.getUser();
      if (!user) return navigate('/auth');
      const data = await getChildProfiles();
      setProfiles(data);
      setLoading(false);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    document.body.style.overflow = showAddOverlay ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showAddOverlay]);

  const handleAddHero = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data: { user } } = await auth.getUser();
      const isDuplicate = profiles.some(p => p.name.toLowerCase() === newName.toLowerCase());
      if (isDuplicate) {
        alert("Hero already added!");
        setIsSaving(false);
        return;
      }
      const { data, error } = await supabase
        .from('child_profiles')
        .insert([{
          name: newName,
          age: parseInt(newAge),
          interests: newInterests.split(',').map(i => i.trim()),
          gender: newGender,
          user_id: user.id
        }])
        .select();
      if (error) throw error;
      setProfiles([data[0], ...profiles]);
      setNewName(''); setNewAge(''); setNewInterests(''); setNewGender('male');
      setShowAddOverlay(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const currentPlan = subscription ? plans[subscription.tier] : null;

  return (
    <div className="min-h-screen bg-[#B0FFFA] pt-32 pb-20 px-6 font-sans relative selection:bg-[#FF0087] selection:text-white">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#FF0087] rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#00F7FF] rounded-full blur-[120px] opacity-10" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* SUBSCRIPTION STATUS BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16 p-8 bg-white border-4 border-[#FF0087] rounded-[3rem] shadow-[8px_8px_0px_#FF0087]">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl ${subscription?.tier === 'free' ? 'bg-gray-400' : subscription?.tier === 'pro' ? 'bg-[#00F7FF]' : 'bg-[#FF0087]'}`}>
              {subscription?.tier === 'elite' ? <Crown size={32} /> : <Zap size={32} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] mb-1">Your Current Magic Tier</p>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#FF0087] leading-none">
                {currentPlan?.name || 'FREE'} PLAN
              </h3>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full md:w-auto">
            <div className="text-center md:text-right w-full md:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] mb-1">Usage Meter</p>
              <div className="flex items-center justify-center md:justify-end gap-3">
                 <span className="text-2xl font-black text-[#FF0087]">{subscription?.stories_generated || 0}</span>
                 <div className="w-24 h-2 bg-[#FF7DB0]/20 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${Math.min(100, ((subscription?.stories_generated || 0) / (currentPlan?.limit || 1)) * 100)}%` }}
                      className="h-full bg-[#FF0087] rounded-full" 
                    />
                 </div>
                 <span className="text-[10px] font-black text-[#FF7DB0] uppercase">/ {currentPlan?.limit === Infinity ? '∞' : currentPlan?.limit}</span>
              </div>
            </div>

            {subscription?.tier !== 'elite' && (
              <button 
                onClick={() => navigate('/dashboard/subscription')}
                className="w-full md:w-auto px-8 py-4 bg-[#FF0087] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-[1.05] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"
              >
                UPGRADE MAGIC <Stars size={16} />
              </button>
            )}
          </div>
        </div>

        <header className="mb-20 text-center px-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-6xl md:text-[8vw] font-black italic tracking-tighter text-[#FF0087] leading-[0.8] uppercase">
              WHO'S THE <br /> <span className="text-[#00F7FF]">HERO?</span>
            </h1>
          </motion.div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse bg-white border-4 border-[#FF0087]/5 rounded-[3rem] p-10 h-96 flex flex-col items-center justify-center gap-6">
                  <div className="w-32 h-32 bg-[#FF0087]/10 rounded-full" />
                  <div className="space-y-3 w-full">
                    <div className="h-10 bg-[#FF0087]/10 rounded-xl w-3/4 mx-auto" />
                    <div className="h-4 bg-[#FF0087]/5 rounded-lg w-1/2 mx-auto" />
                  </div>
                </div>
              ))}
            </>
          ) : profiles.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="sm:col-span-2 lg:col-span-3 xl:col-span-4 py-24 flex flex-col items-center text-center"
            >
              <div className="relative mb-12">
                 <Sparkles className="text-[#00F7FF] absolute -top-8 -right-8 animate-bounce" size={48} />
                 <div className="w-32 h-32 rounded-full border-4 border-dashed border-[#FF0087]/30 flex items-center justify-center">
                   <UserPlus className="text-[#FF0087]/30" size={56} />
                 </div>
              </div>
              <h2 className="text-5xl font-black italic text-[#FF0087] uppercase tracking-tighter mb-4">No Heroes Yet</h2>
              <p className="text-xs font-black tracking-[0.4em] text-[#FF7DB0] uppercase mb-12">Every story needs a hero. Add your first child below.</p>
              <button
                onClick={() => setShowAddOverlay(true)}
                className="px-12 py-6 bg-[#FF0087] text-[#B0FFFA] rounded-full text-2xl font-black italic uppercase tracking-tighter shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-6"
              >
                ADD HERO <Plus size={32} />
              </button>
            </motion.div>
          ) : (
            <>
              {profiles.map((profile, idx) => (
                <motion.button
                  key={profile.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => navigate(`/dashboard/child/${profile.id}`)}
                  className="group relative flex flex-col items-center bg-white border-4 border-[#FF0087] rounded-[3.5rem] p-10 transition-all shadow-[12px_12px_0px_#FF0087] hover:shadow-none hover:translate-x-2 hover:translate-y-2 text-center w-full min-h-[420px] overflow-hidden"
                >
                  <div className="absolute top-6 right-6 text-[#00F7FF] opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={24} className="animate-pulse" />
                  </div>

                  <div className="relative mb-10">
                    <div className="w-32 h-32 bg-[#FF0087] rounded-full flex items-center justify-center text-[#B0FFFA] shadow-2xl group-hover:bg-[#00F7FF] group-hover:text-[#FF0087] transition-all duration-500 relative z-10">
                      <User size={64} strokeWidth={2.5} />
                    </div>
                    <div className="absolute inset-[-10px] border-4 border-dashed border-[#FF0087]/20 rounded-full group-hover:rotate-180 transition-all duration-[2000ms]" />
                  </div>

                  <div className="flex-grow space-y-3">
                    <h3 className="text-2xl md:text-3xl font-black text-[#FF0087] uppercase tracking-tighter leading-tight break-words">
                      {profile.name}
                    </h3>
                    <div className="flex items-center justify-center gap-2">
                      <div className="px-4 py-1.5 bg-[#FF7DB0]/10 rounded-full">
                         <span className="text-xs font-black uppercase tracking-widest text-[#FF7DB0]">AGE {profile.age}</span>
                      </div>
                      <div className="px-4 py-1.5 bg-[#00F7FF]/10 rounded-full">
                         <span className="text-xs font-black uppercase tracking-widest text-[#00F7FF]">{profile.gender === 'male' ? 'BOY' : profile.gender === 'female' ? 'GIRL' : 'HERO'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap justify-center gap-2">
                    {profile.interests?.slice(0, 3).map((interest, i) => (
                      <span key={i} className="text-[8px] font-black uppercase tracking-widest text-[#FF0087]/40">
                        • {interest}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 w-full pt-8 border-t-2 border-[#FF0087]/5">
                    <div className="flex items-center justify-center gap-3 text-[#FF0087] group-hover:text-[#00F7FF] transition-colors">
                      <span className="text-sm font-black uppercase italic tracking-widest">START STORY</span>
                      <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </motion.button>
              ))}

              <button
                onClick={() => setShowAddOverlay(true)}
                className="flex flex-col items-center justify-center gap-6 p-10 border-4 border-dashed border-[#FF0087]/20 rounded-[3.5rem] bg-white/40 hover:bg-white hover:border-[#FF0087] transition-all group min-h-[420px]"
              >
                <div className="w-24 h-24 rounded-full border-4 border-current flex items-center justify-center group-hover:scale-110 group-hover:rotate-90 transition-all">
                  <Plus size={48} strokeWidth={3} />
                </div>
                <div className="text-center">
                  <span className="block text-3xl font-black italic uppercase tracking-tighter text-[#FF0087]">ADD HERO</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF7DB0]">NEW ADVENTURE</span>
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 🚀 ADD HERO FULL-PAGE OVERLAY */}
      <AnimatePresence>
        {showAddOverlay && (
          <motion.div
            initial={{ y: '-100%' }} 
            animate={{ y: 0 }} 
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[500] bg-[#FF0087] flex flex-col items-center justify-center py-24 px-6 md:px-20 overflow-hidden"
          >
            {/* Background Magic */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#00F7FF] rounded-full blur-[150px] opacity-20" />
               <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#B0FFFA] rounded-full blur-[150px] opacity-10" />
            </div>

            <div className="w-full max-w-2xl relative z-10 py-12">
              <header className="mb-12 text-center md:text-left">
                <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-[#B0FFFA] leading-[0.8]">
                  SUMMON <br /> <span className="text-[#00F7FF]">A HERO.</span>
                </h2>
              </header>

              <form onSubmit={handleAddHero} className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#B0FFFA]/60 ml-4 flex items-center gap-2">
                    <UserCircle2 size={12} /> NAME
                  </label>
                  <input
                    required autoFocus
                    value={newName} onChange={e => setNewName(e.target.value)}
                    className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-3 md:py-4 text-3xl md:text-5xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/10 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter"
                    placeholder="ENTER NAME"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-1 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#B0FFFA]/60 ml-4 flex items-center gap-2">
                      <Calendar size={12} /> AGE
                    </label>
                    <input
                      required type="number"
                      value={newAge} onChange={e => setNewAge(e.target.value)}
                      className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-3 md:py-4 text-3xl md:text-5xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/10 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter"
                      placeholder="0"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#B0FFFA]/60 ml-4 flex items-center gap-2">
                      <Wand2 size={12} /> INTERESTS
                    </label>
                    <input
                      required
                      value={newInterests} onChange={e => setNewInterests(e.target.value)}
                      className="w-full bg-transparent border-b-4 border-[#B0FFFA]/20 py-3 md:py-4 text-3xl md:text-5xl font-black italic text-[#B0FFFA] placeholder:text-[#B0FFFA]/10 focus:border-[#00F7FF] outline-none transition-all uppercase tracking-tighter"
                      placeholder="SPACE, MAGIC..."
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#B0FFFA]/60 ml-4">GENDER</label>
                  <div className="flex gap-4">
                    {[
                      { label: 'Boy', value: 'male' },
                      { label: 'Girl', value: 'female' }
                    ].map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setNewGender(g.value)}
                        className={`flex-1 py-6 rounded-3xl text-2xl font-black italic uppercase tracking-tighter transition-all border-4 ${
                          newGender === g.value 
                          ? 'bg-[#00F7FF] text-[#FF0087] border-[#00F7FF]' 
                          : 'bg-transparent text-[#B0FFFA] border-[#B0FFFA]/20'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-12 flex flex-col md:flex-row gap-6">
                  <button
                    disabled={isSaving}
                    type="submit"
                    className="flex-[2] py-6 bg-[#B0FFFA] text-[#FF0087] rounded-[2rem] text-2xl font-black italic uppercase tracking-tighter shadow-2xl hover:bg-[#00F7FF] hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-6 group disabled:opacity-50"
                  >
                    {isSaving ? 'SUMMONING...' : 'ADD HERO'}
                    <Heart fill="currentColor" size={24} className="group-hover:scale-125 transition-transform" />
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowAddOverlay(false)}
                    className="flex-1 py-6 border-4 border-[#B0FFFA] text-[#B0FFFA] rounded-[2rem] text-lg font-black italic uppercase tracking-widest hover:bg-[#B0FFFA] hover:text-[#FF0087] transition-all"
                  >
                    BACK
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
