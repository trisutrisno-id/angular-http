import { bootstrapApplication } from '@angular/platform-browser';
import {
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { AppComponent } from './app/app.component';
 
function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log('Request made:', req);

//   const reqWithHeaders = req.clone({
//     headers: req.headers.set('Custom-Header', 'CustomValue'),
//   });

  return next(req);
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor]) // Add your interceptors here if needed
    ),
  ],
}).catch((err) => console.error(err));
