import { http, HttpHandler, HttpRequest } from "@architect/functions";

// Small wrapper to allow `Error` objects with `statusCode` prop to be thrown.
export const createHandler = (fn: HttpHandler) => {
  return http.async(async function wrapHandler(req: HttpRequest) {
    try {
      const res = await fn(req);
      return {
        ...res,
        cors: true,
      };
    } catch (error) {
      if (error.statusCode) {
        console.error(error);
        return {
          statusCode: error.statusCode,
          json: { message: error.message },
        };
      }
      throw error;
    }
  });
};
