import api from './axios';

export const getAllVendors = async (page = 1, limit = 10) => {
  const response = await api.get(`/vendors?page=${page}&limit=${limit}`);
  return response.data;
};

export const getVendorById = async (id) => {
  const response = await api.get(`/vendors/${id}`);
  return response.data;
};

export const getMyVendorProfile = async () => {
  const response = await api.get('/vendors/my/profile');
  return response.data;
};

export const createVendor = async (vendorData) => {
  const response = await api.post('/vendors', vendorData);
  return response.data;
};

export const updateVendor = async (id, vendorData) => {
  const response = await api.put(`/vendors/${id}`, vendorData);
  return response.data;
};

export const deleteVendor = async (id) => {
  const response = await api.delete(`/vendors/${id}`);
  return response.data;
};

export const saveVendor = async (id) => {
  const response = await api.post(`/vendors/${id}/save`);
  return response.data;
};

export const getSavedVendors = async () => {
  const response = await api.get('/vendors/saved/list');
  return response.data;
};
