import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CACHE_DURATION_KEY, DEFAULT_CACHE_DURATION } from '../cache/cache.type';
import { AppUtil } from 'app/utils/app-util';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'app/utils/subsink';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit, OnDestroy {

  cacheDurationControl = new FormControl<string>('');
  private subs = new SubSink();

  ngOnInit() {
    let cacheDuration: string = localStorage.getItem(CACHE_DURATION_KEY);
    cacheDuration = AppUtil.isAPositiveNumber(cacheDuration) ? cacheDuration : DEFAULT_CACHE_DURATION.toString();
    this.cacheDurationControl.setValue(cacheDuration);

    this.cacheDurationControl.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe((cacheDuration) => {
        if (AppUtil.isAPositiveNumber(cacheDuration)) {
          localStorage.setItem(CACHE_DURATION_KEY, cacheDuration);
        }
      });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }



}
