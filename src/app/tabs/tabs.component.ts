

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit,
  Output, EventEmitter
} from '@angular/core';

import { TabComponent } from './tab.component';


@Component({
  selector: 'app-tabs',
  templateUrl:'./tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;
  @Output() onCloseTab = new EventEmitter<number>();

  constructor() { }

  ngAfterContentInit() {
    const activeTabs = this.tabs.filter(tab => tab.active);
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }


  selectTab(tab: TabComponent) {
    this.tabs.toArray().forEach(tab => (tab.active = false));
    if (tab) {
      tab.active = true;
    }
  }

  closeStaticTab(tab: TabComponent) {
    const arrayTabs = this.tabs.toArray();
    for (let tabNo = 0; tabNo < arrayTabs.length; tabNo++) {
      if (arrayTabs[tabNo] === tab) {
        this.onCloseTab.emit(tabNo);
      }
    }
  }

}
