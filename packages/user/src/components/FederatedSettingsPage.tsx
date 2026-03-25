import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";
import SettingsPage from "./SettingsPage";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function FederatedSettingsPage() {
  return (
    <UrqlProvider value={urqlClient}>
      <SettingsPage />
    </UrqlProvider>
  );
}
