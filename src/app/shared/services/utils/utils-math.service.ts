import { Injectable } from '@angular/core';

@Injectable()
export class UtilsMathService {
  constructor() {
  }

  sortItemsByName(item) {
    return item.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 :
      ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
  }

  sortItemsByNameBoughtProperty(item) {
    return item.sort((a, b) => Number(a.isBought) - Number(b.isBought) || a.name.localeCompare(b.name.toLowerCase()));
  }
}
