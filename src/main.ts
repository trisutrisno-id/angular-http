import { bootstrapApplication } from '@angular/platform-browser';
import {
  HttpEventType,
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { tap } from 'rxjs';

function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  console.log('Request made:', req);

  //   const reqWithHeaders = req.clone({
  //     headers: req.headers.set('Custom-Header', 'CustomValue'),
  //   });

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          console.log('[Incoming Response]');
          console.log('Response received:', event.status);
          console.log('Response received:', event.body);
        }
      },
      error: (error) => {
        console.error('Error occurred:', error);
      },
    })
  );
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(
      withInterceptors([loggingInterceptor]) // Add your interceptors here if needed
    ),
  ],
}).catch((err) => console.error(err));
