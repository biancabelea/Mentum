import { gql, useMutation, useQuery } from '@apollo/client';

const MY_AVAILABILITY = gql`
  query {
    myAvailability {
      _id
      date
      duration
      isBooked
    }
  }
`;

const MENTOR_AVAILABILITY = gql`
  query MentorAvailability($mentorId: ID!) {
    mentorAvailability(mentorId: $mentorId) {
      _id
      date
      duration
      isBooked
    }
  }
`;

const ADD_AVAILABILITY = gql`
  mutation AddAvailability($input: AddAvailabilityInput!) {
    addAvailability(input: $input) {
      _id
      date
      duration
      isBooked
    }
  }
`;

const DELETE_AVAILABILITY = gql`
  mutation DeleteAvailability($id: ID!) {
    deleteAvailability(id: $id)
  }
`;

export const useMyAvailability = () => useQuery(MY_AVAILABILITY);
export const useMentorAvailability = (mentorId) =>
  useQuery(MENTOR_AVAILABILITY, { variables: { mentorId } });

export const useAddAvailability = () => useMutation(ADD_AVAILABILITY);
export const useDeleteAvailability = () => useMutation(DELETE_AVAILABILITY);
