import { useQuery } from "urql";
import { ME_QUERY } from "@forum/shared";

export default function ProfilePage() {
  const [{ data, fetching }] = useQuery({ query: ME_QUERY });

  if (fetching) return <p className="text-gray-500">Loading...</p>;

  const user = data?.me;
  if (!user) return <p className="text-gray-500">Please sign in.</p>;

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-3">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <p className="font-medium">{user.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Role</label>
          <p className="font-medium capitalize">{user.role}</p>
        </div>
      </div>
    </div>
  );
}
