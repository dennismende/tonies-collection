import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Tonie } from "@/lib/schemas/tonie";

/**
 * A single Tonie figure card for the grid view.
 * Displays the figure image, name, series badge, and favorite indicator.
 */
export function TonieCard({ tonie }: { tonie: Tonie }) {
    return (
        <Link href={`/tonies/${tonie.id}`} className="group">
            <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:scale-[1.02]">
                <div className="relative aspect-square bg-muted">
                    {tonie.image_url ? (
                        <Image
                            src={tonie.image_url}
                            alt={tonie.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
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
                    {tonie.favorite && (
                        <div className="absolute right-2 top-2">
                            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <h3
                        className="truncate text-sm font-semibold leading-tight group-hover:text-primary"
                        title={tonie.name}
                    >
                        {tonie.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                            {tonie.series}
                        </Badge>
                        {tonie.is_creative_tonie && (
                            <Badge variant="outline" className="text-xs">
                                Creative
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
