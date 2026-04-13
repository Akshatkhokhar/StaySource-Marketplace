import api from './axios';

export const addReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getVendorReviews = async (vendorId) => {
  const response = await api.get(`/reviews/vendor/${vendorId}`);
  return response.data;
};
