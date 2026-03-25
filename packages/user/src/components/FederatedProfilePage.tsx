import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";
import ProfilePage from "./ProfilePage";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function FederatedProfilePage() {
  return (
    <UrqlProvider value={urqlClient}>
      <ProfilePage />
    </UrqlProvider>
  );
}
