import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../services/user.service';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  const username = inject(UserService).username();

  if (!username) {
    return next(req);
  }

  return next(req.clone({ setHeaders: { 'x-user': username } }));
};
