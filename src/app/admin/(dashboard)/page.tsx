import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Import, Pencil, Star } from "lucide-react";
import { DeleteButton } from "@/components/delete-button";
import type { Tonie } from "@/lib/schemas/tonie";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard",
};

/**
 * Admin dashboard — lists all figures in a table with edit/delete actions.
 */
export default async function AdminDashboardPage() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tonies")
        .select("*")
        .order("name", { ascending: true });

    const tonies = (data ?? []) as Tonie[];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {tonies.length} figures in the collection
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link href="/admin/tonies/import" className="gap-1.5">
                            <Import className="h-4 w-4" />
                            Import
                        </Link>
                    </Button>
                    <Button asChild size="sm">
                        <Link href="/admin/tonies/new" className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            Add Tonie
                        </Link>
                    </Button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-destructive">
                    Failed to load figures: {error.message}
                </p>
            )}

            {tonies.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
                    <div className="text-6xl">🎵</div>
                    <p className="text-muted-foreground">
                        No figures yet. Add your first Tonie!
                    </p>
                    <Button asChild>
                        <Link href="/admin/tonies/new">Add Tonie</Link>
                    </Button>
                </div>
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Series</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="w-24 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {tonies.map((tonie) => (
                                <TableRow key={tonie.id}>
                                    <TableCell>
                                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-muted">
                                            {tonie.image_url ? (
                                                <Image
                                                    src={tonie.image_url}
                                                    alt={tonie.name}
                                                    fill
                                                    className="object-cover"
                                                    sizes="40px"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                    —
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Link
                                                href={`/tonies/${tonie.id}`}
                                                className="font-medium hover:underline"
                                            >
                                                {tonie.name}
                                            </Link>
                                            {tonie.favorite && (
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="text-xs">
                                            {tonie.series}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                        {tonie.price !== null
                                            ? new Intl.NumberFormat("en", {
                                                style: "currency",
                                                currency: "EUR",
                                            }).format(tonie.price)
                                            : "—"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button asChild variant="ghost" size="icon">
                                                <Link href={`/admin/tonies/${tonie.id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                    <span className="sr-only">Edit {tonie.name}</span>
                                                </Link>
                                            </Button>
                                            <DeleteButton id={tonie.id} name={tonie.name} />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
