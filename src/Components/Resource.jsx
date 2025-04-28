import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { uploadToCloudinary } from '../../../Utils/uploadToCloudinary';
import { API_BASE_URL } from '../../../Config/api';
import { Plus, X, Edit, Trash2 } from 'lucide-react';

const Resource = () => {
  const [resources, setResources] = useState([]);
  const [editingResource, setEditingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    
    subtitle: '',
    description: '',
    resourceLinks: '',
    file: null,
    images: [],
    postDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/learning-plans`);
      setResources(response.data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFormData({ ...formData, file: selectedFile });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const today = new Date().toISOString().split('T')[0];
    if (formData.postDate > today) {
      setErrors({ postDate: 'Post date cannot be in the future.' });
      setLoading(false);
      return;
    }

    let imageUrls = [...formData.images];
    if (formData.file) {
      try {
        const uploadedUrl = await uploadToCloudinary(formData.file);
        imageUrls.push(uploadedUrl);
      } catch (error) {
        alert('Error uploading file');
        setLoading(false);
        return;
      }
    }

    const payload = {
      name: formData.name,
      subtitle: formData.subtitle,
      description: formData.description,
      resourceLinks: formData.resourceLinks.split(',').map(link => link.trim()),
    };

    try {
      if (editingResource) {
        await axios.put(`${API_BASE_URL}/api/learning-plans/${editingResource.id}`, payload);
        alert('Resource updated!');
      } else {
        await axios.post(`${API_BASE_URL}/api/learning-plans`, payload);
        alert('Resource created!');
      }

      resetForm();
      fetchResources();
      setShowForm(false);
    } catch (error) {
      alert('Error saving resource');
    }

    setLoading(false);
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name || '',
      subtitle: resource.subtitle || '',
      description: resource.description || '',
      resourceLinks: (resource.resourceLinks || []).join(', '),
      file: null,
      images: resource.images || [],
      postDate: resource.postDate || '',
    });
    setErrors({});
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/learning-plans/${id}`);
      fetchResources();
    } catch (error) {
      alert('Error deleting resource');
    }
  };

  const resetForm = () => {
    setEditingResource(null);
    setFormData({
      name: '',
      subtitle: '',
      description: '',
      resourceLinks: '',
      file: null,
      images: [],
      postDate: '',
    });
    setErrors({});
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📚 Resources</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            resetForm();
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? 'Cancel' : 'Add Resource'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block font-medium">Name</label>
              <input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full mt-1 border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="subtitle" className="block font-medium">Subtitle</label>
              <input
                id="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block font-medium">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full mt-1 border border-gray-300 p-2 rounded"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="resourceLinks" className="block font-medium">Resource Links (comma-separated)</label>
              <input
                id="resourceLinks"
                value={formData.resourceLinks}
                onChange={handleInputChange}
                className="w-full mt-1 border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="file" className="block font-medium">Upload Image/Video</label>
              <input
                id="file"
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="postDate" className="block font-medium">Post Date</label>
              <input
                id="postDate"
                type="date"
                value={formData.postDate}
                onChange={handleInputChange}
                required
                className="w-full mt-1 border border-gray-300 p-2 rounded"
              />
              {errors.postDate && <p className="text-red-500 text-sm">{errors.postDate}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {loading ? 'Saving...' : editingResource ? 'Update Resource' : 'Create Resource'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Subtitle</th>
              <th className="px-4 py-2 border">Post Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 border">{res.name}</td>
                <td className="px-4 py-2 border">{res.subtitle}</td>
                <td className="px-4 py-2 border">{res.postDate}</td>
                <td className="px-4 py-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(res)}
                    className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {resources.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No resources found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resource;
