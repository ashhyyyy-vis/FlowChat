// src/utils/validators/onboarding.validator.ts
import { Gender, Preference } from "../../domain/types";
type OnboardingInput = {
  nickName?: string
  shortBio?: string
  pronouns?: string
  preferredPartnerGender?: string
}

const ALLOWED_PARTNER_GENDERS = ['male', 'female', 'any']

export function validateOnboardingInput(input: OnboardingInput) {
  if (!input.nickName || typeof input.nickName !== 'string') {
    return 'Nickname is required'
  }

  if (input.nickName.length < 2 || input.nickName.length > 30) {
    return 'Nickname must be between 2 and 30 characters'
  }

  if (input.shortBio && input.shortBio.length > 150) {
    return 'Bio must be under 150 characters'
  }

  if (input.pronouns && typeof input.pronouns !== 'string') {
    return 'Pronouns must be a string'
  }

  if (
    !input.preferredPartnerGender ||
    !ALLOWED_PARTNER_GENDERS.includes(input.preferredPartnerGender)
  ) {
    return 'Invalid preferred partner gender'
  }

  return null
}
