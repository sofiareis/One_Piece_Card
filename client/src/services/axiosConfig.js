import axios from 'axios';

// Add response interceptors
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
        // Token has expired, log the user out.
        await axios.get('/logout');
        alert("Session expired. Please login again");
        window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default axios;