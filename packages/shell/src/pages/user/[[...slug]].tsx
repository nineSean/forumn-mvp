import { useRouter } from "next/router";
import { loadRemoteComponent } from "../../components/RemoteLoader";

const ProfilePage = loadRemoteComponent("user", "ProfilePage");
const SettingsPage = loadRemoteComponent("user", "SettingsPage");

export default function UserRoute() {
  const router = useRouter();
  const slug = router.query.slug as string[] | undefined;

  if (slug?.[0] === "settings") return <SettingsPage />;
  return <ProfilePage />;
}
