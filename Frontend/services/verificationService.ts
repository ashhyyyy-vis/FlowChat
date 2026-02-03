import { VerificationResult, Gender } from "../types";
import { api } from "./api";
import { detectGenderFromVideo, loadFaceApiModels } from "./faceApiService";

loadFaceApiModels().catch(console.error);

const base64ToBlob = (base64: string, mimeType = 'image/jpeg'): Blob => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

const verifyGenderClientSide = async (videoElement: HTMLVideoElement): Promise<VerificationResult> => {
  try {
    const result = await detectGenderFromVideo(videoElement);

    if (!result.detected) {
      return {
        isVerified: false,
        detectedGender: null,
        confidence: 0,
        error: "No face detected. Please center your face and try again."
      };
    }

    const detectedGender = result.gender === 'female' ? Gender.FEMALE :
      result.gender === 'male' ? Gender.MALE : null;

    return {
      isVerified: result.genderProbability > 0.6,
      detectedGender: detectedGender,
      confidence: result.genderProbability,
      error: undefined
    };

  } catch (error) {
    console.error("Client-side verification error:", error);
    return {
      isVerified: false,
      detectedGender: null,
      confidence: 0,
      error: "Face detection failed. Please try again."
    };
  }
};

const verifyGender = async (imageBase64: string, videoElement?: HTMLVideoElement): Promise<VerificationResult> => {
  try {
    const blob = base64ToBlob(imageBase64);
    const formData = new FormData();
    // Backend expects 'file' not 'image'
    formData.append('file', blob, 'capture.jpg');

    // Using new API client
    const result = await api.post<any>('/verify', formData, true);

    // Map backend response to VerificationResult
    return {
      isVerified: true, // Backend success means verified
      detectedGender: result.gender,
      confidence: result.confidence,
      error: undefined
    };

  } catch (error) {
    console.warn("Backend verification failed, using client-side face-api.js:", error);

    if (videoElement) {
      return verifyGenderClientSide(videoElement);
    }

    return {
      isVerified: false,
      detectedGender: null,
      confidence: 0,
      error: "Verification service unavailable. Please try again."
    };
  }
};

export { verifyGender, verifyGenderClientSide };