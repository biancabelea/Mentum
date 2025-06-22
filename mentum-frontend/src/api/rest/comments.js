import axios from 'axios';

export const getComments = async (resourceId) => {
  try {
    const response = await axios.get(`http://localhost:5000/comments/${resourceId}`);
    return response.data;
  } catch (error) {
    return [];
  }
};

export const useAddComment = () => {
  const postComment = async ({ resourceId, text, token }) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/comments',
        { text, resourceId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return { postComment };
};
