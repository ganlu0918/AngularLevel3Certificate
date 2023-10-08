import { Component, OnInit } from '@angular/core';
import { CACHE_DURATION_KEY, DEFAULT_CACHE_DURATION } from '../cache/cache.type';
import { AppUtil } from 'app/utils/app-util';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html'
})
export class MainPageComponent implements OnInit {
  cacheDuration = DEFAULT_CACHE_DURATION;

  ngOnInit() {
    const cacheDurationString: string = localStorage.getItem(CACHE_DURATION_KEY);
    if (AppUtil.isAPositiveNumber(cacheDurationString)) {
      this.cacheDuration = +cacheDurationString;
    }
  }

  onBlur(cacheDuration: string) {
    if (AppUtil.isAPositiveNumber(cacheDuration)) {
      localStorage.setItem(CACHE_DURATION_KEY, cacheDuration);
    }
  }

}
