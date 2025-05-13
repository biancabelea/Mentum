import { useQuery, gql } from '@apollo/client';

const GET_COMMENTS = gql`
  query GetComments($resourceId: ID!) {
    comments(resourceId: $resourceId) {
      _id
      text
      createdAt
      author {
        name
      }
    }
  }
`;

export const useComments = (resourceId) => {
  const { data, loading, error, refetch } = useQuery(GET_COMMENTS, {
    variables: { resourceId },
    skip: !resourceId,
  });

  return {
    comments: data?.comments || [],
    loading,
    error,
    refetch,
  };
};
