import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  // constructor(private http: HttpClient) {}} 

  ngOnInit(){
    const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places').subscribe({
      next: (resData) => {
        console.log("🚀 ~ AvailablePlacesComponent ~ ngOnInit ~ places:", resData.places)
      },
      error: (err) => {
        console.error('Error fetching places:', err);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
