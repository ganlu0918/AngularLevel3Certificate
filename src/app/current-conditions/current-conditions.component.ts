import { Component, inject, Signal } from '@angular/core';
import { WeatherService } from "../weather.service";
import { LocationService } from "../location.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from '../conditions-and-zip.type';
import { LocationOperation } from '../locationOperation.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent {

  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(zipcode: string) {
    this.locationService.locationOperationSubject.next(LocationOperation.remove(zipcode));
  }

  onCloseTab(tabNo: number) {
    const zipcode = this.currentConditionsByZip()[tabNo].zip;
    this.locationService.locationOperationSubject.next(LocationOperation.remove(zipcode));
  }
}
