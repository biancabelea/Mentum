import { gql, useLazyQuery } from '@apollo/client';

const SEARCH_MENTORS = gql`
  query SearchMentors($skills: [String!]!) {
    searchMentors(skills: $skills) {
      _id
      name
      email
      matchingSkills
      matchPercentage
    }
  }
`;

export function useMentorSearch() {
  const [searchMentorsQuery, { data, loading, error, called }] = useLazyQuery(SEARCH_MENTORS);

  const searchMentors = (skills) => {
    searchMentorsQuery({ variables: { skills } });
  };

  return {
    results: data?.searchMentors || [],
    loading,
    error,
    searched: called,
    searchMentors,
  };
}
