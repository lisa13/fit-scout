import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FindPage from "../app/find/page";

// Mock the fetcher
vi.mock("../lib/fetcher", () => ({
  postJSON: vi.fn(),
}));

// Mock the components
vi.mock("../components/shell/Container", () => ({
  Container: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="container">{children}</div>
  ),
}));

vi.mock("../components/QueryPanel", () => ({
  QueryPanel: ({
    onSubmit,
    isLoading,
  }: {
    onSubmit: (data: any) => void;
    isLoading: boolean;
  }) => (
    <div data-testid="query-panel">
      <button
        onClick={() => onSubmit({ url: "https://example.com/product" })}
        disabled={isLoading}
        data-testid="submit-button"
      >
        {isLoading ? "Loading..." : "Submit"}
      </button>
    </div>
  ),
}));

vi.mock("../components/ProductCard", () => ({
  ProductCard: ({ title, price }: { title: string; price: number }) => (
    <div data-testid="product-card">
      <h3>{title}</h3>
      <p>${price}</p>
    </div>
  ),
}));

vi.mock("../components/common/LoadingBlock", () => ({
  LoadingBlock: () => <div data-testid="loading-block">Loading...</div>,
}));

vi.mock("../components/common/EmptyState", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

vi.mock("../components/common/InlineError", () => ({
  InlineError: ({ message }: { message: string }) => (
    <div data-testid="error">{message}</div>
  ),
}));

describe("FindPage", () => {
  const user = userEvent.setup();
  const mockPostJSON = vi.mocked(await import("../lib/fetcher")).postJSON;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the find page with initial state", () => {
    render(<FindPage />);

    expect(screen.getByText("Find Similar Products")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload a product image or paste a URL to find similar items",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("query-panel")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("shows loading state when submitting", async () => {
    mockPostJSON.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<FindPage />);

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    expect(screen.getByTestId("loading-block")).toBeInTheDocument();
  });

  it("shows products grid after successful submission", async () => {
    const mockProducts = [
      {
        id: "1",
        title: "Test Product",
        brandId: "nike",
        category: "shoes",
        price: 100,
        image: "test.jpg",
        score: 0.95,
      },
      {
        id: "2",
        title: "Another Product",
        brandId: "adidas",
        category: "clothing",
        price: 80,
        image: "test2.jpg",
        score: 0.87,
      },
    ];

    mockPostJSON.mockResolvedValueOnce({ items: mockProducts });

    render(<FindPage />);

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Similar Products (2)")).toBeInTheDocument();
      expect(screen.getAllByTestId("product-card")).toHaveLength(2);
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Another Product")).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    mockPostJSON.mockRejectedValueOnce(new Error("API Error"));

    render(<FindPage />);

    const submitButton = screen.getByTestId("submit-button");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });
});

