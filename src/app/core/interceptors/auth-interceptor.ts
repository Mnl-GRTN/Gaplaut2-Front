import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken');

  if (authToken) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: authToken
      }
    });
    return next(cloned);
  }

  return next(req);
};
