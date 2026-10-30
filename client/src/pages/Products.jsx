import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { CATEGORIES, CONDITIONS } from '../utils/constants';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '-createdAt');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (search) params.search = search;
    if (category) params.category = category;
    if (condition) params.condition = condition;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    try {
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, condition, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (condition) params.condition = condition;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setCondition('');
    setMinPrice(''); setMaxPrice(''); setSort('-createdAt'); setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <form onSubmit={handleFilter} className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
            <h2 className="font-bold text-gray-900 text-lg">Filters</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-sm">
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="input-field text-sm">
                <option value="">Any Condition</option>
                {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number" placeholder="Min" value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="input-field text-sm w-1/2" min="0"
                />
                <input
                  type="number" placeholder="Max" value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="input-field text-sm w-1/2" min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Sort By</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="input-field text-sm">
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-views">Most Viewed</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <button type="submit" className="btn-primary w-full text-sm">Apply Filters</button>
              <button type="button" onClick={clearFilters} className="btn-secondary w-full text-sm">Clear Filters</button>
            </div>
          </form>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600 text-sm">
              {loading ? 'Loading...' : `${pagination.total} product${pagination.total !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading ? (
            <Spinner text="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {products.map((p) => <ProductCard key={p._id} product={p} />)}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  <span className="flex items-center px-4 text-sm text-gray-600">
                    Page {page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= pagination.pages}
                    className="btn-secondary text-sm px-4 py-2 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
