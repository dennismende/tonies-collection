import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Tonie } from "@/lib/schemas/tonie";

/**
 * A single Tonie figure row for the list view.
 * Compact layout with thumbnail, name, series, date, and price.
 */
export function TonieRow({ tonie }: { tonie: Tonie }) {
    const formattedDate = tonie.purchase_date
        ? new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(tonie.purchase_date))
        : "—";

    const formattedPrice =
        tonie.price !== null
            ? new Intl.NumberFormat("en", {
                style: "currency",
                currency: "EUR",
            }).format(tonie.price)
            : "—";

    return (
        <Link
            href={`/tonies/${tonie.id}`}
            className="group flex items-center gap-4 rounded-lg border border-border p-3 transition-all duration-200 hover:bg-accent"
        >
            {/* Thumbnail */}
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {tonie.image_url ? (
                    <Image
                        src={tonie.image_url}
                        alt={tonie.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                            <circle cx="9" cy="9" r="2" />
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Name + badges */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-sm font-medium group-hover:text-primary">
                    {tonie.name}
                </span>
                {tonie.favorite && (
                    <Star className="h-3.5 w-3.5 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                )}
            </div>

            {/* Series */}
            <Badge variant="secondary" className="hidden text-xs sm:inline-flex">
                {tonie.series}
            </Badge>

            {/* Date */}
            <span className="hidden w-28 text-right text-xs text-muted-foreground md:block">
                {formattedDate}
            </span>

            {/* Price */}
            <span className="w-20 text-right text-xs font-medium">
                {formattedPrice}
            </span>
        </Link>
    );
}
