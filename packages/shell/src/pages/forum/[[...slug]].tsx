import { useEffect, useState } from "react";
import { loadRemoteComponent } from "../../components/RemoteLoader";
import { getPathSegments } from "../../lib/location";

const ForumPage = loadRemoteComponent("forum", "ForumPage");
const PostDetailPage = loadRemoteComponent("forum", "PostDetailPage");
const CreatePostPage = loadRemoteComponent("forum", "CreatePostPage");

export default function ForumRoute() {
  const [slug, setSlug] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const segments = getPathSegments();
    setSlug(segments[0] === "forum" ? segments.slice(1) : []);
  }, []);

  if (!slug || slug.length === 0) return <ForumPage />;
  if (slug[0] === "new") return <CreatePostPage />;
  if (slug.length === 1) return <PostDetailPage postId={slug[0]} />;

  return <ForumPage />;
}
