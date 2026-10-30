import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { CATEGORY_ICONS, CATEGORIES } from '../utils/constants';

const FEATURED_CATEGORIES = CATEGORIES.slice(0, 6);

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll({ limit: 8, sort: '-createdAt' })
      .then(({ data }) => setFeaturedProducts(data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              Buy & Sell Locally 🛒
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Discover amazing deals in your community. List your items in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition-colors text-lg">
                Browse Products
              </Link>
              <Link to="/create-listing" className="bg-blue-500 hover:bg-blue-400 text-white font-semibold py-3 px-8 rounded-xl border border-blue-400 transition-colors text-lg">
                Start Selling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="flex flex-col items-center p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                {CATEGORY_ICONS[cat]}
              </span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium text-center">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all →
          </Link>
        </div>
        {loading ? (
          <Spinner text="Loading products..." />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-5xl mb-4">🏷️</p>
            <p className="text-gray-500 text-lg mb-4">No listings yet. Be the first to sell!</p>
            <Link to="/create-listing" className="btn-primary">List Something</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-3">Ready to sell?</h2>
          <p className="text-blue-100 mb-6">List your items in seconds and reach local buyers.</p>
          <Link to="/create-listing" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-8 rounded-xl transition-colors inline-block">
            Create Listing
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
