'use server'

import axios from 'axios'
import nf from 'node-fetch'

export async function fetchData(url) {
  const fetchMethods = {
    fetch: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    },
    axios: async () => {
      const response = await axios.get(url);
      return response.data;
    },
    'node-fetch': async () => {
      const response = await nf(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    }
  };

  const results = new Map();

  await Promise.all(
    Object.entries(fetchMethods).map(async ([name, method]) => {
      try {
        const data = await method();
        results.set(name, { success: true, data });
      } catch (error) {
        console.error(`Error with ${name}:`, error);
        results.set(name, { success: false, error: error.message });
      }
    })
  );

  return results;
}