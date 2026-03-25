import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";
import UserManagePage from "./UserManagePage";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function FederatedUserManagePage() {
  return (
    <UrqlProvider value={urqlClient}>
      <UserManagePage />
    </UrqlProvider>
  );
}
