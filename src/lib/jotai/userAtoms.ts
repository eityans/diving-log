import { atom } from "jotai";
import { User } from "@/types/user";

export const userIdAtom = atom<string>("");
export const userInfoAtom = atom<User | null>(null);
