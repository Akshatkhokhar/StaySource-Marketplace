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
export const deleteInquiry = async (id) => {
  const response = await api.delete(`/inquiries/${id}`);
  return response.data;
};
export const deleteMessage = async (inquiryId, replyId) => {
  const response = await api.delete(`/inquiries/${inquiryId}/messages/${replyId}`);
  return response.data;
};

export const markAsRead = async (id) => {
  const response = await api.patch(`/inquiries/${id}/read`);
  return response.data;
};
