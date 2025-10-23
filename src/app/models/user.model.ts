export interface User {
  id: number;
  email: string;
  birthdate?: Date;
  fullname?: string;
  document: string;
}

export interface CreateUserRequest {
  email: string;
  birthdate?: string;
  password: string;
  fullname?: string;
  document: string;
}

export interface UpdateUserRequest {
  email?: string;
  birthdate?: string;
  password?: string;
  fullname?: string;
  document?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
