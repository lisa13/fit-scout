import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import FitPage from "../app/fit/page";

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

vi.mock("../components/ResultCard", () => ({
  ResultCard: ({
    sizeLabel,
    confidence,
  }: {
    sizeLabel: string;
    confidence: number;
  }) => (
    <div data-testid="result-card">
      <h3>Size: {sizeLabel}</h3>
      <p>Confidence: {Math.round(confidence * 100)}%</p>
    </div>
  ),
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

vi.mock("../components/ui/collapsible", () => ({
  Collapsible: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CollapsibleContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CollapsibleTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("FitPage", () => {
  const user = userEvent.setup();
  const mockPostJSON = vi.mocked(await import("../lib/fetcher")).postJSON;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the fit page with form", () => {
    render(<FitPage />);

    expect(screen.getByText("Find Your Size")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter your measurements and preferences to get personalized size recommendations",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Size Recommendation Form")).toBeInTheDocument();
    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
  });

  it("validates required fields", async () => {
    render(<FitPage />);

    const submitButton = screen.getByText("Get Size Recommendation");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Brand is required")).toBeInTheDocument();
    });
  });

  it("shows success result after form submission", async () => {
    const mockResult = {
      sizeLabel: "M",
      confidence: 0.95,
      rationale: "Based on your measurements and regular fit preference",
      alternates: ["L", "S"],
    };

    mockPostJSON.mockResolvedValueOnce(mockResult);

    render(<FitPage />);

    // Fill out the form
    const brandSelect = screen.getByRole("combobox", { name: /brand/i });
    await user.click(brandSelect);
    await user.click(screen.getByText("Nike"));

    const chestInput = screen.getByPlaceholderText("e.g., 96");
    await user.type(chestInput, "96");

    const waistInput = screen.getByPlaceholderText("e.g., 81");
    await user.type(waistInput, "81");

    const submitButton = screen.getByText("Get Size Recommendation");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("result-card")).toBeInTheDocument();
      expect(screen.getByText("Size: M")).toBeInTheDocument();
      expect(screen.getByText("Confidence: 95%")).toBeInTheDocument();
    });
  });

  it("shows error message on API failure", async () => {
    mockPostJSON.mockRejectedValueOnce(new Error("API Error"));

    render(<FitPage />);

    // Fill out the form
    const brandSelect = screen.getByRole("combobox", { name: /brand/i });
    await user.click(brandSelect);
    await user.click(screen.getByText("Nike"));

    const chestInput = screen.getByPlaceholderText("e.g., 96");
    await user.type(chestInput, "96");

    const submitButton = screen.getByText("Get Size Recommendation");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByTestId("error")).toBeInTheDocument();
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  it("shows different measurement fields for shoes category", async () => {
    render(<FitPage />);

    const categorySelect = screen.getByRole("combobox", { name: /category/i });
    await user.click(categorySelect);
    await user.click(screen.getByText("Shoes"));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("e.g., 270")).toBeInTheDocument();
      expect(screen.queryByPlaceholderText("e.g., 96")).not.toBeInTheDocument();
    });
  });
});
