/* @vitest-environment jsdom */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { Header } from "./Header";

const assign = vi.fn();

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  useSession: () => ({ data: null }),
}));

describe("Header", () => {
  beforeEach(() => {
    assign.mockReset();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { assign },
    });
  });

  it("renders without a Next router context and navigates search via location", () => {
    render(<Header />);

    fireEvent.change(screen.getByPlaceholderText("Search posts..."), {
      target: { value: "react 19" },
    });
    fireEvent.submit(screen.getByRole("textbox", { name: "" }).closest("form")!);

    expect(assign).toHaveBeenCalledWith("/search?q=react%2019");
  });
});
