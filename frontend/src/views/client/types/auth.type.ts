
import { SuccesRessponse } from './ultils.type'
import { User } from './user.type'


export type AuthRespon = SuccesRessponse<{
  access_token: string
  expires: string
  user: User
}>