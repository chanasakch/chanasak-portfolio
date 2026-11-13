import type { Metadata } from "next";
import { Profile } from "@/components/profile/Profile";

export const metadata: Metadata = {
  title: "Chanasak Choonuch | Full Stack Engineer",
  description: "Full stack engineer in Bangkok. Fourteen working websites: shops, booking, configurators and planners, plus experience and contact.",
};

export default function Home() {
  return <Profile />;
}
