export type PinId = "me" | "carwash" | "barber" | "catering" | "coffee";
export type Item = { lead: string; text: string };
export type BenefitRow = { title: string; sum: string; items: Item[]; aside?: Item };
export type PainPoints = { title:string;description:string };
export type BrochurePoints = { title:string;body:string };