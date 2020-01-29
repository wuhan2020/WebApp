import { Contact } from '../SuppliesRequirement';
import { DataItem } from '../HTTPService';

export interface Factory extends DataItem {
    name?: string;
    certificate?: string;
    address?: string;
    category?: string;
    capability?: string;
    contacts?: Contact[];
}
