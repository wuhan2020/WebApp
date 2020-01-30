import { DataItem, Contact, User } from '../HTTPService';

export interface Factory extends DataItem {
    name?: string;
    certificate?: string;
    address?: string;
    category?: string;
    capability?: string;
    contacts?: Contact[];
    creator?: User;
}
