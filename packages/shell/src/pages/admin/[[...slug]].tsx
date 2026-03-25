import { useEffect, useState } from "react";
import { loadRemoteComponent } from "../../components/RemoteLoader";
import { getPathSegments } from "../../lib/location";

const BoardManagePage = loadRemoteComponent("admin", "BoardManagePage");
const UserManagePage = loadRemoteComponent("admin", "UserManagePage");

export default function AdminRoute() {
  const [slug, setSlug] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const segments = getPathSegments();
    setSlug(segments[0] === "admin" ? segments.slice(1) : []);
  }, []);

  if (slug?.[0] === "users") return <UserManagePage />;
  return <BoardManagePage />;
}
