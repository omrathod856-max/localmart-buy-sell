import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPrice, formatDate, CONDITION_COLORS, PLACEHOLDER_IMAGE } from '../utils/constants';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    productsAPI.getOne(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(true);
    try {
      await productsAPI.delete(id);
      toast.success('Listing deleted successfully');
      navigate('/my-listings');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Delete failed');
      setDeleting(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" text="Loading..." /></div>;
  if (!product) return null;

  const isOwner = user && product.seller?._id === user._id;
  const images = product.images?.length > 0 ? product.images : [{ url: PLACEHOLDER_IMAGE }];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mb-6 text-sm">
        ← Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={images[activeImage]?.url || PLACEHOLDER_IMAGE}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
            <span className={`badge flex-shrink-0 ${CONDITION_COLORS[product.condition]}`}>{product.condition}</span>
          </div>

          <p className="text-3xl font-bold text-blue-600 mt-3">{formatPrice(product.price)}</p>

          <div className="flex flex-wrap gap-3 mt-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              🏷️ {product.category}
            </span>
            {product.location && (
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
                📍 {product.location}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1 rounded-full">
              👁️ {product.views} views
            </span>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
          </div>

          {/* Seller Info */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-3">Seller Information</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {product.seller?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.seller?.name}</p>
                {product.seller?.location && <p className="text-sm text-gray-500">📍 {product.seller.location}</p>}
              </div>
            </div>
            {product.seller?.phone && (
              <a href={`tel:${product.seller.phone}`} className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                📞 {product.seller.phone}
              </a>
            )}
            {product.seller?.email && (
              <a href={`mailto:${product.seller.email}`} className="mt-1 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                ✉️ {product.seller.email}
              </a>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-4">Listed on {formatDate(product.createdAt)}</p>

          {/* Owner Actions */}
          {isOwner && (
            <div className="mt-6 flex gap-3">
              <Link to={`/edit-listing/${product._id}`} className="btn-secondary flex-1 text-center text-sm">
                ✏️ Edit Listing
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="btn-danger flex-1 text-sm"
              >
                {deleting ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
