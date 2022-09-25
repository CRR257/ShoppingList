import { Injectable } from '@angular/core';
import { ShoppingListModel } from '../../models/shoppingList.interface';

@Injectable()
export class UtilsMathService {
  constructor() {}

  sortItemsByName(item: ShoppingListModel[]) {
    return item.sort((a: ShoppingListModel, b: ShoppingListModel) =>
      a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : a.name.toLowerCase() > b.name.toLowerCase()
        ? 1
        : 0
    );
  }

  sortItemsByNameBoughtProperty(item: ShoppingListModel[]) {
    return item.sort(
      (a: ShoppingListModel, b: ShoppingListModel) =>
        Number(a.isBought) - Number(b.isBought) ||
        a.name.localeCompare(b.name.toLowerCase())
    );
  }
}
