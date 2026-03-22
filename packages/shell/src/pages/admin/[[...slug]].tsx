import { useRouter } from "next/router";
import { loadRemoteComponent } from "../../components/RemoteLoader";

const BoardManagePage = loadRemoteComponent("admin", "BoardManagePage");
const UserManagePage = loadRemoteComponent("admin", "UserManagePage");

export default function AdminRoute() {
  const router = useRouter();
  const slug = router.query.slug as string[] | undefined;

  if (slug?.[0] === "users") return <UserManagePage />;
  return <BoardManagePage />;
}
