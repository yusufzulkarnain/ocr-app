import axios from 'axios';
import Toast from 'react-native-toast-message';

const API_BASE_URL = 'http://10.7.7.39:754';
const API_BASE_URL_KOP = 'https://fakestoreapi.com/';
const API_BASE_URL_KOPERASI = 'http://103.245.39.149:3006';
const API_NFC_URL = 'https://aksides.id/api/';
// const API_BASE_URL_KOPERASI = 'http://192.168.100.240:3006'; // local

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

export const getProduct = async (endpoint: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL_KOP}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error getProduct data:', error);
    throw error;
  }
};

export const postDataKoperasi = async (endpoint: string, data: object) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL_KOPERASI}${endpoint}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Terjadi kesalahan';

    throw new Error(errorMessage);
  }
};

export const putDataKoperasi = async (endpoint: string, data: object) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL_KOPERASI}${endpoint}`,
      data,
    );
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Terjadi kesalahan';

    throw new Error(errorMessage);
  }
};


export const getSaldo = async (endpoint: any) => {
  try {
    const response = await axios.get(`${API_NFC_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error getProduct data:', error);
    throw error;
  }
};

export const postKurangiSaldo = async (endpoint: string, data: object) => {
  try {
    const response = await axios.post(`${API_NFC_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json',
        // Authorization:
        //   'Bearer UmpWek5uWXhVR05STVRCbU5qQkthRzkwUkhBeFYzZzVRbU5COjE6MQ==',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Server responded with error:', error.response.data);
    throw error;
  }
};