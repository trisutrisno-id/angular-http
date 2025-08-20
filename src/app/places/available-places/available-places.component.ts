import { Component, signal, inject, OnInit, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { map } from 'rxjs';

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
  private readonly httpClient = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  // constructor(private http: HttpClient) {}} 

  ngOnInit(){
    this.isFetching.set(true);
    const subscription = this.httpClient.get<{places: Place[]}>('http://localhost:3000/places')  
    .pipe( 
      map((resData) => resData.places)
    )
    .subscribe({
      next: (places) => {
        this.places.set(places || []);
      },
      error: (err) => {
        console.error('Error fetching places:', err);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

}
