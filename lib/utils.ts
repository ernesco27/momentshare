import { clsx, type ClassValue } from "clsx";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };
