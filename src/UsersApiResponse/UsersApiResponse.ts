import { IUser } from '../usersApi/types';

type DataType = IUser | IUser[] | string;

class UsersApiResponse {
  constructor(public status: number, public data?: DataType) {}
}

export default UsersApiResponse;
