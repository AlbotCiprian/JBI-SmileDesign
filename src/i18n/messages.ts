import type ro from "../../messages/ro.json";

export type Messages = typeof ro;
export type ServiceMessage = Messages["services"]["items"][number];
export type PointMessage = { title: string; text: string };
export type ReviewMessage = Messages["reviews"]["items"][number];
