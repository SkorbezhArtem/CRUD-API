enum MessageKeys {
  IncorrectUuid = 'incorrectUuid',
  ServerError = 'serverError',
  IncorrectEndpoint = 'incorrectEndpoint',
  RequiredFields = 'requiredFields',
  InvalidFields = 'invalidFields',
  UserNotFound = 'userNotFound',
}

type Messages = {
  [key in MessageKeys]: string;
};

export const messages: Messages = {
  [MessageKeys.IncorrectUuid]: 'Incorrect uuid',
  [MessageKeys.ServerError]: 'Server error',
  [MessageKeys.IncorrectEndpoint]: 'Incorrect endpoint',
  [MessageKeys.RequiredFields]: 'Body does not contain required fields',
  [MessageKeys.InvalidFields]: 'Body contains invalid types of fields',
  [MessageKeys.UserNotFound]: 'User with id {userId} is not found',
};
