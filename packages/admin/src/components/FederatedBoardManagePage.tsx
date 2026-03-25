import { Provider as UrqlProvider } from "urql";
import { createUrqlClient } from "@forum/shared";
import BoardManagePage from "./BoardManagePage";

const urqlClient = createUrqlClient(
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/graphql`
    : "http://localhost:4000/graphql"
);

export default function FederatedBoardManagePage() {
  return (
    <UrqlProvider value={urqlClient}>
      <BoardManagePage />
    </UrqlProvider>
  );
}
