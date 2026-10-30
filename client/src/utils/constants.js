export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Furniture',
  'Books',
  'Sports',
  'Toys',
  'Vehicles',
  'Real Estate',
  'Food',
  'Services',
  'Other'
];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

export const CONDITION_COLORS = {
  New: 'bg-green-100 text-green-800',
  'Like New': 'bg-emerald-100 text-emerald-800',
  Good: 'bg-blue-100 text-blue-800',
  Fair: 'bg-yellow-100 text-yellow-800',
  Poor: 'bg-red-100 text-red-800'
};

export const CATEGORY_ICONS = {
  Electronics: '📱',
  Clothing: '👕',
  Furniture: '🛋️',
  Books: '📚',
  Sports: '⚽',
  Toys: '🧸',
  Vehicles: '🚗',
  'Real Estate': '🏠',
  Food: '🍎',
  Services: '🔧',
  Other: '📦'
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
};

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
};

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error?.message || 'An unexpected error occurred';
};

export const PLACEHOLDER_IMAGE = 'https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image';
