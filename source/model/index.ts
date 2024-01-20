import { Session } from './Session';
import { UserModel } from './User';
import { SuppliesRequirementModel } from './SuppliesRequirement';
import { LogisticsModel } from './Logistics';
import { HotelModel } from './Hotel';
import { ClinicModel } from './Clinic';
import { DonationRecipientModel } from './DonationRecipient';
import { FactoryModel } from './Factory';
import { AreaModel } from './Area';

export const session = new Session();
export const user = new UserModel();
export const suppliesRequirement = new SuppliesRequirementModel();
export const logistics = new LogisticsModel();
export const hotel = new HotelModel();
export const clinic = new ClinicModel();
export const donationRecipient = new DonationRecipientModel();
export const factory = new FactoryModel();
export const area = new AreaModel();

export * from './Session';
export * from './BaseModel';
export * from './SuppliesRequirement';
export * from './Factory';
export * from './Logistics';
export * from './Hotel';
export * from './Clinic';
export * from './DonationRecipient';
