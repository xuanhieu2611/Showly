import { create } from "zustand";

type OnboardingState = {
  step: number;
  username: string;
  specialties: string[];
  city: string;
  district: string;
  displayName: string;
  setStep: (step: number) => void;
  setUsername: (username: string) => void;
  setSpecialties: (specialties: string[]) => void;
  setCity: (city: string) => void;
  setDistrict: (district: string) => void;
  setDisplayName: (name: string) => void;
  reset: () => void;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  step: 1,
  username: "",
  specialties: [],
  city: "",
  district: "",
  displayName: "",
  setStep: (step) => set({ step }),
  setUsername: (username) => set({ username }),
  setSpecialties: (specialties) => set({ specialties }),
  setCity: (city) => set({ city, district: "" }),
  setDistrict: (district) => set({ district }),
  setDisplayName: (displayName) => set({ displayName }),
  reset: () =>
    set({ step: 1, username: "", specialties: [], city: "", district: "", displayName: "" }),
}));
