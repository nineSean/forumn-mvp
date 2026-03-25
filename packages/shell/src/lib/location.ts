export function getPathSegments() {
  if (typeof window === "undefined") {
    return [];
  }

  return window.location.pathname.split("/").filter(Boolean);
}

export function getSearchParam(key: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get(key) ?? "";
}
