import { redirect } from "next/navigation";

// The experience now lives at /birthday; send the root there.
export default function Home() {
  redirect("/birthday");
}
