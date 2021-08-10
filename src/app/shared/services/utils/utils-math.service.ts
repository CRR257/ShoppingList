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
    const sortByName = item[1].sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 :
      ((a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0));
    return sortByName.sort((a, b) => (a.isBought < b.isBought) ? -1 : ((a.isBought > b.isBought) ? 1 : 0 ));
  }
}
