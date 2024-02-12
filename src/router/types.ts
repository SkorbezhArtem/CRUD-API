import { IUser } from '../usersApi/types';
import UsersApiResponse from '../UsersApiResponse/UsersApiResponse';

export type RouteCallback = (
  userId: string,
  body: IUser | undefined
) => UsersApiResponse;

export type Route = {
  [key: string]: RouteCallback;
};

export type MethodType = 'get' | 'post' | 'put' | 'delete';

export type Routes = {
  [key in MethodType]: Route;
};
