import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/forum");
  }, [router]);

  return <div className="p-4 text-gray-500">Redirecting...</div>;
}
