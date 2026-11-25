import { Navigate, Route, Routes } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { useAuth } from './context/useAuth';
import CalculatorPage from './pages/CalculatorPage';
import ChallengePage from './pages/ChallengePage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShapesPage from './pages/ShapesPage';
import TablesPage from './pages/TablesPage';
import WelcomePage from './pages/WelcomePage';

function ProtectedRoute({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }
  return <ProgressProvider key={currentUser.id}>{children}</ProgressProvider>;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          <PublicOnlyRoute>
            <WelcomePage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicOnlyRoute>
            <RegisterPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenge"
        element={
          <ProtectedRoute>
            <ChallengePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/calculator"
        element={
          <ProtectedRoute>
            <CalculatorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tables"
        element={
          <ProtectedRoute>
            <TablesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shapes"
        element={
          <ProtectedRoute>
            <ShapesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
