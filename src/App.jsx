import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import TeamSelection from '@/pages/TeamSelection';
import Leaderboard from '@/pages/Leaderboard';
import PrivateRoute from '@/routes/PrivateRoute';
import HomePage from '@/pages/HomePage';
import FaqPage from '@/pages/FaqPage';
import RulesPage from '@/pages/RulesPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <div style={{
          backgroundColor: 'var(--background)',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Navbar />
          <main style={{
            flex: 1,
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px'
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/team" element={<PrivateRoute><TeamSelection /></PrivateRoute>} />
              <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;