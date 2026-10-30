import { Link } from 'react-router-dom';
import { formatPrice, CONDITION_COLORS, PLACEHOLDER_IMAGE } from '../utils/constants';

const ProductCard = ({ product }) => {
  const primaryImage = product.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const conditionClass = CONDITION_COLORS[product.condition] || 'bg-gray-100 text-gray-700';

  return (
    <Link to={`/products/${product._id}`} className="card group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={primaryImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className={`badge ${conditionClass}`}>{product.condition}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-2xl font-bold text-blue-600 mt-1">{formatPrice(product.price)}</p>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {product.category}
          </span>
          {product.location && (
            <span className="flex items-center gap-1 truncate ml-2">
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {product.location}
            </span>
          )}
        </div>
        {product.seller?.name && (
          <p className="text-xs text-gray-400 mt-2">by {product.seller.name}</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
