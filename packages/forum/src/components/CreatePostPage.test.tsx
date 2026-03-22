/* @vitest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePostPage from "./CreatePostPage";

const { push, useMutation } = vi.hoisted(() => ({
  push: vi.fn(),
  useMutation: vi.fn(() => [null, vi.fn()]),
}));

vi.mock("next/router", () => ({
  useRouter: () => ({
    push,
    query: { boardId: "board-123" },
  }),
}));

vi.mock("urql", () => ({
  useMutation,
}));

describe("CreatePostPage", () => {
  beforeEach(() => {
    push.mockReset();
    useMutation.mockReturnValue([null, vi.fn()]);
  });

  it("returns to the current board when cancel is clicked", () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(push).toHaveBeenCalledWith("/forum?boardId=board-123");
  });
});
