import { gql, useMutation } from '@apollo/client';

const ADD_RESOURCE = gql`
  mutation AddResource($input: AddResourceInput!) {
    addResource(input: $input) {
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

export function useAddResource() {
  const [addResourceMutation, { data, loading, error }] = useMutation(ADD_RESOURCE);

  const addResource = async (input) => {
    const res = await addResourceMutation({ variables: { input } });
    return res.data?.addResource;
  };

  return { addResource, loading, error };
}
