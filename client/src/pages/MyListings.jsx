import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { formatPrice, formatDate, CONDITION_COLORS, PLACEHOLDER_IMAGE, getErrorMessage } from '../utils/constants';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const MyListings = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchListings = async () => {
    try {
      const { data } = await productsAPI.getMyListings();
      setProducts(data.products);
    } catch (err) {
      toast.error('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchListings(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    setDeletingId(id);
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Listing deleted');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  const statusColor = { active: 'bg-green-100 text-green-800', sold: 'bg-gray-100 text-gray-800', inactive: 'bg-yellow-100 text-yellow-800' };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
        <Link to="/create-listing" className="btn-primary text-sm px-4 py-2">+ New Listing</Link>
      </div>

      {loading ? (
        <Spinner text="Loading your listings..." />
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-5xl mb-4">📦</p>
          <p className="text-gray-500 text-lg">No listings yet</p>
          <p className="text-gray-400 text-sm mb-6">Start selling by creating your first listing!</p>
          <Link to="/create-listing" className="btn-primary">Create Listing</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => (
            <div key={p._id} className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 hover:shadow-sm transition-shadow">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={p.images?.[0]?.url || PLACEHOLDER_IMAGE}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/products/${p._id}`} className="font-semibold text-gray-900 hover:text-blue-600 truncate">
                    {p.title}
                  </Link>
                  <span className={`badge flex-shrink-0 ${statusColor[p.status] || 'bg-gray-100 text-gray-700'}`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-lg font-bold text-blue-600">{formatPrice(p.price)}</p>
                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                  <span>{p.category}</span>
                  <span>•</span>
                  <span className={`badge ${CONDITION_COLORS[p.condition]}`}>{p.condition}</span>
                  <span>•</span>
                  <span>Listed {formatDate(p.createdAt)}</span>
                  <span>•</span>
                  <span>👁 {p.views}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Link to={`/edit-listing/${p._id}`} className="btn-secondary text-xs px-3 py-1.5">Edit</Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  disabled={deletingId === p._id}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  {deletingId === p._id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
