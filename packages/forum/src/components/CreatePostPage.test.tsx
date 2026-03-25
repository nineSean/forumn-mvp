/* @vitest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CreatePostPage from "./CreatePostPage";

const { assign, useMutation } = vi.hoisted(() => ({
  assign: vi.fn(),
  useMutation: vi.fn(() => [null, vi.fn()]),
}));

vi.mock("urql", async (importOriginal) => {
  const actual = await importOriginal<typeof import("urql")>();

  return {
    ...actual,
    useMutation,
  };
});

describe("CreatePostPage", () => {
  beforeEach(() => {
    assign.mockReset();
    useMutation.mockReturnValue([null, vi.fn()]);
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        assign,
        search: "?boardId=board-123",
      },
    });
  });

  it("returns to the current board when cancel is clicked", () => {
    render(<CreatePostPage />);

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(assign).toHaveBeenCalledWith("/forum?boardId=board-123");
  });
});
