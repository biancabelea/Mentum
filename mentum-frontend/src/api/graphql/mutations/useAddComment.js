import { useMutation, gql } from '@apollo/client';

const ADD_COMMENT = gql`
  mutation AddComment($input: CommentInput!) {
    addComment(input: $input) {
      _id
      text
      createdAt
      author {
        name
      }
    }
  }
`;

export const useAddComment = () => {
  const [addComment, { data, loading, error }] = useMutation(ADD_COMMENT);

  return {
    addComment,
    data,
    loading,
    error,
  };
};
