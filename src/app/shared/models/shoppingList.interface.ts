export interface ShoppingList {
  id: string;
  name: string;
  placeToBuyIt: string;
  isBought: boolean;
}

export interface NewShoppingItem {
  name: string;
  // productName: string;
  supermarketName?: string;
  placeToBuyIt: string;
  supermarketId: number;
  isBought: boolean;
}
