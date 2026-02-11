import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    type: "empty" | "no-results";
    onClear?: () => void;
}

/**
 * Empty state component shown when the collection has no figures
 * or when filters produce zero results.
 */
export function EmptyState({ type, onClear }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="text-6xl">
                {type === "empty" ? "🎵" : "🔍"}
            </div>
            <div>
                <h2 className="text-lg font-semibold">
                    {type === "empty"
                        ? "No tonies in the collection yet"
                        : "No tonies match your filters"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    {type === "empty"
                        ? "Add your first Tonie figure through the admin panel."
                        : "Try adjusting your search or filter criteria."}
                </p>
            </div>
            {type === "no-results" && onClear && (
                <Button variant="outline" onClick={onClear}>
                    Clear filters
                </Button>
            )}
        </div>
    );
}
