import { gql, useMutation } from '@apollo/client';

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        email
      }
    }
  }
`;

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      message
    }
  }
`;

export function useLogin() {
  const [loginMutation, { loading, error }] = useMutation(LOGIN);

  const login = async ({ email, password }) => {
    const res = await loginMutation({ variables: { email, password } });
    const { token, user } = res.data.login;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', user.email);
    return res.data.login;
  };

  return { login, loading, error };
}

export function useRegister() {
  const [registerMutation, { loading, error }] = useMutation(REGISTER);

  const register = async (input) => {
    const res = await registerMutation({ variables: { input } });
    return res.data.register;
  };

  return { register, loading, error };
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.reload();
  }
  
  export function isLoggedIn() {
    return !!localStorage.getItem('token');
  }
  