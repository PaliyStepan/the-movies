import { api } from './client';
import type {
  IUserPublic,
  ILoginPayload,
  IRegisterPayload,
  IAuthResponse, IUpdateProfilePayload, IChangePasswordPayload
} from '@the-movies/shared';


export async function login(payload: ILoginPayload): Promise<IAuthResponse> {
  const { data } = await api.post<IAuthResponse>('/auth/login', payload);
  return data;
}

export async function register(payload: IRegisterPayload): Promise<IAuthResponse> {
  const { data } = await api.post<IAuthResponse>('/auth/register', payload);
  return data;
}

export async function refresh(): Promise<IAuthResponse> {
  const { data } = await api.post<IAuthResponse>('/auth/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<IUserPublic> {
  const { data } = await api.get<IUserPublic>('/auth/@me');
  return data;
}

export async function updateProfile(payload: IUpdateProfilePayload): Promise<IUserPublic> {
  const { data } = await api.patch<IUserPublic>('/auth/profile', payload);
  return data;
}

export async function changePassword(payload: IChangePasswordPayload): Promise<void> {
  await api.patch('/auth/password', payload);
}
