import axios from 'axios';

const API_BASE_URL = 'http://10.7.7.39:754';

export const getRute = async (endpoint: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer UmpWek5uWXhVR05STVRCbU5qQkthRzkwUkhBeFYzZzVRbU5COjE6MQ==',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getRute data:', error);
    throw error;
  }
};

export const postData = async (endpoint: string, data: object) => {
  try {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer UmpWek5uWXhVR05STVRCbU5qQkthRzkwUkhBeFYzZzVRbU5COjE6MQ==',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Server responded with error:', error.response.data);
    throw error;
  }
};

export const getData = async (endpoint: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer UmpWek5uWXhVR05STVRCbU5qQkthRzkwUkhBeFYzZzVRbU5COjE6MQ==',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error getRute data:', error);
    throw error;
  }
};
