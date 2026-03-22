import { useRouter } from "next/router";
import { loadRemoteComponent } from "../../components/RemoteLoader";

const ForumPage = loadRemoteComponent("forum", "ForumPage");
const PostDetailPage = loadRemoteComponent("forum", "PostDetailPage");
const CreatePostPage = loadRemoteComponent("forum", "CreatePostPage");

export default function ForumRoute() {
  const router = useRouter();
  const slug = router.query.slug as string[] | undefined;

  if (!slug || slug.length === 0) return <ForumPage />;
  if (slug[0] === "new") return <CreatePostPage />;
  if (slug.length === 1) return <PostDetailPage postId={slug[0]} />;

  return <ForumPage />;
}
