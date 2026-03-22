import { BOARDS_QUERY } from "@forum/shared";
import Link from "next/link";
import { useQuery } from "urql";

export function Sidebar() {
  const [{ data }] = useQuery({ query: BOARDS_QUERY });

  return (
    <aside className="w-56 bg-gray-50 border-r border-gray-200 p-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase mb-3">Boards</h2>
      <nav className="space-y-1">
        {data?.boards?.map((board: any) => (
          <Link
            key={board.id}
            href={`/forum?boardId=${board.id}`}
            className="block px-3 py-2 text-sm text-gray-700 rounded hover:bg-gray-100"
          >
            {board.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
