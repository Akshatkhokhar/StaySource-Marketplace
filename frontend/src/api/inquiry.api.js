import api from './axios';

export const createInquiry = async (inquiryData) => {
  const response = await api.post('/inquiries', inquiryData);
  return response.data;
};

export const getMyInquiries = async () => {
  const response = await api.get('/inquiries/my');
  return response.data;
};

export const replyToInquiry = async (id, message) => {
  const response = await api.post(`/inquiries/${id}/reply`, { message });
  return response.data;
};
