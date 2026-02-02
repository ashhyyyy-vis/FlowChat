import mongoose from "mongoose";
import { IProfile } from "../domain/types";

const profileSchema = new mongoose.Schema({
    deviceId: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
    },
    shortBio: {
        type: String,
        required: true
    },
    pronouns: {
        type: String,
        required: true
    },
    verifiedGender: {
        type: String,
        enum: ["male", "female", "other", "any"] as const,
        required: true
    },
    preferredPartnerGender: {
        type: String,
        enum: ["male", "female", "other", "any"] as const,
        required: true
    }
});

export default mongoose.model<IProfile>("Profile", profileSchema);