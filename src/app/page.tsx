/*import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  return null;
}
*/
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log("🔄 Redirigiendo a /login...");
    router.push("/login");
  }, []);

  return null;
}

