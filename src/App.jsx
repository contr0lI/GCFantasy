import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import TeamSelection from '@/pages/TeamSelection';
import Leaderboard from '@/pages/Leaderboard';
import PrivateRoute from '@/routes/PrivateRoute';
import HomePage from '@/pages/HomePage';
import FaqPage from '@/pages/FaqPage';
import RulesPage from '@/pages/RulesPage';

const appStyles = {
  container: {
    backgroundColor: '#0a0a0a', // Dark background
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '20px',
    color: '#fff',
  },
  content: {
    maxWidth: '1200px',
    width: '100%',
    padding: '20px',
  },
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div style={appStyles.container}>
          <Navbar />
          <div style={appStyles.content}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/team" element={<PrivateRoute><TeamSelection /></PrivateRoute>} />
              <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;