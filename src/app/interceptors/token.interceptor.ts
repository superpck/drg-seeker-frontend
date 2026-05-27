import { HttpInterceptorFn } from '@angular/common/http';

import config from '../configs/config';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(config.tokenName);
  if (!token) {
    return next(request);
  }

  const authRequest = request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      [config.tokenName]: token
    }
  });

  return next(authRequest);
};
