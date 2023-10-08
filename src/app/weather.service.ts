import { Inject, Injectable, OnDestroy, Signal, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { CurrentConditions } from './current-conditions/current-conditions.type';
import { ConditionsAndZip } from './conditions-and-zip.type';
import { Forecast } from './forecasts-list/forecast.type';
import { LocationService } from './location.service';
import { LocationOperation } from './locationOperation.type';
import { SubSink } from './utils/subsink';
import { CacheData } from './cache/cache.decorator';
import { DEFAULT_CACHE_DURATION } from './cache/cache.type';
import { tap } from 'rxjs/operators';

@Injectable()
export class WeatherService implements OnDestroy {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private subs = new SubSink();

  constructor(
    private http: HttpClient,
    private locationService: LocationService) {
    this.subs.sink = this.locationService.locationOperation$.subscribe((operation: LocationOperation) => {
      if (LocationOperation.shouldAdd(operation) || LocationOperation.isTakenFromStorage(operation)) {
        this.fetchCurrentConditions(operation.zipcode).subscribe((data: CurrentConditions) => {
          this.currentConditions.mutate(conditions => conditions.push({ zip: operation.zipcode, data }));
        });
      }
      else if (LocationOperation.shouldRemove(operation)) {
        this.removeCurrentConditions(operation.zipcode)
      }
    });

  }

  @CacheData({ cacheDuration: DEFAULT_CACHE_DURATION })
  private fetchCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    const url = WeatherService.URL + '/weather?zip=' + zipcode + ',us&units=imperial&APPID=' + WeatherService.APPID;
    return this.http.get<CurrentConditions>(url)
      .pipe(tap(() => console.log('fetch CurrentConditions from url')));
  }

  private removeCurrentConditions(zipcode: string) {
    this.currentConditions.mutate(conditions => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode)
          conditions.splice(+i, 1);
      }
    })
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }


  @CacheData({ cacheDuration: DEFAULT_CACHE_DURATION })
  getForecast(zipcode: string): Observable<Forecast> {
    const url = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    return this.http.get<Forecast>(url)
      .pipe(tap(() => console.log('get Forecast from url')));

  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
