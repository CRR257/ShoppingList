export interface ShoppingListModel {
  id: string;
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
}

export interface CreateShoppingItemModel {
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
}

export interface ShoppingItemModel {
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
  supermarketId?: string;
  idShoppingList: string;
}

export interface UserShoppingListModel {
  [key: string]: ShoppingItemModel;
}
