import { useState, useCallback } from 'react';
import { uploadAPI } from '../api';
import toast from 'react-hot-toast';
import { PLACEHOLDER_IMAGE } from '../utils/constants';

const ImageUploader = ({ images = [], onChange }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images per listing');
      return;
    }

    setUploading(true);
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const { data } = await uploadAPI.uploadImage(formData);
        uploaded.push(data.image);
      } catch (err) {
        toast.error(`Failed to upload ${file.name}: ${err?.response?.data?.message || 'Upload error'}`);
      }
    }

    if (uploaded.length > 0) {
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} image(s) uploaded`);
    }
    setUploading(false);
    e.target.value = '';
  }, [images, onChange]);

  const removeImage = useCallback((index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  }, [images, onChange]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
        {images.map((img, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
            <img
              src={img.url}
              alt={`Product image ${i + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = PLACEHOLDER_IMAGE; }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition-colors"
              aria-label="Remove image"
            >
              ×
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">Primary</span>
            )}
          </div>
        ))}

        {images.length < 5 && (
          <label className={`relative aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="sr-only"
            />
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            ) : (
              <>
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500 mt-1">Add Photo</span>
              </>
            )}
          </label>
        )}
      </div>
      <p className="text-xs text-gray-400">Up to 5 images • JPEG, PNG, WebP • Max 5MB each</p>
    </div>
  );
};

export default ImageUploader;
