import { request } from './client';

export async function getAllIssuesApi() {
  return request('/issues', {
    method: 'GET',
  });
}

export async function createIssueApi(data) {
  return request('/issues', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateIssueStatusApi(id, status) {
  return request(`/issues/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}
