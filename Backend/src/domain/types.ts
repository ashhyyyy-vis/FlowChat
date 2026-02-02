import { Document } from 'mongoose';

export type Gender = "male" | "female" | "other";

export type Preference = "male" | "female" | "any";
export interface IProfile extends Document {
  deviceId: string;
  nickName: string;
  shortBio: string;
  pronouns: string;
  verifiedGender: Gender;
  preferredPartnerGender: Preference;
}

export interface MatchRequest {
  deviceId: string;
  gender: Gender;
  preference: Preference;
}