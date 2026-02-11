import Link from "next/link";
import { Separator } from "@/components/ui/separator";

/**
 * Public layout shell with header navigation, max-width content area, and footer.
 * Used by all public-facing (non-admin) routes.
 */
export default function PublicLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
                    >
                        🎵 Tonies Collection
                    </Link>
                    <nav className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                        >
                            Collection
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>

            <Separator />
            <footer className="py-6">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
                    <p>© {new Date().getFullYear()} Tonies Collection</p>
                    <Link
                        href="/admin/login"
                        className="transition-colors hover:text-foreground"
                    >
                        Admin
                    </Link>
                </div>
            </footer>
        </div>
    );
}
