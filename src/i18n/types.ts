export type PinId = "me" | "carwash" | "barber" | "catering" | "coffee";
export type Item = { lead: string; text: string };
export type BenefitRow = { title: string; sum: string; items: Item[]; aside?: Item };
