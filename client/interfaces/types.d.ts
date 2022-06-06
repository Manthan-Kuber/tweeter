interface User {
  id: string;
  email: string;
}

interface authState {
  user: User | null;
  token: string | null;
}

interface UserResponse {
  user: User;
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}
