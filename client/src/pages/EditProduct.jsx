import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api';
import { useAuth } from '../context/AuthContext';
import { CATEGORIES, CONDITIONS, getErrorMessage } from '../utils/constants';
import ImageUploader from '../components/ImageUploader';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    productsAPI.getOne(id)
      .then(({ data }) => {
        const p = data.product;
        if (p.seller?._id !== user?._id) {
          toast.error('Not authorized to edit this listing');
          navigate('/my-listings');
          return;
        }
        setForm({
          title: p.title,
          description: p.description,
          price: String(p.price),
          category: p.category,
          condition: p.condition,
          location: p.location || '',
          status: p.status,
          images: p.images || []
        });
      })
      .catch(() => navigate('/404'))
      .finally(() => setLoading(false));
  }, [id, user, navigate]);

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = 'Title must be at least 3 characters';
    if (!form.description || form.description.length < 10) e.description = 'Description must be at least 10 characters';
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Category required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await productsAPI.update(id, { ...form, price: Number(form.price) });
      toast.success('Listing updated!');
      navigate(`/products/${id}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><Spinner size="lg" /></div>;
  if (!form) return null;

  const f = (key) => ({
    value: form[key],
    onChange: (e) => setForm({ ...form, [key]: e.target.value })
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input {...f('title')} className={`input-field ${errors.title ? 'border-red-400' : ''}`} maxLength={100} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea {...f('description')} rows={4} maxLength={2000} className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`} />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price ($) *</label>
            <input type="number" min="0" step="0.01" {...f('price')} className={`input-field ${errors.price ? 'border-red-400' : ''}`} />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Condition *</label>
            <select {...f('condition')} className="input-field">
              {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
            <select {...f('category')} className={`input-field ${errors.category ? 'border-red-400' : ''}`}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <input {...f('location')} className="input-field" placeholder="City, State" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
          <select {...f('status')} className="input-field">
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Photos</label>
          <ImageUploader images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
          <button type="submit" disabled={saving} className="btn-primary flex-1">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
