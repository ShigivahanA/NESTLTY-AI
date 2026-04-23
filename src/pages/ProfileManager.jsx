import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, Edit3, Heart, X, Shield, Mail, Zap, Crown, Settings2, Sparkles, AlertCircle, Lock, Key, Check } from 'lucide-react';
import { auth, getChildProfiles, supabase } from '../services/db';
import { useSubscription } from '../SubscriptionContext';
import Loader from '../components/Loader';

export default function ProfileManager() {
  const navigate = useNavigate();
  const { subscription, plans } = useSubscription();
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);
  const [deletingProfile, setDeletingProfile] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [error, setError] = useState(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editInterests, setEditInterests] = useState('');
  const [editGender, setEditGender] = useState('male');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  // Disable scroll when modal is open
  useEffect(() => {
    if (editingProfile || deletingProfile || showPasswordModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [editingProfile, deletingProfile, showPasswordModal]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: { user: userData } } = await auth.getUser();
      if (!userData) return navigate('/auth');
      setUser(userData);

      const data = await getChildProfiles();
      setProfiles(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Could not load settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (profile) => {
    setEditingProfile(profile);
    setEditName(profile.name);
    setEditAge(profile.age);
    setEditInterests(profile.interests?.join(', ') || '');
    setEditGender(profile.gender || 'male');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('child_profiles')
        .update({
          name: editName,
          age: parseInt(editAge),
          interests: editInterests.split(',').map(i => i.trim()),
          gender: editGender
        })
        .eq('id', editingProfile.id);

      if (error) throw error;

      setProfiles(profiles.map(p => p.id === editingProfile.id 
        ? { ...p, name: editName, age: editAge, interests: editInterests.split(',').map(i => i.trim()), gender: editGender } 
        : p
      ));
      setEditingProfile(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProfile) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('child_profiles').delete().eq('id', deletingProfile.id);
      if (error) throw error;
      setProfiles(profiles.filter(p => p.id !== deletingProfile.id));
      setDeletingProfile(null);
    } catch (err) {
      alert('Failed to delete profile.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(false);
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (loading) return <Loader message="LOADING..." />;

  const currentPlan = subscription ? plans[subscription.tier] : null;

  return (
    <div className="min-h-screen bg-[#B0FFFA] pt-32 pb-20 px-6 font-sans relative overflow-x-hidden">
      
      {/* 🔮 BACKGROUND DECOR */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[50%] h-[50%] bg-[#FF0087] rounded-full blur-[150px] opacity-10" />
        <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#00F7FF] rounded-full blur-[150px] opacity-10" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-4 text-[#FF0087] font-black uppercase tracking-[0.5em] text-[10px] mb-16 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> BACK TO HOME
        </button>

        <header className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter text-[#FF0087] uppercase leading-[0.8]">
              SETTINGS<span className="text-[#00F7FF]">.</span>
            </h1>
            <p className="text-xl font-black text-[#FF7DB0] uppercase italic tracking-widest mt-6">Your Account</p>
          </div>
          
          {/* ACCOUNT STATUS CARD */}
          <div className="bg-white border-4 border-[#FF0087] p-8 rounded-[2.5rem] shadow-[10px_10px_0px_#FF0087] flex items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${subscription?.tier === 'elite' ? 'bg-[#FF0087]' : 'bg-[#00F7FF]'}`}>
              {subscription?.tier === 'elite' ? <Crown size={32} /> : <Zap size={32} />}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0]">YOUR PLAN</p>
              <h3 className="text-2xl font-black italic uppercase text-[#FF0087] leading-none">{currentPlan?.name}</h3>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* 📧 ACCOUNT SETTINGS SECTION */}
          <section className="lg:col-span-4 space-y-12">
             <div className="flex items-center gap-4 text-[#FF0087]">
               <Settings2 size={24} />
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">ACCOUNT</h2>
             </div>

             <div className="space-y-6">
                <div className="bg-white/40 border-4 border-[#FF0087]/10 p-8 rounded-[3rem] space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] flex items-center gap-2">
                     <Mail size={12} /> EMAIL
                   </label>
                   <p className="text-xl font-black italic text-[#FF0087] truncate">{user?.email}</p>
                </div>

                <div className="bg-white/40 border-4 border-[#FF0087]/10 p-8 rounded-[3rem] space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] flex items-center gap-2">
                     <Shield size={12} /> PASSWORD
                   </label>
                   <p className="text-xl font-black italic text-[#FF0087]">PROTECTED</p>
                   <button 
                     onClick={() => setShowPasswordModal(true)}
                     className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF] hover:underline mt-2"
                   >
                     CHANGE ❯
                   </button>
                </div>

                <button 
                  onClick={() => navigate('/dashboard/subscription')}
                  className="w-full py-8 bg-[#00F7FF] text-[#FF0087] border-4 border-[#FF0087] rounded-[3rem] text-2xl font-black italic uppercase tracking-tighter shadow-[8px_8px_0px_#FF0087] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                   UPGRADE PLAN
                </button>
             </div>
          </section>

          {/* 🦸 HERO MANAGEMENT SECTION */}
          <section className="lg:col-span-8 space-y-12">
             <div className="flex items-center gap-4 text-[#FF0087]">
               <Sparkles size={24} />
               <h2 className="text-3xl font-black italic uppercase tracking-tighter">CHILDREN</h2>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {profiles.map(p => (
                    <motion.div 
                       key={p.id}
                       layout
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="bg-white border-4 border-[#FF0087]/10 p-8 rounded-[3rem] group hover:border-[#FF0087] transition-all relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-[#FF0087]/5 rounded-2xl flex items-center justify-center text-[#FF0087]">
                          <Heart size={24} fill="currentColor" />
                        </div>
                        <div className="flex gap-2">
                           <button 
                             onClick={() => handleEditClick(p)}
                             className="w-10 h-10 rounded-xl bg-[#00F7FF]/10 text-[#00F7FF] flex items-center justify-center hover:bg-[#00F7FF] hover:text-white transition-all"
                           >
                             <Edit3 size={18} />
                           </button>
                           <button 
                             onClick={() => setDeletingProfile(p)}
                             className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                           >
                             <Trash2 size={18} />
                           </button>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black italic text-[#FF0087] uppercase tracking-tighter leading-none mb-2">{p.name}</h3>
                      <div className="flex items-center gap-2 mb-6">
                        <p className="text-[10px] font-black text-[#FF7DB0] uppercase tracking-widest italic">AGE {p.age}</p>
                        <div className="w-1 h-1 bg-[#FF7DB0]/30 rounded-full" />
                        <p className="text-[10px] font-black text-[#00F7FF] uppercase tracking-widest italic">
                          {p.gender === 'male' ? 'BOY' : p.gender === 'female' ? 'GIRL' : 'HERO'}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                         {p.interests?.map((interest, i) => (
                           <span key={i} className="px-3 py-1 bg-white border border-[#FF0087]/20 rounded-full text-[8px] font-black uppercase tracking-widest text-[#FF0087]">
                             {interest}
                           </span>
                         ))}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {profiles.length === 0 && (
                   <div className="md:col-span-2 py-20 text-center border-4 border-dashed border-[#FF0087]/10 rounded-[4rem] bg-white/30">
                      <p className="text-[#FF7DB0] font-black uppercase tracking-widest text-xs">No children found</p>
                      <button onClick={() => navigate('/dashboard')} className="text-[#FF0087] font-black uppercase tracking-widest text-[10px] mt-4 hover:underline">Add one home ❯</button>
                   </div>
                )}
             </div>
          </section>
        </div>
      </div>

      {/* ✏️ EDIT PROFILE MODAL */}
      <AnimatePresence>
        {editingProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingProfile(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xl rounded-[4rem] p-12 border-8 border-[#FF0087] relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setEditingProfile(null)}
                className="absolute top-10 right-10 text-[#FF0087]/20 hover:text-[#FF0087] transition-colors"
              >
                <X size={32} />
              </button>

              <div className="flex items-center gap-4 mb-10 text-[#FF0087]">
                <Edit3 size={32} />
                <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">EDIT <br /> PROFILE.</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">NAME</label>
                  <input 
                    required 
                    value={editName} 
                    onChange={e => setEditName(e.target.value)} 
                    className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl px-8 py-6 text-2xl font-black italic text-[#FF0087] focus:border-[#FF0087] outline-none transition-all uppercase" 
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">AGE</label>
                    <input 
                      required type="number" 
                      value={editAge} 
                      onChange={e => setEditAge(e.target.value)} 
                      className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl px-8 py-6 text-2xl font-black italic text-[#FF0087] focus:border-[#FF0087] outline-none transition-all" 
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">LIKES</label>
                    <input 
                      required 
                      value={editInterests} 
                      onChange={e => setEditInterests(e.target.value)} 
                      className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl px-8 py-6 text-2xl font-black italic text-[#FF0087] focus:border-[#FF0087] outline-none transition-all uppercase" 
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">GENDER</label>
                  <div className="flex gap-4">
                    {[
                      { label: 'Boy', value: 'male' },
                      { label: 'Girl', value: 'female' }
                    ].map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setEditGender(g.value)}
                        className={`flex-1 py-5 rounded-2xl text-xl font-black italic uppercase tracking-tighter transition-all border-4 ${
                          editGender === g.value 
                          ? 'bg-[#FF0087] text-white border-[#FF0087]' 
                          : 'bg-transparent text-[#FF0087]/30 border-[#FF0087]/10'
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={isSaving}
                  type="submit" 
                  className="w-full py-8 bg-[#FF0087] text-white font-black rounded-3xl text-3xl italic uppercase tracking-tighter hover:bg-[#00F7FF] hover:text-[#FF0087] transition-all shadow-xl disabled:opacity-50"
                >
                  {isSaving ? 'UPDATING...' : 'SAVE'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deletingProfile && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingProfile(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-10 border-8 border-[#FF0087] relative z-10 shadow-2xl text-center"
            >
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trash2 size={40} />
              </div>
              
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#FF0087] leading-none mb-4">REMOVE <br /> {deletingProfile.name}?</h3>
              <p className="text-xs font-black uppercase tracking-widest text-[#FF7DB0] mb-8 leading-relaxed">This action cannot be undone. All magic associated with this profile will be lost.</p>

              <div className="flex flex-col gap-4">
                <button 
                  disabled={isDeleting}
                  onClick={handleDelete}
                  className="w-full py-6 bg-red-500 text-white font-black rounded-2xl text-xl italic uppercase tracking-tighter hover:bg-red-600 transition-all shadow-lg disabled:opacity-50"
                >
                  {isDeleting ? 'REMOVING...' : 'YES, REMOVE'}
                </button>
                <button 
                  onClick={() => setDeletingProfile(null)}
                  className="w-full py-6 bg-white text-[#FF7DB0] border-4 border-[#FF0087]/10 font-black rounded-2xl text-xl italic uppercase tracking-tighter hover:bg-[#FF0087]/5 transition-all"
                >
                  NO, KEEP THEM
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔑 CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !isUpdatingPassword && setShowPasswordModal(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            
            <motion.div 
              initial={{ y: 50, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-[3rem] p-12 border-8 border-[#00F7FF] relative z-10 shadow-2xl"
            >
              <button 
                onClick={() => setShowPasswordModal(false)}
                className="absolute top-10 right-10 text-[#FF0087]/20 hover:text-[#FF0087] transition-colors"
              >
                <X size={32} />
              </button>

              <div className="flex items-center gap-4 mb-10 text-[#FF0087]">
                <Key size={32} className="text-[#00F7FF]" />
                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">NEW <br /> PASSWORD.</h2>
              </div>

              {passwordSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <Check size={40} strokeWidth={4} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-[#FF0087] tracking-tighter">PASSWORD UPDATED!</h3>
                </motion.div>
              ) : (
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">NEW PASSWORD</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7DB0]" />
                      <input 
                        required type="password"
                        value={newPassword} 
                        onChange={e => setNewPassword(e.target.value)} 
                        className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl pl-14 pr-8 py-5 text-xl font-black italic text-[#FF0087] focus:border-[#00F7FF] outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#FF7DB0] ml-4">CONFIRM PASSWORD</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#FF7DB0]" />
                      <input 
                        required type="password"
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        className="w-full bg-[#B0FFFA]/10 border-4 border-[#FF0087]/10 rounded-3xl pl-14 pr-8 py-5 text-xl font-black italic text-[#FF0087] focus:border-[#00F7FF] outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <button 
                    disabled={isUpdatingPassword}
                    type="submit" 
                    className="w-full py-6 bg-[#00F7FF] text-[#FF0087] font-black rounded-2xl text-2xl italic uppercase tracking-tighter hover:bg-[#FF0087] hover:text-white transition-all shadow-xl disabled:opacity-50 mt-4"
                  >
                    {isUpdatingPassword ? 'UPDATING...' : 'UPDATE PASSWORD'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
