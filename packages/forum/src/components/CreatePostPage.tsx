import React from "react";
import { useMutation } from "urql";
import { CREATE_POST_MUTATION } from "@forum/shared";
import { useEffect, useState } from "react";
import { getSearchParam } from "../lib/location";

export default function CreatePostPage() {
  const [boardId, setBoardId] = useState("");
  const [, createPost] = useMutation(CREATE_POST_MUTATION);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    setBoardId(getSearchParam("boardId"));
  }, []);

  const cancelHref = boardId ? `/forum?boardId=${encodeURIComponent(boardId)}` : "/forum";

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    const result = await createPost({
      input: { boardId, title, content },
    });
    if (result.data?.createPost) {
      window.location.assign(`/forum/${result.data.createPost.id}`);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">New Post</h1>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
        placeholder="Title"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded resize-none mb-4"
        rows={8}
        placeholder="Content"
      />
      <div className="flex gap-3">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Publish
        </button>
        <button
          onClick={() => window.location.assign(cancelHref)}
          className="px-4 py-2 text-gray-600 text-sm border border-gray-300 rounded hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
