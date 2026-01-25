const API_BASE = 'http://localhost:5000'; // backend API base URL

function getToken() { return localStorage.getItem('token'); }
function setToken(t) { if (t) localStorage.setItem('token', t); else localStorage.removeItem('token'); }

async function apiFetch(path, method='GET', body=null) {
  const headers = {};
  if (!(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined)
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch(e){ return text; }
}

// Socket.io connection
const socket = io(API_BASE);

// Export socket for use in other scripts
window.socket = socket;
