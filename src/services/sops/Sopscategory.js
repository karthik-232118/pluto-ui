import axios from 'axios';
import { BASE_URL, ENDPOINT_URL } from '../../config/urlConfig';

export const fetchSopsCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}${ENDPOINT_URL.sops.allCategoryName}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching SOPs categories');
  }
};
