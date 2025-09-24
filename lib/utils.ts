import { clsx, type ClassValue } from "clsx";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

//utility function for the number days before an event expires which is calculated as the date the event is created + the number of days of the subscribed package

export function getEventExpiryDate(
  startDate: Date,
  retentionDays?: number
): Date {
  const expiry = new Date(startDate);
  expiry.setDate(expiry.getDate() + retentionDays!);
  return expiry;
}
