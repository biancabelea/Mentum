import { gql, useQuery } from '@apollo/client';

const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID) {
    userProfile(id: $id) {
      _id
      name
      email
      userRole
      userYear
      userSkills
      resources {
        _id
        title
        description
        fileUrl
      }
    }
  }
`;

export function useUserProfile(id) {
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { id },
  });

  return {
    userData: data?.userProfile || null,
    loading,
    error,
  };
}
