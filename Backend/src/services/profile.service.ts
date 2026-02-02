import Profile from '../models/profile';
import { Gender, Preference } from '../domain/types';

async function queryProfile(
  deviceId: string,
  nickName?: string,
  shortBio?: string,
  pronouns?: string,
  verifiedGender?: Gender,  // Updated type
  preferredPartnerGender?: Preference  // Updated type
) {
    const profile = await Profile.findOne({ deviceId });

    if (!profile) {
        return await Profile.create({
            deviceId,
            nickName,
            shortBio,
            pronouns,
            verifiedGender,
            preferredPartnerGender
        });
    }

    if (nickName !== undefined) {
        profile.nickName = nickName;
    }

    if (shortBio !== undefined) {
        profile.shortBio = shortBio;
    }

    if (pronouns !== undefined) {
        profile.pronouns = pronouns;
    }

    if (verifiedGender !== undefined) {
        profile.verifiedGender = verifiedGender;
    }

    if (preferredPartnerGender !== undefined) {
        profile.preferredPartnerGender = preferredPartnerGender;
    }

    await profile.save();
    return profile;
}

export default queryProfile;