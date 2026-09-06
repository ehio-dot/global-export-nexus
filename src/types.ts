export type Pillar =
  | "raw-materials"
  | "processing"
  | "packaging"
  | "logistics"
  | "freight"
  | "buyers"
  | "financiers";

export interface Certification {
  name: string;
  desc: string;
}

export interface DirectoryPartner {
  id: string;
  pillar: Pillar;
  name: string;
  country: string;
  region: string;
  city: string;
  blurb: string;
  specialties: string[];
  certifications: string[];
  verified: boolean;
  established: number;
  exportVolume: string;
  rating: number;
  moq?: string;
  capacity?: string;
  priceBand: string;
  tags: string[];
  badge: string;
}

export interface SupplyChainNode {
  id: string;
  pillar: Pillar;
  partnerId: string;
  partnerName: string;
  country: string;
  cost: number;
  leadDays: number;
}

export interface Rfq {
  id: string;
  pillar: Pillar;
  title: string;
  company: string;
  country: string;
  volume: string;
  deadline?: string;
  open: boolean;
  createdAt: string;
  specs: string[];
  budget?: string;
}

export interface RfqDraft {
  id: string;
  pillar: Pillar;
  title: string;
  volume: string;
  specs: string;
  targetCountry: string;
  budget: string;
  createdAt: string;
}

export type ShipMode = "air" | "ocean" | "oceanLcl" | "rail";

export interface RouteQuote {
  origin: string;
  destination: string;
  mode: ShipMode;
  freightUsd: number;
  transitDays: number;
  insurancePct: number;
  dutyPct: number;
  fob: number;
  productValue: number;
  incubatorFee: number;
}

export type CostLineKind = "product" | "freight" | "insurance" | "duty" | "finance";

export interface CostLine {
  kind: CostLineKind;
  label: string;
  amount: number;
  note?: string;
}