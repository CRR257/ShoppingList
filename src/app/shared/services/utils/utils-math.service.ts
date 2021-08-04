import { Injectable } from '@angular/core';

@Injectable()
export class UtilsMathService {
  constructor() {}

  sortItemsByName(item) {
    return item.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 :
      ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
  }

  sortItemsByName2(item) {
    return item.sort((a, b) => (a.name < b.name) ? -1 :
      ((a.name > b.name) ? 1 : 0));
  }

  sortItemsByBoughtProperty(item) {
    return item.sort((a, b) => (a.isBuyed < b.isBuyed) ? -1 : ((a.isBuyed > b.isBuyed) ? 1 : 0 ));
  }

}
