'use client'

import { useState } from 'react';
import { fetchData } from './actions/fetchData';

export default function Home() {
  const [url, setUrl] = useState('https://api.example.com/data');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await fetchData(url);
      // Convert Map to a plain object
      const resultObject = Object.fromEntries(result);
      setData(resultObject);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Fetch Data Example</h1>
      <div>
        <input 
          type="text" 
          value={url} 
          onChange={handleUrlChange} 
          placeholder="Enter URL to fetch"
          style={{ width: '300px', marginRight: '10px' }}
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {data && (
        <div>
          <h2>Response:</h2>
          <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px' }}>
            <code>{JSON.stringify(data, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
}