import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  isFetching = signal(false);
  places = signal<Place[] | undefined>(undefined);
  error = signal<string | null>(null);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  private readonly placesService = inject(PlacesService);

  // constructor(private http: HttpClient) {}}

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this.placesService.loadAvailablePlaces().subscribe({
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

  onSelectPlace(selectedPlace: Place) {
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace.id).subscribe({
      next: (resData) => {
        console.log('Place selected successfully', resData);
      },
      error: (err: Error) => {
        console.error('Error selecting place:', err.message);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
