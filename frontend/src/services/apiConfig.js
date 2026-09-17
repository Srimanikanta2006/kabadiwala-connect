/**
 * Kabadiwala Connect - Central API Configuration
 * Defaults to the live Render backend deployment if VITE_API_URL is not provided.
 */

export const API_BASE = (import.meta.env.VITE_API_URL || 'https://kabadiwala-connect-0qvy.onrender.com').replace(/\/+$/, '');
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || `${API_BASE}/api/v1`).replace(/\/+$/, '');
