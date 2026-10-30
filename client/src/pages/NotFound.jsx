import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <p className="text-8xl mb-4">🔍</p>
    <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
    <p className="text-xl text-gray-500 mb-6">Page not found</p>
    <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
    <div className="flex gap-4">
      <Link to="/" className="btn-primary">Go Home</Link>
      <Link to="/products" className="btn-secondary">Browse Products</Link>
    </div>
  </div>
);

export default NotFound;
