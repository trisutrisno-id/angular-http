import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit {

    isFetching = signal(false);
    places = signal<Place[] | undefined>(undefined);
    error = signal<string | null>(null);
    private readonly httpClient = inject(HttpClient);
    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
      this.isFetching.set(true);
      const subscription = this.httpClient
        .get<{ places: Place[] }>('http://localhost:3000/user-places')
        .pipe(
          map((resData) => resData.places),
          catchError((error) => {
            return throwError(
              () => new Error('Failed to fetch places your favorite places. Please try again later')
            );
          })
        )
        .subscribe({
          next: (places) => {
            this.places.set(places || []);
          },
          error: (err: Error) => {
            this.error.set(err.message);
          },
          complete: () => {
            this.isFetching.set(false);
          },
        });
  
      this.destroyRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
}
