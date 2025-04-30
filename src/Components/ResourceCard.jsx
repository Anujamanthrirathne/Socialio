import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../Config/api';

const fallbackImage = 'https://via.placeholder.com/400x250?text=No+Image';

const ResourceCard = () => {
  const [resources, setResources] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/learning-plans`);
        setResources(res.data || []);
      } catch (err) {
        console.error('Failed to load resources', err);
      }
    };
    fetchResources();
  }, []);

  const handleCardClick = (resource) => {
    setSelected(resource);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📘 Learning Resources</h2>

      {/* Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div
            key={resource._id}
            onClick={() => handleCardClick(resource)}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden cursor-pointer"
          >
            <div className="h-48 w-full overflow-hidden">
              <img
                src={resource.images?.[0] || fallbackImage}
                alt={resource.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{resource.name}</h3>
              <p className="text-sm text-gray-500">{resource.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selected.images?.[0] || fallbackImage}
              alt={selected.name}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{selected.name}</h3>
            <p className="text-sm text-gray-500 mb-1">{selected.subtitle}</p>
            <p className="text-gray-700 mb-4">{selected.description}</p>
            <p className="text-xs text-gray-400 mb-2">📅 Posted: {selected.postDate}</p>

            {selected.resourceLinks?.length > 0 && (
              <div className="mt-2 flex flex-col gap-2">
                {selected.resourceLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    🔗 Resource {index + 1}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;
