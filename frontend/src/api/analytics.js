import { request } from './client';

export async function getAnalyticsSummaryApi() {
  return request('/analytics/summary', {
    method: 'GET',
  });
}
