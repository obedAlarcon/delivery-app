import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { transformKeys, snakeToCamel } from '../utils/normalizers.util';

export const normalizeInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (event instanceof HttpResponse && event.body) {
        return event.clone({
          body: transformKeys(event.body, snakeToCamel)
        });
      }
      return event;
    })
  );
};