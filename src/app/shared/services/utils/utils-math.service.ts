import { Injectable } from '@angular/core';

@Injectable()
export class UtilsMathService {
  constructor() {}

  sortItemsByName(item) {
    return item.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 :
      ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
  }

  sortItemsById(item) {
    return item.sort((a, b) => (a.id < b.id) ? -1 :
      ((a.id > b.id) ? 1 : 0));
  }

  sortItemsByBoughtProperty(item) {
    return item.sort((a, b) => (a.isBought < b.isBought) ? -1 : ((a.isBought > b.isBought) ? 1 : 0 ));
  }

}
