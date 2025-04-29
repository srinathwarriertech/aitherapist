import type { UserResource } from "@clerk/types";
declare module "@clerk/nextjs" {
  export function useUser(): { isLoaded: boolean; isSignedIn: boolean; user: UserResource | null };
}
