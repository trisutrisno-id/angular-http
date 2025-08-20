import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { Place } from '../place.model';
import { PlacesService } from '../places.service';

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
  private readonly destroyRef = inject(DestroyRef);

  private readonly placesService = inject(PlacesService);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadUserPlaces().subscribe({
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
