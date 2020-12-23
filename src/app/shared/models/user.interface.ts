export interface User {
    uid?: string;
    email: string;
    password?: string;
    displayName?: string;
    photoURL?: string;
    emailVerified?: boolean;
}

export interface ShoppingList {
    filter(arg0: (event: any) => void);
    uid: string;
    nameItem: string;
    placeToBuyIt: string
}

export interface Id {
    id: string;
}

export interface NewItem {
    nameItem: string;
    placeToBuyIt: string
}