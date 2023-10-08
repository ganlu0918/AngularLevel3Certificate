import { Injectable, OnDestroy } from '@angular/core';
import { } from "./weather.service";
import { Observable, ReplaySubject } from 'rxjs';
import { LocationOperation } from './locationOperation.type';
import { SubSink } from './utils/subsink';
import { AppUtil } from './utils/app-util';

export const LOCATIONS: string = "locations";



@Injectable()
export class LocationService implements OnDestroy {

  locations: string[] = [];
  locationOperationSubject: ReplaySubject<LocationOperation>;
  locationOperation$: Observable<LocationOperation>;
  private subs = new SubSink();

  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
    }
    //the location service is instantiated earlier than weater service 
    const n = (this.locations && this.locations.length > 0) ? this.locations.length : 1;
    this.locationOperationSubject = new ReplaySubject<LocationOperation>(n)
    this.locationOperation$ = this.locationOperationSubject.asObservable();

    for (let loc of this.locations) {
      this.locationOperationSubject.next(LocationOperation.takeFromStorage(loc));
    }

    this.subs.sink = this.locationOperation$.subscribe(operation => {
      if (LocationOperation.shouldAdd(operation)) {
        this.addLocation(operation.zipcode);
      } else if (LocationOperation.shouldRemove(operation)) {
        this.removeLocation(operation.zipcode);
      }
    });

  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    //this.locationOperationSubject.next(LocationOperation.add(zipcode));
  }

  removeLocation(zipcode: string) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      if (AppUtil.isEmpty(this.locations)) {
        localStorage.removeItem(LOCATIONS);
      }
      //this.locationOperationSubject.next(LocationOperation.remove(zipcode));

    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
