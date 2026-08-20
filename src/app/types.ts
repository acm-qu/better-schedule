export type TDay = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday";

export interface ICourse {
  name:string;
  code?:string;
  type:string;
  kind:"Lab" | "Lecture";
  section?:string;
  timing:[string, string];
  building?:string;
  buildingName?:string;
  room?:string;
  margin:number;
  height:number;
  color?:string;
}

export type TSchedule = Record<TDay, ICourse[]>;

export interface ITheme {
  readonly pageBg:string;
  readonly ink:string;
  readonly body:string;
  readonly muted:string;
  readonly hair:string;
  readonly inputBg:string;
  readonly popBg:string;
  readonly navBg:string;
  readonly sheetBg:string;
  readonly sheetInk:string;
  readonly sheetMuted:string;
  readonly hairFaint:string;
  readonly edge:string;
}

export interface IPreset {
  readonly colors:readonly string[];
  readonly accent:string;
}

export type TFontKey = "ACM" | "University" | "Code";

export interface IFontStyle {
  readonly key:TFontKey;
  readonly fonts:readonly { readonly label:string; readonly fam:string; readonly plus?:boolean }[];
}
