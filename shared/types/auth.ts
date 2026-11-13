export interface IJwtPayload {
  id: string
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IRegisterPayload extends ILoginPayload {
  name: string;
}

export interface IAuthResponse {
  accessToken: string;
}
