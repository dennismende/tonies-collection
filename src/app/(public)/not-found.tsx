import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Custom 404 page for the public routes.
 */
export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
            <div className="text-6xl">🔍</div>
            <h1 className="text-2xl font-bold">Page not found</h1>
            <p className="text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist.
            </p>
            <Button asChild variant="outline">
                <Link href="/">Back to collection</Link>
            </Button>
        </div>
    );
}
