export interface ShoppingList {
  id: string;
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
}

export interface NewShoppingItem {
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
}
