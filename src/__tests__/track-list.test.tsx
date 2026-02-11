// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { TrackList } from "@/components/track-list";

describe("TrackList", () => {
    it("renders an ordered list of tracks", () => {
        const tracks = ["Circle of Life", "Hakuna Matata", "Can You Feel the Love"];
        render(<TrackList tracks={tracks} />);

        expect(screen.getByText("Track list")).toBeInTheDocument();
        tracks.forEach((track) => {
            expect(screen.getByText(track)).toBeInTheDocument();
        });
    });

    it("renders tracks as an ordered list", () => {
        render(<TrackList tracks={["Track 1", "Track 2"]} />);
        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    it("shows fallback when tracks is null", () => {
        render(<TrackList tracks={null} />);
        expect(screen.getByText("No tracks available")).toBeInTheDocument();
    });

    it("shows fallback when tracks is empty array", () => {
        render(<TrackList tracks={[]} />);
        expect(screen.getByText("No tracks available")).toBeInTheDocument();
    });

    it("renders the correct number of list items", () => {
        const tracks = ["A", "B", "C", "D"];
        render(<TrackList tracks={tracks} />);
        const items = screen.getAllByRole("listitem");
        expect(items).toHaveLength(4);
    });
});
