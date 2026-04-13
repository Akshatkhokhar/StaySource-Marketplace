import api from './axios';

export const searchVendors = async (filters) => {
  // filters object: { category, state, city, keyword, page, limit }
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.state) params.append('state', filters.state);
  if (filters.city) params.append('city', filters.city);
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);
  
  const response = await api.get(`/search/vendors?${params.toString()}`);
  return response.data;
};
