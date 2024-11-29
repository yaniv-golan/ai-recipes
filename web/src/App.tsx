import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Recipe } from './pages/Recipe';
import { WorkflowCreator } from './pages/WorkflowCreator';
import { GitHubCallback } from './pages/GitHubCallback';
import { Author } from './pages/Author';
import { Header } from './components/Header';

function App() {
  const [error, setError] = useState<Error | null>(null);
  const [errorInfo, setErrorInfo] = useState<React.ErrorInfo | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      setError(event.error);
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-2">Error Details:</h2>
            <pre className="bg-gray-50 p-4 rounded overflow-auto text-sm">
              {error.toString()}
              {errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recipe/:user/:recipe" element={<Recipe />} />
            <Route path="/create" element={<WorkflowCreator />} />
            <Route path="/github/callback" element={<GitHubCallback />} />
            <Route path="/author/:author" element={<Author />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;