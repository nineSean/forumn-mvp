import {
  ComponentType,
  LazyExoticComponent,
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";

// Each remote module must be imported with a literal string for webpack to recognize it
const remoteComponents: Record<string, LazyExoticComponent<ComponentType<any>>> =
  {};

function ClientOnlyRemote({
  component: RemoteComponent,
  props,
}: {
  component: LazyExoticComponent<ComponentType<any>>;
  props: Record<string, unknown>;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="p-4 text-gray-500">Loading...</div>;
  }

  return (
    <Suspense fallback={<div className="p-4 text-gray-500">Loading...</div>}>
      <RemoteComponent {...props} />
    </Suspense>
  );
}

function createLazy(importFn: () => Promise<any>) {
  return lazy(() => importFn().then((mod: any) => ({ default: mod.default || mod })));
}

export function loadRemoteComponent(
  remote: string,
  module: string
): ComponentType<any> {
  const key = `${remote}/${module}`;
  if (!remoteComponents[key]) {
    // Must use literal import paths for webpack Module Federation to work
    if (remote === "forum" && module === "ForumPage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("forum/ForumPage"));
    } else if (remote === "forum" && module === "PostDetailPage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("forum/PostDetailPage"));
    } else if (remote === "forum" && module === "CreatePostPage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("forum/CreatePostPage"));
    } else if (remote === "user" && module === "ProfilePage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("user/ProfilePage"));
    } else if (remote === "user" && module === "SettingsPage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("user/SettingsPage"));
    } else if (remote === "admin" && module === "BoardManagePage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("admin/BoardManagePage"));
    } else if (remote === "admin" && module === "UserManagePage") {
      // @ts-expect-error MF remote
      remoteComponents[key] = createLazy(() => import("admin/UserManagePage"));
    } else {
      throw new Error(`Unknown remote module: ${remote}/${module}`);
    }
  }

  return function RemoteComponentWrapper(props) {
    const RemoteComponent = remoteComponents[key];
    return <ClientOnlyRemote component={RemoteComponent} props={props} />;
  };
}
