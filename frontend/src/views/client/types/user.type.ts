// const user = {
//   _id: '6098f5b516905536e818f8cc',
//   roles: ['User'],
//   email: 'user2@gmail.com',
//   name: 'Real user',
//   date_of_birth: null,
//   address: '',
//   phone: '',
//   createdAt: '2021-05-10T08:58:29.081Z',
//   updatedAt: '2021-05-10T08:58:29.081Z',
//   __v: 0
// }

type Role = 'User' | 'Admin'

export interface User {
  _id: string
  roles: string[]
  email: string
  name: string
  date_of_birth: null
  address: string
  phone: string
  createdAt: string
  updatedAt: string
  __v: number
}