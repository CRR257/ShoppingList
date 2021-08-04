export interface ShoppingList {
 // filter(arg0: (event: any) => void);
  id: string;
  name: string;
  placeToBuyIt: string;
  isBuyed: boolean;
}

export interface NewShoppingItem {
  name: string;
  placeToBuyIt: string;
  isBuyed: boolean;
}
