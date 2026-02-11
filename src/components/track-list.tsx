/**
 * Renders an ordered list of tracks / chapters.
 * Shows a fallback message when no tracks are available.
 */
export function TrackList({ tracks }: { tracks: string[] | null }) {
    return (
        <div>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground">
                Track list
            </h2>
            {tracks && tracks.length > 0 ? (
                <ol className="list-inside list-decimal space-y-1 text-sm">
                    {tracks.map((track, index) => (
                        <li key={index} className="leading-relaxed">
                            {track}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-sm text-muted-foreground">No tracks available</p>
            )}
        </div>
    );
}
