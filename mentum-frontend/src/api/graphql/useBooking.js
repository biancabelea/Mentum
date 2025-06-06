import { gql, useMutation, useQuery } from '@apollo/client';

const BOOK_SLOT = gql`
  mutation BookSlot($input: BookSlotInput!) {
    bookSlot(input: $input) {
      _id
      date
      mentor { name }
      slot { _id date duration }
    }
  }
`;

const MY_BOOKINGS = gql`
  query {
    myBookings {
      _id
      slot { _id date duration isBooked mentor { name } }
    }
  }
`;

const CANCEL_BOOKING = gql`
  mutation CancelBooking($id: ID!) {
    cancelBooking(id: $id)
  }
`;

export const useMyBookings = () => useQuery(MY_BOOKINGS);
export const useBookSlot = () => useMutation(BOOK_SLOT);
export const useCancelBooking = () => useMutation(CANCEL_BOOKING);
