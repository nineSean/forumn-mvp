import { useEffect, useState } from "react";
import { loadRemoteComponent } from "../../components/RemoteLoader";
import { getPathSegments } from "../../lib/location";

const ProfilePage = loadRemoteComponent("user", "ProfilePage");
const SettingsPage = loadRemoteComponent("user", "SettingsPage");

export default function UserRoute() {
  const [slug, setSlug] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const segments = getPathSegments();
    setSlug(segments[0] === "user" ? segments.slice(1) : []);
  }, []);

  if (slug?.[0] === "settings") return <SettingsPage />;
  return <ProfilePage />;
}
