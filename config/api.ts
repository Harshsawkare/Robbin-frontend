/**
 * API Configuration
 * 
 * To configure the backend URL:
 * 1. Create a .env.local file in the root directory
 * 2. Add: NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
 * 
 * For production, set the environment variable in your deployment platform
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  events: `${API_BASE_URL}/api/events`,
  incidents: `${API_BASE_URL}/api/incidents`,
  incidentById: (id: string) => `${API_BASE_URL}/api/incidents/${id}`,
  generateIncident: `${API_BASE_URL}/api/incidents/from-events`,
  generatePostmortem: (id: string) => `${API_BASE_URL}/api/incidents/${id}/postmortem`,
  postmortems: `${API_BASE_URL}/api/postmortems`,
  postmortemById: (id: string) => `${API_BASE_URL}/api/postmortems/${id}`,
};
