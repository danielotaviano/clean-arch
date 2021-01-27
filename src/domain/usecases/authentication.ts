export type AuthRequest = {
  email:string
  password:string
}

export interface Authentication {
  auth (authData: AuthRequest): Promise<string>
}
