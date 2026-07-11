import { InternalServerError, MethodNotAllowedError } from "infra/errors.js";

function onNoMatchhandler(request, response) {
  const publicErrorObject = new MethodNotAllowedError();
  response.status(publicErrorObject.statusCode).json(publicErrorObject);
}

function onErrorHandler(error, request, response) {
  const publicErrorObject = new InternalServerError({
    statusCode : error.statusCode,
    cause: error,
  });
  
  console.log(publicErrorObject);

  response.status(publicErrorObject.statusCode).json({ publicErrorObject });
}

const controller = {
    errorHandlers: {
        onNoMatch: onNoMatchhandler,
        onError: onErrorHandler,
    }
};

export default controller;