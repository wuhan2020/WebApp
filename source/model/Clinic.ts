import { VerifiableData, VerifiableModel } from './BaseModel';
import { Organization } from '../service';

export type Clinic = VerifiableData &
    Organization &
    Partial<Record<'name' | 'startTime' | 'endTime', string>>;

export class ClinicModel extends VerifiableModel<Clinic> {
    baseURI = '/clinic/';
}
