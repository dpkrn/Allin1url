import { useEffect, useState, useRef } from 'react'
import "./App.css"
import AuthPage from './components/AuthPage'
import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import DashBoard from './components/DashBoard'
import { useDispatch, useSelector } from 'react-redux'
import api from './utils/api'
import { setAuthenticated, setLinks, setUser } from './redux/userSlice'
import toast from 'react-hot-toast'
import VerificationPage from './components/VerificationPage'
import Nav from './components/navbar/Nav'
import VerifiedPage from './components/VerifiedPage'
import PasswordReset from './components/PasswordReset'
import Documentation from './components/pages/Documentation/Documentation'
import HomePage from './components/pages/HomePage/HomePage'
import LinkPage from './components/pages/LinkPage'
import ProfilePage from './components/pages/Profile'
import ProfilePreview from './components/pages/ProfilePreview'
import Settings from './components/pages/Settings'
import NotFound from './components/pages/NotFound'
import AboutDeveloper from './components/pages/AboutDeveloper'
import Analytics from './components/pages/Analytics'
import LinkClickDetails from './components/pages/LinkClickDetails'
import LinkClickDetailsV1 from './components/pages/LinkClickDetailsV1'
import TemplatePreview from './components/preview/TemplatePreview'
import Features from './components/pages/docs/Features'
import Benefits from './components/pages/docs/Benefits'
import Security from './components/pages/docs/Security'
import HowToUse from './components/pages/docs/HowToUse'
import Different from './components/pages/docs/Different'
import Sidebar from './components/layout/Sidebar'

function App() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const user = useSelector(store => store.admin.user);
  const darkMode = useSelector(store => store.page.darkMode);
  const hasInitialized = useRef(false);

  const PrivateRoute = ({ children }) => isAuthenticated === true ? children : <Navigate to='/login' />;
  const AuthRoute = ({ children }) => isAuthenticated === false ? children : <Navigate to='/home' />;

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      toast.error(oauthError);
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (hasInitialized.current) return;

    const getUserInfo = async () => {
      try {
        const res = await api.post('/auth/verify', {}, { withCredentials: true });
        if (res.status === 200 && res.data.success) {
          dispatch(setUser(res.data.user));
          dispatch(setAuthenticated(true));
        }
      } catch (err) {
        dispatch(setUser(null));
        dispatch(setAuthenticated(false));
        if (err.response?.status !== 401) toast.error(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    const getAllLinks = async (username) => {
      try {
        const res = await api.post('/source/getallsource', { username }, { withCredentials: true });
        if (res.status === 200 && res.data.success) dispatch(setLinks(res.data.sources));
      } catch (err) {
        if (err.response?.status !== 401) toast.error(err.response?.data?.message || "Server error");
      } finally {
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    (async () => {
      if (!user) await getUserInfo();
      else await getAllLinks(user.username);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Loading...</span>
        </div>
      </div>
    );
  }

  const publicNavRoutes = ['/', '/verify', '/verified', '/reset_password', '/about-developer'];
  const isDocRoute = location.pathname.startsWith('/docs') || location.pathname === '/doc';
  const showPublicNav = !isAuthenticated && (publicNavRoutes.includes(location.pathname) || isDocRoute);

  return (
    <div className={`min-h-screen ${isAuthenticated ? 'bg-slate-50 dark:bg-slate-950' : 'bg-white dark:bg-slate-950'} transition-colors duration-200`}>
      {isAuthenticated && <Sidebar />}

      <div className={isAuthenticated ? 'lg:pl-60 min-h-screen' : ''}>
        {!isAuthenticated && showPublicNav && <Nav />}

        <Routes>
          <Route path='/doc' element={<Documentation />} />
          <Route path='/docs/features' element={<Features />} />
          <Route path='/docs/benefits' element={<Benefits />} />
          <Route path='/docs/security' element={<Security />} />
          <Route path='/docs/how-to-use' element={<HowToUse />} />
          <Route path='/docs/different' element={<Different />} />
          <Route path='/login' element={<AuthRoute><AuthPage /></AuthRoute>} />
          <Route path='/verify' element={<VerificationPage />} />
          <Route path='/links' element={<PrivateRoute><LinkPage /></PrivateRoute>} />
          <Route path='/preview' element={<PrivateRoute><TemplatePreview /></PrivateRoute>} />
          <Route path='/' element={<AuthRoute><HomePage /></AuthRoute>} />
          <Route path='/profile' element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path='/profile/:username' element={<PrivateRoute><ProfilePreview /></PrivateRoute>} />
          <Route path='/settings' element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path='/home' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
          <Route path='/analytics' element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path='/click-details' element={<PrivateRoute><LinkClickDetailsV1 /></PrivateRoute>} />
          <Route path='/verified' element={<VerifiedPage />} />
          <Route path='/reset_password' element={<PasswordReset />} />
          <Route path='/about-developer' element={<AboutDeveloper />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
