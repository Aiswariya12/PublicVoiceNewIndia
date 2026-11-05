import { request } from './client';

export async function searchLocationsApi(query) {
  return request(`/locations/search?q=${encodeURIComponent(query || '')}`, {
    method: 'GET',
  });
}
