import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ChildDashboard from './pages/ChildDashboard';
import StoryGenerator from './pages/StoryGenerator';
import ProfileManager from './pages/ProfileManager';
import StoryPlayer from './pages/StoryPlayer';
import Subscription from './pages/Subscription';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import ResetPassword from './pages/ResetPassword';
import Navbar from './components/Navbar';
import Preloader from './components/Preloader';
import ScrollToTop from './components/ScrollToTop';
import { auth } from './services/db';

// 🛡️ PROTECTED ROUTE COMPONENT
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);
  
  useEffect(() => {
    auth.getUser().then(({ data: { user } }) => {
      setSession(user);
    });
  }, []);

  if (session === undefined) return null; // Still checking
  if (!session) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 🕵️ GLOBAL AUTH OBSERVER
    const { data: { subscription } } = auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        // Immediate redirect to homepage on logout
        navigate('/', { replace: true });
      }
      if (event === 'PASSWORD_RECOVERY') {
        // When user clicks the reset link in email
        navigate('/reset-password', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setIsTransitioning(false);
      }, 850);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  const colors = ["#FF0087", "#00F7FF", "#FF7DB0", "#B0FFFA", "#FF0087"];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <AnimatePresence mode="wait">
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          <ScrollToTop key={displayLocation.pathname} />
          <Navbar />

          {/* SYNCED PRISM TRANSITION LAYER */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="fixed inset-0 z-[200] pointer-events-none h-screen w-screen"
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="flex h-full w-full">
                {colors.map((color, i) => (
                  <motion.div
                    key={i}
                    variants={{
                      initial: { height: "100%" },
                      animate: { height: "0%" },
                      exit: { height: "100%" }
                    }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.05,
                      ease: [0.76, 0, 0.24, 1]
                    }}
                    style={{ backgroundColor: color, originY: i % 2 === 0 ? 0 : 1 }}
                    className="flex-grow h-full "
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <main className="flex-grow relative z-10">
            <Routes location={displayLocation}>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* RESTRICTED ROUTES WRAPPED IN PROTECTION */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/child/:childId" element={<ProtectedRoute><ChildDashboard /></ProtectedRoute>} />
              <Route path="/dashboard/generate" element={<ProtectedRoute><StoryGenerator /></ProtectedRoute>} />
              <Route path="/dashboard/profiles" element={<ProtectedRoute><ProfileManager /></ProtectedRoute>} />
              <Route path="/dashboard/player/:storyId" element={<ProtectedRoute><StoryPlayer /></ProtectedRoute>} />
              <Route path="/dashboard/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* CATCH-ALL REDIRECT */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
