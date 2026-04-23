import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Stars, ArrowRight, ChevronLeft, AlertCircle, Zap, Shield, MessageSquarePlus } from 'lucide-react';
import { getChildById, createStory, createDailyInput } from '../services/db';
import { generateStory } from '../services/aiService';
import Loader from '../components/Loader';
import { useSubscription } from '../SubscriptionContext';
import PricingModal from '../components/PricingModal';

export default function StoryGenerator() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const childId = searchParams.get('childId');
  const { isLimitReached, useGeneration, subscription } = useSubscription();

  const [child, setChild] = useState(null);
  const [activity, setActivity] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [mood, setMood] = useState('Happy');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    if (!childId) return navigate('/dashboard');
    fetchChild();
  }, [childId]);

  const fetchChild = async () => {
    try {
      const data = await getChildById(childId);
      setChild(data);
    } catch (err) {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    
    // 🛡️ CHECK SUBSCRIPTION LIMIT
    if (isLimitReached()) {
      setShowUpgrade(true);
      return;
    }

    setGenerating(true);
    try {
      // 1. Generate Story via AI
      // Combining activity and special notes for the AI prompt
      const combinedPrompt = `${activity} ${specialNotes ? `\nSpecial Request: ${specialNotes}` : ''}`;
      const storyText = await generateStory(child, { activity: combinedPrompt, mood });

      // 2. Save to DB
      const dailyInput = await createDailyInput({
        child_id: childId,
        activities: activity,
        mood,
        notes: specialNotes || `Generated on ${new Date().toLocaleDateString()}`
      });

      const story = await createStory({
        child_id: childId,
        daily_input_id: dailyInput.id,
        title: `${child.name}'s ${mood} Adventure`,
        story_text: storyText,
        audio_url: null
      });

      // 3. Increment usage ONLY after successful generation and save
      const canProceed = await useGeneration();
      if (!canProceed) {
         // This is a safety check in case they hit the limit during the process
         // but since we checked at start, this is rare.
         setShowUpgrade(true);
         return;
      }

      navigate(`/dashboard/player/${story.id}`);
    } catch (err) {
      console.error(err);
      alert("Magic failed this time. Let's try again!");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <Loader message="PREPARING THE INK..." />;
  if (generating) return <Loader message="WEAVING THE MAGIC TALE..." />;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20 px-6 relative overflow-hidden selection:bg-[#00F7FF] selection:text-black">
      
      {/* 🔮 NEURAL BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-[#FF0087] rounded-full blur-[150px] opacity-10 animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#00F7FF] rounded-full blur-[150px] opacity-5 animate-pulse" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        
        <button 
          onClick={() => navigate(`/dashboard/child/${childId}`)}
          className="flex items-center gap-2 text-white/40 hover:text-[#00F7FF] transition-colors uppercase font-black text-[10px] tracking-widest mb-12"
        >
          <ChevronLeft size={14} /> BACK TO DASHBOARD
        </button>

        <header className="mb-20">
          <div className="flex items-center gap-3 text-[#00F7FF] mb-4">
            <Stars size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">AI STORY GENERATOR</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none uppercase">
            UNLEASH <br /> <span className="text-[#00F7FF]">NEW MAGIC.</span>
          </h1>
        </header>

        {isLimitReached() && (
          <div className="mb-12 p-8 bg-[#FF0087]/10 border-2 border-[#FF0087] rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-[#FF0087] rounded-2xl flex items-center justify-center text-white shadow-lg">
                <AlertCircle size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black italic uppercase text-white">Daily Limit Reached!</h4>
                <p className="text-[10px] font-bold uppercase text-[#FF7DB0] tracking-widest">Upgrade to Pro for 50 stories/day</p>
              </div>
            </div>
            <button 
              onClick={() => setShowUpgrade(true)}
              className="px-8 py-4 bg-white text-[#FF0087] rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all"
            >
              UPGRADE NOW
            </button>
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-16">
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF] ml-4">WHAT HAPPENED TODAY?</label>
            <textarea
              required
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="w-full bg-white/5 border-4 border-white/10 rounded-[3rem] p-10 text-xl font-bold text-white placeholder:text-white/10 focus:border-[#00F7FF] outline-none transition-all resize-none min-h-[250px]"
              placeholder="e.g., Visited the zoo and saw a blue elephant..."
            />
          </div>

          <div className="space-y-6">
             <label className="text-[10px] font-black uppercase tracking-widest text-[#FF0087] ml-4 flex items-center gap-2">
               <MessageSquarePlus size={14} /> ANY SPECIAL NOTES? (OPTIONAL)
             </label>
             <textarea
               value={specialNotes}
               onChange={(e) => setSpecialNotes(e.target.value)}
               className="w-full bg-white/5 border-4 border-white/10 rounded-[2.5rem] p-8 text-lg font-bold text-white placeholder:text-white/5 focus:border-[#FF0087] outline-none transition-all resize-none min-h-[150px]"
               placeholder="e.g., Make it about space, or include a talking rabbit..."
             />
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF] ml-4">CHOOSE THE MOOD</label>
              <div className="flex flex-wrap gap-4">
                {['Happy', 'Exciting', 'Calm', 'Funny', 'Magic'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${mood === m ? 'bg-[#00F7FF] text-black shadow-[0_0_20px_rgba(0,247,255,0.3)]' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-end">
              <button
                disabled={generating}
                type="submit"
                className="w-full py-10 bg-[#FF0087] text-white rounded-[3rem] text-3xl font-black italic uppercase tracking-tighter shadow-[0_0_50px_rgba(255,0,135,0.3)] hover:bg-[#00F7FF] hover:text-black transition-all group flex items-center justify-center gap-6"
              >
                {generating ? 'WEAVING...' : 'SUMMON STORY'}
                <Wand2 className="group-hover:rotate-12 transition-transform" size={32} />
              </button>
            </div>
          </div>
        </form>
      </div>

      <PricingModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
    </div>
  );
}
