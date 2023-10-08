import { Component } from '@angular/core';
import { LocationService } from "../location.service";
import { LocationOperation } from '../locationOperation.type';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html'
})
export class ZipcodeEntryComponent {

  constructor(private locationService: LocationService) { }

  addLocation(zipcode: string) {
    this.locationService.locationOperationSubject.next(LocationOperation.add(zipcode));
  }

}
