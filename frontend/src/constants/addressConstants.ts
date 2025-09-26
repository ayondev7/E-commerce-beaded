// Centralized address constants for selects
export const divisions = ["Dhaka", "Chattogram", "Sylhet", "Khulna"] as const;

export const districtsByDivision: Record<string, string[]> = {
  Dhaka: ["Dhaka District", "Gazipur", "Narayanganj"],
  Chattogram: ["Chattogram District", "Cox's Bazar", "Feni"],
  Sylhet: ["Sylhet District", "Moulvibazar"],
  Khulna: ["Khulna District", "Bagerhat"],
};

export const areasByDistrict: Record<string, string[]> = {
  "Dhaka District": ["Dhanmondi", "Gulshan", "Mirpur"],
  Gazipur: ["Tongi", "Sreepur"],
  Narayanganj: ["Bandar", "Sonargaon"],
  "Chattogram District": ["Pahartali", "Panchlaish"],
  "Cox's Bazar": ["Kolatoli", "Inani"],
  Feni: ["Feni Sadar"],
  "Sylhet District": ["Zindabazar", "Ambarkhana"],
  Moulvibazar: ["Sadar", "Kulaura"],
  "Khulna District": ["Sonadanga", "Khalishpur"],
  Bagerhat: ["Morrelganj"],
};

export const precedenceOptions = ["Default", "Secondary"] as const;
