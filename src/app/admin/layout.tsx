/**
 * Bare admin layout — no auth check here.
 * The login page lives at this level, so it must NOT require auth.
 * Authenticated pages are in the (dashboard) route group with their own layout.
 */
export default function AdminRootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}
