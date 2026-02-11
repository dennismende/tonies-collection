"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTonie } from "@/actions/tonie-actions";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
    id: string;
    name: string;
}

/**
 * Delete button with confirmation dialog.
 * Calls the deleteTonie server action and shows a toast on success/error.
 */
export function DeleteButton({ id, name }: DeleteButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteTonie(id);
            if (!result.success) {
                toast.error(result.error);
                setLoading(false);
            }
            // On success, the server action redirects — no need to handle here.
        } catch {
            // redirect() throws a NEXT_REDIRECT error — this is expected behavior.
            router.refresh();
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                    <span className="sr-only">Delete {name}</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete &quot;{name}&quot;?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. The figure and its image will be
                        permanently deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={loading}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
