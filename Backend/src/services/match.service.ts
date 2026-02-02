import { dequeueUser, Gender } from "./queue.service";
import redisClient from "../config/redis";
import genlimits from "../utils/constant";
type Preference = "male" | "female" | "other" | "any";

interface MatchRequest {
deviceId: string;
gender: Gender;
preference: Preference;
}

async function getCandidates(
gender: Gender,
limit = genlimits
): Promise<string[]> {
const key = queueKey(gender);

// ZRANGE returns members ordered by score (oldest first)
return await redisClient.zRange(key, 0, limit - 1);
}

export async function findMatch(
requester: MatchRequest
): Promise<string | null> {
const { deviceId, gender, preference } = requester;

// 1. Determine which genders we are allowed to match with
let preferredGenders: Gender[] = [];

if (preference !== "any") {
    preferredGenders = [preference];
} else {
    // "any" is fallback only
    preferredGenders = ["male", "female", "other"];
}

// 2. Try explicit preference first
for (const targetGender of preferredGenders) {
    const candidates = await getCandidates(targetGender);

    for (const candidateId of candidates) {
    if (candidateId === deviceId) continue;

    // Found a match
    await dequeueUser(deviceId, gender);
    await dequeueUser(candidateId, targetGender);

    return candidateId;
    }
}

// 3. No match found
return null;
}

