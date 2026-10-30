import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { CATEGORIES, CONDITIONS, getErrorMessage } from '../utils/constants';
import ImageUploader from '../components/ImageUploader';
import toast from 'react-hot-toast';

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'Good',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Category required';
    if (!form.condition) e.condition = 'Condition required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await productsAPI.create({
        ...form,
        price: Number(form.price)
      });
      toast.success('Listing created! 🎉');
      navigate(`/products/${data.product._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value })
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Listing</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input {...f('title')} className={`input-field ${errors.title ? 'border-red-400' : ''}`} placeholder="What are you selling?" maxLength={100} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea
            {...f('description')}
            rows={4}
            maxLength={2000}
            className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
            placeholder="Describe your item, its features, and why you're selling..."
          />
          <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/2000</p>
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        {/* Price & Condition */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price * ($)</label>
            <input
              type="number" min="0" step="0.01" {...f('price')}
              className={`input-field ${errors.price ? 'border-red-400' : ''}`}
              placeholder="0.00"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition *</label>
            <select {...f('condition')} className={`input-field ${errors.condition ? 'border-red-400' : ''}`}>
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Category & Location */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select {...f('category')} className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
              <option value="">Select category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input {...f('location')} className="input-field" placeholder="City, State" />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos</label>
          <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
