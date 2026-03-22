import dynamic from "next/dynamic";
import { ComponentType } from "react";

type RemoteLoaderProps = {
  remote: string;
  module: string;
  fallback?: React.ReactNode;
};

export function loadRemoteComponent(
  remote: string,
  module: string
): ComponentType<any> {
  return dynamic(
    () =>
      // @ts-expect-error Module Federation dynamic import
      import(`${remote}/${module}`).then((mod: any) => mod.default || mod),
    {
      ssr: false,
      loading: () => <div className="p-4 text-gray-500">Loading...</div>,
    }
  );
}
