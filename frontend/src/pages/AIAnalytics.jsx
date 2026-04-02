import { useState, useEffect } from 'react';
import { authFetch } from '../utils/api';

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await authFetch('/api/v1/ai/analytics');
        const data = await res.json();
        if (data.success) {
          setAnalytics(data.data);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error('Failed to fetch AI analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">

      <h2 className="text-white text-lg mb-6">
        Performance Analytics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(analytics).map(([key, value]) => (
          <div key={key} className="card-dark p-6 text-center">
            <h3 className="text-gray-400 text-sm">{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
            <p className="text-white text-2xl font-bold mt-2">{value}%</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default AIAnalytics;