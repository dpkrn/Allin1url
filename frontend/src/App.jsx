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
import TemplatePreview from './components/preview/TemplatePreview'
import Features from './components/pages/docs/Features'
import Benefits from './components/pages/docs/Benefits'
import Security from './components/pages/docs/Security'
import HowToUse from './components/pages/docs/HowToUse'
import Different from './components/pages/docs/Different'
import AuthPageV1 from './components/AuthPageV1'
import LinkClickDetailsV1 from './components/pages/LinkClickDetailsV1'

function App() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const isAuthenticated = useSelector(store => store.admin.isAuthenticated);
  const user=useSelector(store=>store.admin.user)
  const darkMode = useSelector(store => store.page.darkMode);
  const hasInitialized = useRef(false); // Track if initialization has completed
  const PrivateRoute = ({ children }) => {
    return isAuthenticated === true ? children : <Navigate to='/login' />;
  };

  const AuthRoute = ({ children }) => {
    return isAuthenticated === false ? children : <Navigate to='/home' />;
  };

  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError) {
      toast.error(oauthError);
      searchParams.delete('error');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    // Apply dark mode class to document based on Redux state
    // Note: darkMode is already initialized from localStorage in pageSlice.js
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Only run initialization once on mount
    // Using ref to prevent re-running if user state changes after initialization
    if (hasInitialized.current) {
      return;
    }

    const getUserInfo = async () => {
      try {
        const res = await api.post('/auth/verify', {}, { withCredentials: true });
        if (res.status === 200 && res.data.success) {
           console.log("User verified!");
          dispatch(setUser(res.data.user));
          dispatch(setAuthenticated(true));
          // toast.success(`Welcome back ${res.data.user.username}`);
        }
      } catch (err) {
        console.error(err);
        
        const message = err.response?.data?.message || "Server Internal Error";
        dispatch(setUser(null))
        dispatch(setAuthenticated(false));
        // Only show error toast if it's not a 401 (unauthorized) error
        if(err.response?.status !== 401) {
          toast.error(message);
        }
      } finally {
        setLoading(false);
        hasInitialized.current = true;
      }
    };

    const getAllLinks=async(username)=>{
      try{
       const res=await api.post('/source/getallsource',{username},{withCredentials:true});
       if(res.status===200&&res.data.success){
         dispatch(setLinks(res.data.sources))
       }
      }catch(err){
       console.log(err)
       const message=err.response?.data?.message||"Server Internal Error"
       // Only show error toast if it's not a 401 (unauthorized) error
       if(err.response?.status !== 401) {
         toast.error(message)
       }
      } finally {
        // Always reset loading state after links are fetched (or failed)
        setLoading(false);
        hasInitialized.current = true;
      }
     }
    
    // Wrap async logic in an immediately invoked async function
    (async () => {
      if (!user) {
        await getUserInfo();
      } else {
        // Await getAllLinks to ensure loading state is managed correctly
        await getAllLinks(user.username);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - initialization should only run once on mount

  if (isLoading) return <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
    <div className="relative flex justify-center items-center">
    <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-purple-500 dark:border-purple-400"></div>
    <img src="https://www.svgrepo.com/show/509001/avatar-thinking-9.svg"  className="rounded-full h-28 w-28"/>
</div>
  </div>;

  // Determine if current route is public (non-authenticated)
  const publicRoutes = ['/', '/verify', '/verified', '/reset_password', '/about-developer'];
  const isDocRoute = location.pathname.startsWith('/docs') || location.pathname === '/doc';
  const isPublicRoute = publicRoutes.includes(location.pathname) || isDocRoute;
  
  return (
    <div className='pb-1 min-h-screen bg-gradient-to-r from-slate-100 via-lime-100 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300'>
      {/* Show Nav for authenticated users (except home page which has its own Nav) OR for public routes (except login) */}
      {(isAuthenticated && location.pathname !== '/') || (!isAuthenticated && isPublicRoute && location.pathname !== '/login') ? <Nav /> : null}

      <Routes>
        <Route path='/doc' element={<Documentation/>} />
        <Route path='/docs/features' element={<Features/>} />
        <Route path='/docs/benefits' element={<Benefits/>} />
        <Route path='/docs/security' element={<Security/>} />
        <Route path='/docs/how-to-use' element={<HowToUse/>} />
        <Route path='/docs/different' element={<Different/>} />
        <Route path='/login' element={<AuthRoute><AuthPage /></AuthRoute>}/>
        <Route path='/verify' element={<VerificationPage />} />
        <Route path='/links' element={<PrivateRoute><LinkPage/></PrivateRoute>} />
        <Route path='/preview' element={<PrivateRoute><TemplatePreview/></PrivateRoute>} />
        <Route path='/' element={<AuthRoute><HomePage/></AuthRoute>} />
        <Route path='/profile' element={<PrivateRoute><ProfilePage/></PrivateRoute>} />
        <Route path='/profile/:username' element={<PrivateRoute><ProfilePreview/></PrivateRoute>} />
        <Route path='/settings' element={<PrivateRoute><Settings/></PrivateRoute>} />
        <Route path='/home' element={<PrivateRoute><DashBoard /></PrivateRoute>} />
        <Route path='/analytics' element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path='/click-details' element={<PrivateRoute><LinkClickDetailsV1/></PrivateRoute>} />
        <Route path='/verified' element={<VerifiedPage />} />
        <Route path='/reset_password' element={<PasswordReset />} />
        <Route path='/about-developer' element={<AboutDeveloper />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      
    </div>
  );
}

export default App;
