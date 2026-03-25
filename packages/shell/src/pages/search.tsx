import { useEffect, useState } from "react";
import { useQuery } from "urql";
import { SEARCH_POSTS_QUERY } from "@forum/shared";
import { getSearchParam } from "../lib/location";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    setQuery(getSearchParam("q"));
  }, []);

  const [{ data, fetching }] = useQuery({
    query: SEARCH_POSTS_QUERY,
    variables: { query: query || "", limit: 20 },
    pause: !query,
  });

  if (!query) return <p className="text-gray-500">Enter a search term.</p>;
  if (fetching) return <p className="text-gray-500">Searching...</p>;

  const posts = data?.searchPosts?.edges ?? [];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Search results for &quot;{query}&quot;
      </h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="space-y-3">
          {posts.map(({ node }: any) => (
            <div
              key={node.id}
              onClick={() => window.location.assign(`/forum/${node.id}`)}
              className="p-4 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
            >
              <h2 className="font-semibold">{node.title}</h2>
              <div className="text-sm text-gray-500">
                {node.author.name} · {node.board.name} · {node.replyCount} replies
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
