import { useQuery } from "urql";
import { useRouter } from "next/router";
import { POSTS_QUERY } from "@forum/shared";
import { useState } from "react";

export default function ForumPage() {
  const router = useRouter();
  const boardId = (router.query.boardId as string) || "";
  const [cursor, setCursor] = useState<string | null>(null);

  const [{ data, fetching }] = useQuery({
    query: POSTS_QUERY,
    variables: { boardId, cursor, limit: 20 },
    pause: !boardId,
  });

  if (!boardId) {
    return <p className="text-gray-500">Select a board from the sidebar.</p>;
  }

  if (fetching) return <p className="text-gray-500">Loading...</p>;

  const posts = data?.posts?.edges ?? [];
  const pageInfo = data?.posts?.pageInfo;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={() => router.push(`/forum/new?boardId=${boardId}`)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          New Post
        </button>
      </div>

      <div className="space-y-3">
        {posts.map(({ node }: any) => (
          <div
            key={node.id}
            onClick={() => router.push(`/forum/${node.id}`)}
            className="p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
          >
            <h2 className="font-semibold text-gray-900">{node.title}</h2>
            <div className="mt-1 text-sm text-gray-500">
              {node.author.name} · {new Date(node.createdAt).toLocaleDateString()} · {node.replyCount} replies
            </div>
          </div>
        ))}
      </div>

      {pageInfo?.hasNextPage && (
        <button
          onClick={() => setCursor(pageInfo.endCursor)}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          Load more
        </button>
      )}
    </div>
  );
}
