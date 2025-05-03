import { useQuery, gql } from '@apollo/client';

const GET_RESOURCES = gql`
  query GetResources($search: String) {
    resources(search: $search) {
      _id
      title
      description
      fileUrl
      uploadedBy {
        _id
        name
      }
    }
  }
`;

export function useResources({ search = '' } = {}) {
  const { data, loading, error } = useQuery(GET_RESOURCES, {
    variables: { search },
  });

  return {
    resources: data?.resources || [],
    loading,
    error,
  };
}
