export interface PatientInfo {
  ID?: string;
  Diagnosis?: string;
  OtherDiagnosis?: string;
  Description?: string;
  Depression?: string;
  Hypomania?: string;
  Mania?: string;
  CurrentMedications?: string;
  PriorMedications?: string;
  PossibleMedications?: {
    first?: string;
    second?: string;
    third?: string;
  };
  Psychotic: string;
  Suicide: string;
  Kidney: string;
  Liver: string;
  blood_pressure: string;
  weight_gain: string;
  Reproductive: string;
  risk_pregnancy: string;
}

export interface NewPatientInfo {
  ID?: string;
  Diagnosis?: string;
  OtherDiagnosis?: string;
  Description?: string;
  Depression?: string;
  Hypomania?: string;
  Mania?: string;
  CurrentMedications?: string;
  PriorMedications?: string;
  PossibleMedications?: {
    first?: string[];
    second?: string[];
    third?: string[];
  };
  Psychotic: string;
  Suicide: string;
  Kidney: string;
  Liver: string;
}
