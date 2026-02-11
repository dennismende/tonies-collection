import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrackList } from "@/components/track-list";
import { ArrowLeft, Star } from "lucide-react";
import type { Tonie } from "@/lib/schemas/tonie";

/**
 * Full detail layout for a single Tonie figure.
 * Displays hero image, badges, metadata, notes, and track list.
 */
export function TonieDetail({ tonie }: { tonie: Tonie }) {
    const formattedDate = tonie.purchase_date
        ? new Intl.DateTimeFormat("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }).format(new Date(tonie.purchase_date))
        : null;

    const formattedPrice =
        tonie.price !== null
            ? new Intl.NumberFormat("en", {
                style: "currency",
                currency: "EUR",
            }).format(tonie.price)
            : null;

    return (
        <div className="flex flex-col gap-8">
            {/* Back link */}
            <Link
                href="/"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to collection
            </Link>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Hero image */}
                <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
                    {tonie.image_url ? (
                        <Image
                            src={tonie.image_url}
                            alt={tonie.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="80"
                                height="80"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
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

                {/* Info */}
                <div className="flex flex-col gap-4">
                    {/* Title + badges */}
                    <div>
                        <div className="flex items-start gap-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {tonie.name}
                            </h1>
                            {tonie.favorite && (
                                <Star className="mt-1 h-6 w-6 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                            )}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <Badge variant="secondary">{tonie.series}</Badge>
                            {tonie.is_creative_tonie && (
                                <Badge variant="outline">Creative Tonie</Badge>
                            )}
                        </div>
                    </div>

                    <Separator />

                    {/* Metadata */}
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {formattedDate && (
                            <>
                                <dt className="text-muted-foreground">Purchase date</dt>
                                <dd>{formattedDate}</dd>
                            </>
                        )}
                        {formattedPrice && (
                            <>
                                <dt className="text-muted-foreground">Price</dt>
                                <dd className="font-medium">{formattedPrice}</dd>
                            </>
                        )}
                    </dl>

                    {/* Notes */}
                    {tonie.notes && (
                        <div>
                            <h2 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Notes
                            </h2>
                            <p className="text-sm leading-relaxed">{tonie.notes}</p>
                        </div>
                    )}

                    <Separator />

                    {/* Track list */}
                    <TrackList tracks={tonie.track_list} />

                    {/* Admin edit link — visible to all, but /admin is auth-protected */}
                    <div className="mt-auto pt-4">
                        <Link
                            href={`/admin/tonies/${tonie.id}/edit`}
                            className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                        >
                            Edit this figure
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
