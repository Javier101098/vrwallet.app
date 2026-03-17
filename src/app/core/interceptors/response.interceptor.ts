import { HttpInterceptorFn, HttpResponse} from '@angular/common/http';
import {map} from "rxjs";

export const responseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map((event) => {
      if (
        event instanceof HttpResponse &&
        (event.body as Record<string, unknown>)?.['data'] !== undefined
      ) {
        return event.clone({ body: (event.body as Record<string, unknown>)['data'] });
      }
      return event;
    })
  )
};
