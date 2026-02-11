// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { EmptyState } from "@/components/empty-state";

describe("EmptyState", () => {
    it("shows empty collection message when type is 'empty'", () => {
        render(<EmptyState type="empty" />);
        expect(
            screen.getByText("No tonies in the collection yet")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Add your first Tonie figure through the admin panel.")
        ).toBeInTheDocument();
    });

    it("shows no results message when type is 'no-results'", () => {
        render(<EmptyState type="no-results" />);
        expect(
            screen.getByText("No tonies match your filters")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Try adjusting your search or filter criteria.")
        ).toBeInTheDocument();
    });

    it("shows clear filters button when onClear provided with no-results", () => {
        const onClear = vi.fn();
        render(<EmptyState type="no-results" onClear={onClear} />);
        const button = screen.getByRole("button", { name: "Clear filters" });
        expect(button).toBeInTheDocument();
    });

    it("does not show clear button on empty type", () => {
        render(<EmptyState type="empty" />);
        expect(screen.queryByRole("button")).toBeNull();
    });

    it("shows 🎵 emoji for empty type", () => {
        render(<EmptyState type="empty" />);
        expect(screen.getByText("🎵")).toBeInTheDocument();
    });

    it("shows 🔍 emoji for no-results type", () => {
        render(<EmptyState type="no-results" />);
        expect(screen.getByText("🔍")).toBeInTheDocument();
    });
});
