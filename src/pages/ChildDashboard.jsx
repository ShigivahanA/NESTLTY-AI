import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, BookOpen, Clock, ChevronLeft, ChevronRight, Wand2, Stars, Sparkles, Heart, Trash2, AlertCircle, X } from 'lucide-react';
import { getChildById, getStoriesByChild, deleteStory, toggleLikeStory } from '../services/db';
import Loader from '../components/Loader';

export default function ChildDashboard() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storyToDelete, setStoryToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childData, storiesData] = await Promise.all([
        getChildById(childId),
        getStoriesByChild(childId)
      ]);
      setChild(childData);
      setStories(storiesData);
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async (e, storyId, currentStatus) => {
    e.stopPropagation();
    const nextStatus = !currentStatus;
    
    // Optimistic UI Update
    setStories(stories.map(s => s.id === storyId ? { ...s, is_liked: nextStatus } : s));

    try {
      await toggleLikeStory(storyId, nextStatus);
    } catch (err) {
      // Rollback on failure
      setStories(stories.map(s => s.id === storyId ? { ...s, is_liked: currentStatus } : s));
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!storyToDelete) return;
    setIsDeleting(true);
    try {
      await deleteStory(storyToDelete.id);
      setStories(stories.filter(s => s.id !== storyToDelete.id));
      setStoryToDelete(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete the story. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader message="SUMMONING ADVENTURES..." />;

  return (
    <div className="min-h-screen bg-[#B0FFFA] pt-32 pb-20 px-6 font-sans selection:bg-[#FF0087] selection:text-white">
      <div className="max-w-6xl mx-auto relative z-10">

        <button 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-4 text-[#FF0087] font-black uppercase tracking-[0.5em] text-[10px] mb-16 group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-2 transition-transform" /> BACK TO HOME
        </button>

        {/* HERO HEADER */}
        <section className="mb-20 grid md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-8">
            <h1 className="text-7xl md:text-[10vw] font-black italic tracking-tighter text-[#FF0087] leading-[0.8] uppercase">
              {child.name}<span className="text-[#00F7FF]">.</span>
            </h1>
          </div>
          <div className="md:col-span-4 pb-4">
            <button
              onClick={() => navigate(`/dashboard/generate?childId=${childId}`)}
              className="w-full py-8 bg-[#FF0087] text-[#B0FFFA] rounded-[3rem] text-4xl font-black italic uppercase tracking-tighter shadow-2xl hover:bg-[#00F7FF] hover:text-[#FF0087] transition-all flex items-center justify-center gap-6 group"
            >
              CREATE <Wand2 className="group-hover:rotate-12 transition-transform" size={40} />
            </button>
          </div>
        </section>

        {/* STORY HISTORY */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black italic text-[#FF0087] uppercase tracking-tighter text-glow-pink">ARCHIVED TALES</h2>
            <div className="h-px flex-grow mx-8 bg-[#FF0087]/20" />
            <span className="text-[10px] font-black uppercase text-[#FF7DB0] tabular-nums tracking-[0.2em]">{stories.length} STORIES</span>
          </div>

          {stories.length === 0 ? (
            <div className="py-32 text-center border-8 border-dashed border-[#FF0087]/10 rounded-[5rem] bg-white/30">
              <Sparkles className="mx-auto text-[#FF0087]/20 mb-8" size={64} />
              <p className="text-[#FF0087] font-black italic text-3xl uppercase mb-4 opacity-40">The library is empty...</p>
              <p className="text-[#FF7DB0] font-bold uppercase tracking-widest text-sm mb-12">Start your child's first magical adventure today</p>
              <button 
                onClick={() => navigate(`/dashboard/generate?childId=${childId}`)} 
                className="px-12 py-5 bg-[#FF0087] text-white font-black uppercase tracking-widest rounded-full hover:scale-110 transition-transform shadow-xl"
              >
                GENERATE STORY
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {stories.map((story) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white/70 backdrop-blur-xl border-4 border-[#FF0087]/10 p-8 rounded-[3rem] flex flex-col md:flex-row items-center justify-between group hover:border-[#FF0087] transition-all relative overflow-hidden"
                  >
                    <div className="flex items-center gap-8 w-full md:w-auto cursor-pointer" onClick={() => navigate(`/dashboard/player/${story.id}`)}>
                      <div className="w-20 h-20 rounded-[2rem] bg-[#FF0087] flex items-center justify-center text-[#B0FFFA] shadow-xl group-hover:bg-[#00F7FF] group-hover:text-[#FF0087] transition-colors flex-shrink-0">
                        <Play fill="currentColor" size={28} />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-3xl md:text-4xl font-black italic text-[#FF0087] uppercase leading-none tracking-tighter truncate max-w-[300px] md:max-w-md">{story.title || "UNTITLED TALE"}</h4>
                        <div className="flex items-center flex-wrap gap-4 mt-3">
                          <span className="text-[10px] font-black text-[#FF7DB0] uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> {new Date(story.created_at).toLocaleDateString()}</span>
                          <div className="w-1 h-1 bg-[#FF7DB0] rounded-full hidden sm:block" />
                          <span className="text-[10px] font-black text-[#FF7DB0] uppercase tracking-widest italic">
                            {(() => {
                              const wordCount = story.story_text?.split(/\s+/).length || 0;
                              const estimatedSeconds = (wordCount / 150) * 60;
                              const mins = Math.floor(estimatedSeconds / 60);
                              const secs = Math.floor(estimatedSeconds % 60);
                              return `${mins}:${secs < 10 ? '0' : ''}${secs} MINS`;
                            })()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-8 md:mt-0 w-full md:w-auto justify-end">
                      <motion.button 
                        whileTap={{ scale: 0.8 }}
                        onClick={(e) => handleToggleLike(e, story.id, story.is_liked)}
                        className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all border border-[#FF0087]/10 ${story.is_liked ? 'bg-[#FF0087] text-[#B0FFFA]' : 'bg-[#FF0087]/5 text-[#FF0087]/30 hover:text-[#FF0087]'}`}
                      >
                        <Heart size={20} fill={story.is_liked ? "currentColor" : "none"} />
                      </motion.button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setStoryToDelete(story);
                        }}
                        className="h-14 w-14 rounded-2xl bg-[#FF0087]/5 text-[#FF0087]/30 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all border border-transparent hover:border-red-600"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button 
                         onClick={() => navigate(`/dashboard/player/${story.id}`)}
                         className="h-14 px-8 rounded-2xl border-2 border-[#FF0087]/10 group-hover:bg-[#FF0087] group-hover:text-[#B0FFFA] flex items-center justify-center text-[#FF0087] font-black uppercase tracking-widest text-[10px] gap-3 transition-all"
                      >
                        READ NOW <ChevronRight size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>
      </div>

      {/* 🗑️ DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {storyToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStoryToDelete(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[4rem] p-12 shadow-2xl border-4 border-[#FF0087]/20"
            >
              <div className="absolute top-8 right-8">
                <button onClick={() => setStoryToDelete(null)} className="text-[#FF0087]/20 hover:text-[#FF0087] transition-colors">
                  <X size={32} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-8">
                <div className="w-24 h-24 bg-red-100 rounded-[2.5rem] flex items-center justify-center text-red-500">
                  <AlertCircle size={48} />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-black italic uppercase tracking-tighter text-[#FF0087] leading-none">ERASE STORY?</h3>
                  <p className="text-[#FF7DB0] font-bold uppercase tracking-widest text-sm leading-relaxed max-w-xs mx-auto">
                    Are you sure you want to remove <span className="text-[#FF0087] italic">"{storyToDelete.title}"</span>? This cannot be undone.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <button
                    onClick={() => setStoryToDelete(null)}
                    className="flex-1 py-6 bg-gray-100 text-gray-400 rounded-[2rem] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 py-6 bg-red-500 text-white rounded-[2rem] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? "ERASING..." : "ERASE NOW"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
