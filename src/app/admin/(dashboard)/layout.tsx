import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LogOut } from "lucide-react";

/**
 * Authenticated admin layout shell with navigation bar and logout button.
 * Verifies the user is authenticated — if not, redirects to login.
 */
export default async function AdminDashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="text-lg font-semibold tracking-tight transition-colors hover:text-primary"
                        >
                            🎵 Admin
                        </Link>
                        <Separator orientation="vertical" className="h-6" />
                        <nav className="flex items-center gap-3">
                            <Link
                                href="/admin/tonies/new"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Add Tonie
                            </Link>
                            <Link
                                href="/admin/tonies/import"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                Import
                            </Link>
                            <Link
                                href="/"
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                View Site
                            </Link>
                        </nav>
                    </div>
                    <form action="/api/auth/logout" method="POST">
                        <Button variant="ghost" size="sm" type="submit" className="gap-1.5">
                            <LogOut className="h-4 w-4" />
                            Log out
                        </Button>
                    </form>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
