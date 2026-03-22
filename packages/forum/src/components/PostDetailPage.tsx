import { useQuery, useMutation } from "urql";
import { POST_QUERY, CREATE_REPLY_MUTATION } from "@forum/shared";
import { useState } from "react";

export default function PostDetailPage({ postId }: { postId: string }) {
  const [{ data, fetching }, reexecuteQuery] = useQuery({
    query: POST_QUERY,
    variables: { id: postId },
  });
  const [, createReply] = useMutation(CREATE_REPLY_MUTATION);
  const [replyContent, setReplyContent] = useState("");

  if (fetching) return <p className="text-gray-500">Loading...</p>;

  const post = data?.post;
  if (!post) return <p className="text-red-500">Post not found.</p>;

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    await createReply({ input: { postId, content: replyContent } });
    setReplyContent("");
    reexecuteQuery({ requestPolicy: "network-only" });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-4">
        {post.author.name} · {post.board.name} · {new Date(post.createdAt).toLocaleDateString()}
      </div>
      <div className="prose mb-8 whitespace-pre-wrap">{post.content}</div>

      <h2 className="text-lg font-semibold mb-4">Replies ({post.replyCount})</h2>
      <div className="space-y-4 mb-8">
        {post.replies?.map((reply: any) => (
          <div key={reply.id} className="p-3 bg-gray-50 rounded">
            <div className="text-sm text-gray-500 mb-1">
              {reply.author.name} · {new Date(reply.createdAt).toLocaleDateString()}
            </div>
            <div className="whitespace-pre-wrap">{reply.content}</div>
          </div>
        ))}
      </div>

      <div>
        <textarea
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded resize-none"
          rows={3}
          placeholder="Write a reply..."
        />
        <button
          onClick={handleReply}
          className="mt-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Reply
        </button>
      </div>
    </div>
  );
}
