import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, Volume2, Stars, Sparkles, Maximize2, Volume1, VolumeX, ChevronUp, ChevronDown, X, BookOpen, Clock, Heart, LogOut, Loader2 } from 'lucide-react';

import { getStoryById, getChildById, toggleLikeStory, getSubscription, incrementTtsUsage } from '../services/db';
import Loader from '../components/Loader';
import { generateStoryAudio } from '../services/ttsService';

// Background Music Assets
import bgAudio1 from '../assests/audio1.mp3';
import bgAudio2 from '../assests/audio2.mp3';
import bgAudio3 from '../assests/audio3.mp3';
import bgAudio4 from '../assests/audio4.mp3';
import bgAudio5 from '../assests/audio5.mp3';
import bgAudio6 from '../assests/audio6.mp3';
import bgAudio7 from '../assests/audio7.mp3';

const bgTracks = [bgAudio1, bgAudio2, bgAudio3, bgAudio4, bgAudio5, bgAudio6, bgAudio7];

export default function StoryPlayer() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [child, setChild] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(1);
  const [showMobileLyrics, setShowMobileLyrics] = useState(false);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [useFallbackTts, setUseFallbackTts] = useState(false);
  const [ttsLimitReached, setTtsLimitReached] = useState(false);

  const containerRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const mobileLyricsContainerRef = useRef(null);
  const audioRef = useRef(null);
  const bgAudioRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Select a random track for this session
  const selectedBgTrack = useMemo(() => {
    return bgTracks[Math.floor(Math.random() * bgTracks.length)];
  }, []);

  const words = useMemo(() => {
    if (!story?.story_text) return [];
    const result = [];
    let offset = 0;
    const regex = /(\s+)/;
    const parts = story.story_text.split(regex);
    parts.forEach(part => {
      if (part.length > 0) {
        result.push({
          text: part,
          start: offset,
          end: offset + part.length,
          isSpace: /\s+/.test(part)
        });
        offset += part.length;
      }
    });
    return result;
  }, [story?.story_text]);

  useEffect(() => {
    fetchData();
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [storyId]);

  const fetchData = async () => {
    try {
      const storyData = await getStoryById(storyId);
      const childData = await getChildById(storyData.child_id);
      setStory(storyData);
      setChild(childData);
      setIsLiked(storyData.is_liked || false);
      const wordCount = storyData.story_text.split(/\s+/).length;
      const estimatedSeconds = (wordCount / 150) * 60;
      setDuration(formatTime(estimatedSeconds));

      // Check if story already has an audio_url
      if (storyData.audio_url) {
        setAudioUrl(storyData.audio_url);
      }
    } catch (err) {
      console.error(err);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    const nextState = !isLiked;
    setIsLiked(nextState); // Optimistic UI
    try {
      await toggleLikeStory(storyId, nextState);
    } catch (err) {
      setIsLiked(!nextState); // Rollback
      console.error(err);
    }
  };

  const handleAudioGeneration = async () => {
    if (!story?.story_text || isGeneratingAudio) return;

    setIsGeneratingAudio(true);
    try {
      const blob = await generateStoryAudio(story.story_text);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      return url;
    } catch (err) {
      console.error("Audio generation failed:", err);
      alert("Audio generation failed. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const playWithFallback = (text) => {
    if (utteranceRef.current) synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.volume = volume;

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        setCurrentCharIndex(charIndex);
        const prog = (charIndex / text.length) * 100;
        setProgress(prog);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
    setIsPlaying(true);
    setUseFallbackTts(true);
  };

  const togglePlay = async () => {
    // If fallback is already active
    if (useFallbackTts) {
      if (isPlaying) {
        synthRef.current.pause();
        setIsPlaying(false);
      } else {
        if (synthRef.current.paused) {
          synthRef.current.resume();
        } else {
          playWithFallback(story.story_text);
        }
        setIsPlaying(true);
      }
      return;
    }

    if (!audioUrl) {
      setIsGeneratingAudio(true);
      try {
        const sub = await getSubscription();
        const usage = sub?.tts_usage_count || 0;

        if (usage < 1) {
          const blob = await generateStoryAudio(story.story_text);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          await incrementTtsUsage();

          // Wait for next tick to ensure audioRef is updated with src
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play();
              setIsPlaying(true);
            }
          }, 100);
        } else {
          setTtsLimitReached(true);
          playWithFallback(story.story_text);
        }
      } catch (err) {
        console.error("Audio generation failed:", err);
        playWithFallback(story.story_text);
      } finally {
        setIsGeneratingAudio(false);
      }
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!story || !audioRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;

    const targetTime = audioRef.current.duration * percentage;
    audioRef.current.currentTime = targetTime;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current || !story) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    const prog = (current / total) * 100;

    setProgress(prog);
    setCurrentTime(formatTime(current));
    setDuration(formatTime(total));

    // Estimate character index for lyrics highlighting
    const charIndex = Math.floor((current / total) * story.story_text.length);
    setCurrentCharIndex(charIndex);
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    if (utteranceRef.current) utteranceRef.current.volume = val;
    if (bgAudioRef.current) bgAudioRef.current.volume = val * 0.3;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) containerRef.current.requestFullscreen();
    else document.exitFullscreen();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    const scrollContainer = (container) => {
      if (!container) return;
      const activeWord = container.querySelector('.active-word');
      if (activeWord) activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    scrollContainer(lyricsContainerRef.current);
    scrollContainer(mobileLyricsContainerRef.current);
  }, [currentCharIndex]);

  useEffect(() => {
    const bgAudio = bgAudioRef.current;
    if (!bgAudio) return;

    if (isPlaying) {
      bgAudio.play().catch(err => console.error("BG Audio Play Error:", err));
    } else {
      bgAudio.pause();
      if (useFallbackTts) synthRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (utteranceRef.current) {
      utteranceRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = volume * 0.3;
    }
  }, [volume]);

  if (loading) return <Loader message="SUMMONING STORY..." />;

  return (
    <div ref={containerRef} className="h-screen w-full bg-[#0a0a0a] text-white font-sans flex flex-col lg:flex-row overflow-hidden relative selection:bg-[#00F7FF] selection:text-black">

      {/* 📱 MOBILE LIMIT NOTIFICATION */}
      {ttsLimitReached && (
        <div className="lg:hidden absolute top-24 left-6 right-6 z-50 p-4 bg-[#00F7FF]/10 border border-[#00F7FF]/20 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <Sparkles size={14} className="text-[#00F7FF]" />
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF]">Using Basic Voice (Limit Reached)</p>
          </div>
        </div>
      )}

      {/* Story Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setIsPlaying(false); setProgress(100); }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Background Music Element */}
      <audio
        ref={bgAudioRef}
        src={selectedBgTrack}
        loop
        style={{ display: 'none' }}
        onPlay={() => {
          if (bgAudioRef.current) bgAudioRef.current.volume = volume * 0.3;
        }}
      />

      {/* 🔮 BACKGROUND DEPTH */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,#FF008705_0%,transparent_70%)]"
        />
      </div>

      {/* 🚀 SIDEBAR (LEFT) - DESKTOP ONLY */}
      <aside className="hidden lg:flex w-80 bg-black/60 backdrop-blur-3xl border-r border-white/10 flex-col p-10 z-50 shrink-0">
        <div className="space-y-4 mb-16 pt-10 mt-5">
          <div className="w-12 h-1 bg-[#FF0087]" />
          <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-tight text-white">{story.title}</h2>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
            <Clock size={12} /> {duration}
            <div className="w-1 h-1 bg-white/20 rounded-full" />
            <BookOpen size={12} /> {words.length}
          </div>
        </div>

        {ttsLimitReached && (
          <div className="mb-10 p-5 bg-[#00F7FF]/5 border border-[#00F7FF]/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF]">Voice Limit Reached</p>
            <p className="text-[9px] font-bold text-white/40 uppercase mt-1">Using basic voice for this story.</p>
          </div>
        )}

        <div className="flex-grow space-y-10">
          <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-1 group hover:border-[#00F7FF]/20 transition-all">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#00F7FF] mb-2">Child Profile</p>
            <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{child.name}</h3>
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{child.age} Years Old</p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/dashboard/child/${child.id}`)}
          className="mt-auto p-6 bg-[#FF0087] hover:bg-[#FF0087]/80 text-white rounded-[2rem] flex items-center justify-center gap-4 transition-all group overflow-hidden relative shadow-[0_0_30px_rgba(255,0,135,0.2)]"
        >
          <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">EXIT PLAYER</span>
        </button>
      </aside>

      {/* 🏛️ TOP BAR (MOBILE) */}
      <header className="lg:hidden relative z-40 px-6 py-8 flex justify-center items-center shrink-0">
        <div className="flex flex-col items-center">
          <h1 className="text-sm font-black italic uppercase tracking-tighter text-white">{story.title}</h1>
        </div>

        {/* Lyrics Toggle moved here for better accessibility */}
        <button
          onClick={() => setShowMobileLyrics(true)}
          className="absolute right-6 w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-[#00F7FF] border border-white/10"
        >
          <BookOpen size={18} />
        </button>
      </header>

      {/* 🎭 MAIN STAGE */}
      <div className="flex-grow flex flex-col relative overflow-hidden bg-black/20">

        {/* STORY CONTENT AREA */}
        <main
          ref={lyricsContainerRef}
          className="flex-grow overflow-y-auto custom-scrollbar relative py-[25vh] px-8 lg:px-20"
        >
          {/* FADE MASKS */}
          <div className="fixed top-0 left-0 lg:left-80 right-0 h-40 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />
          <div className="fixed bottom-0 left-0 lg:left-80 right-0 h-56 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent z-10 pointer-events-none" />

          <div className="max-w-5xl mx-auto flex flex-wrap gap-x-3 gap-y-10 lg:gap-x-4 lg:gap-y-12 justify-center text-center pb-[40vh]">
            {words.map((word, i) => {
              const isActive = currentCharIndex >= word.start && currentCharIndex < word.end;
              const isPast = currentCharIndex >= word.end;
              return (
                <motion.span
                  key={i}
                  layout
                  className={`text-4xl md:text-7xl lg:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase transition-all duration-700 cursor-default ${isActive
                    ? 'text-[#00F7FF] scale-110 active-word drop-shadow-[0_0_20px_rgba(0,247,255,0.6)] opacity-100 blur-0'
                    : isPast
                      ? 'text-white/60 opacity-80 blur-0'
                      : 'text-white/10 opacity-30 blur-[2px] lg:blur-[3px]'
                    }`}
                >
                  {word.text}
                </motion.span>
              );
            })}
          </div>
        </main>

        {/* 🧭 DESKTOP CONTROLS */}
        <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-10 z-[100]">
          <div className="w-full bg-black/80 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] p-5 flex items-center gap-10 shadow-2xl">
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/20 shadow-lg">
                <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase text-[#00F7FF] tabular-nums tracking-widest">{currentTime}</span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{duration}</span>
              </div>
            </div>

            <div onClick={handleSeek} className="flex-grow h-2 bg-white/10 rounded-full relative overflow-hidden group cursor-pointer border border-white/5">
              <motion.div layout style={{ width: `${progress}%` }} className="absolute inset-y-0 left-0 bg-[#00F7FF] rounded-full shadow-[0_0_10px_rgba(0,247,255,0.5)]" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-6">
              <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }} className="text-white/30 hover:text-white transition-colors"><SkipBack size={22} /></button>
              <button
                onClick={togglePlay}
                disabled={isGeneratingAudio}
                className="w-14 h-14 bg-[#00F7FF] text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,247,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingAudio ? (
                  <Loader2 className="animate-spin" size={26} />
                ) : isPlaying ? (
                  <Pause fill="black" size={26} />
                ) : (
                  <Play fill="black" size={26} className="ml-1" />
                )}
              </button>
              <button onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }} className="text-white/30 hover:text-white transition-colors"><SkipForward size={22} /></button>
            </div>

            <div className="w-[1px] h-10 bg-white/10" />

            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggleLike}
                className={`transition-colors ${isLiked ? 'text-[#FF0087]' : 'text-white/20 hover:text-[#FF0087]/50'}`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </motion.button>
              <button onClick={() => {
                const nextVolume = volume > 0 ? 0 : 1;
                setVolume(nextVolume);
                if (audioRef.current) audioRef.current.volume = nextVolume;
                if (bgAudioRef.current) bgAudioRef.current.volume = nextVolume * 0.3;
              }} className="text-white/40 hover:text-[#00F7FF]">
                {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input type="range" min="0" max="1" step="0.01" value={volume} onChange={handleVolumeChange} className="w-20 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00F7FF]" />
              <button onClick={toggleFullscreen} className="text-white/20 hover:text-white"><Maximize2 size={20} /></button>
            </div>
          </div>
        </div>

        {/* 🧭 MOBILE CONTROLS - BACK BUTTON PLACED HERE */}
        <footer className="lg:hidden relative z-[60] bg-[#0a0a0a] pb-10 pt-6 px-8 border-t border-white/5 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">

            {/* Progress Area */}
            <div onClick={handleSeek} className="w-full space-y-2 cursor-pointer group">
              <div className="flex justify-between items-end px-1">
                <span className="text-[9px] font-black uppercase text-[#00F7FF] tabular-nums tracking-widest">{currentTime}</span>
                <span className="text-[9px] font-black uppercase text-white/20 tabular-nums tracking-widest">{duration}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full relative overflow-hidden border border-white/5">
                <motion.div layout style={{ width: `${progress}%` }} className="absolute inset-y-0 left-0 bg-[#00F7FF] rounded-full shadow-lg" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* NEW BACK BUTTON LOCATION FOR MOBILE */}
              <button
                onClick={() => navigate(`/dashboard/child/${child.id}`)}
                className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#FF0087] transition-colors border border-white/5"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex items-center gap-6">
                <button
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime = 0; }}
                  className="text-white/20"
                >
                  <SkipBack size={20} />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={isGeneratingAudio}
                  className="w-20 h-20 bg-white text-black rounded-[2rem] flex items-center justify-center shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGeneratingAudio ? (
                    <Loader2 className="animate-spin" size={32} />
                  ) : isPlaying ? (
                    <Pause fill="black" size={32} />
                  ) : (
                    <Play fill="black" size={32} className="ml-1" />
                  )}
                </button>
                <button
                  onClick={() => { if (audioRef.current) audioRef.current.currentTime = audioRef.current.duration; }}
                  className="text-white/20"
                >
                  <SkipForward size={20} />
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggleLike}
                className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center transition-colors border border-white/5 ${isLiked ? 'text-[#FF0087]' : 'text-white/20'}`}
              >
                <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
              </motion.button>
            </div>
          </div>
        </footer>
      </div>

      {/* 📱 MOBILE LYRICS DRAWER */}
      <AnimatePresence>
        {showMobileLyrics && (
          <motion.div
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col lg:hidden"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex flex-col">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#00F7FF] mb-0.5">Nestly Lyrics</span>
                <h4 className="text-white text-sm font-black italic uppercase tracking-tighter">{story.title}</h4>
              </div>
              <button onClick={() => setShowMobileLyrics(false)} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white border border-white/10"><X size={20} /></button>
            </div>
            <div ref={mobileLyricsContainerRef} className="flex-grow overflow-y-auto custom-scrollbar p-8 py-40">
              <div className="flex flex-wrap gap-x-2 gap-y-6 justify-center text-center">
                {words.map((word, i) => {
                  const isActive = currentCharIndex >= word.start && currentCharIndex < word.end;
                  const isPast = currentCharIndex >= word.end;
                  return (
                    <span key={i} className={`text-4xl font-black italic uppercase tracking-tighter transition-all duration-300 ${isActive ? 'text-[#00F7FF] active-word' : isPast ? 'text-white/60' : 'text-white/10'}`}>
                      {word.text}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="p-10 border-t border-white/10 bg-black flex justify-center shrink-0">
              <button
                onClick={togglePlay}
                disabled={isGeneratingAudio}
                className="w-20 h-20 bg-[#00F7FF] text-black rounded-3xl flex items-center justify-center shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {isGeneratingAudio ? (
                  <Loader2 className="animate-spin" size={32} />
                ) : isPlaying ? (
                  <Pause fill="currentColor" size={32} />
                ) : (
                  <Play fill="currentColor" size={32} className="ml-1" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
