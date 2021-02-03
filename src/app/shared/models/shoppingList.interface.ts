export interface ShoppingList {
  filter(arg0: (event: any) => void);
  id: string;
  nameItem: string;
  placeToBuyIt: string;
  isBuyed: boolean;
}

export interface NewShoppingItem {
  nameItem: string;
  placeToBuyIt: string;
  isBuyed: boolean;
}
