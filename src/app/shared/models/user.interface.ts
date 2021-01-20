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
    id: string;
    nameItem: string;
    placeToBuyIt: string;
    // checked: boolean;
}

// export interface ListItems {
//     id: String;
//     placeToBuyIt: String;
//     nameItem: String;
//     // checked: boolean;
// }

export interface Id {
    id: string;
}

export interface NewItem {
    nameItem: string;
    placeToBuyIt: string;
    // checked: false;
}
