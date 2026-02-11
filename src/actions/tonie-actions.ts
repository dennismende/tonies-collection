"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTonieSchema, updateTonieSchema } from "@/lib/schemas/tonie";

/** Generic result type for server actions. */
export type ActionResult =
    | { success: true; id?: string }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Creates a new Tonie figure.
 * Validates input with Zod, uploads image to Supabase Storage,
 * and inserts a row into the tonies table.
 */
export async function createTonie(formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();

    // Auth check
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Parse form data
    const rawData = {
        name: formData.get("name") as string,
        series: formData.get("series") as string,
        purchase_date: (formData.get("purchase_date") as string) || null,
        price: formData.get("price") ? Number(formData.get("price")) : null,
        notes: (formData.get("notes") as string) || null,
        favorite: formData.get("favorite") === "true",
        is_creative_tonie: formData.get("is_creative_tonie") === "true",
        track_list: formData.get("track_list")
            ? JSON.parse(formData.get("track_list") as string)
            : null,
    };

    // Validate
    const parsed = createTonieSchema.safeParse(rawData);
    if (!parsed.success) {
        return {
            success: false,
            error: "Validation failed",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        };
    }

    // Handle image upload
    let imageUrl: string | null = null;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
        // Validate file
        if (imageFile.size > 5 * 1024 * 1024) {
            return { success: false, error: "Image must be less than 5 MB" };
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(imageFile.type)) {
            return { success: false, error: "Image must be JPEG, PNG, or WebP" };
        }

        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("tonies-images")
            .upload(fileName, imageFile, {
                contentType: imageFile.type,
                upsert: false,
            });

        if (uploadError) {
            return { success: false, error: `Image upload failed: ${uploadError.message}` };
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("tonies-images").getPublicUrl(fileName);
        imageUrl = publicUrl;
    }

    // Handle pre-uploaded image URL (from import)
    const existingImageUrl = formData.get("image_url") as string | null;
    if (!imageUrl && existingImageUrl) {
        imageUrl = existingImageUrl;
    }

    // Insert
    const { data, error } = await supabase
        .from("tonies")
        .insert({
            ...parsed.data,
            image_url: imageUrl,
        })
        .select("id")
        .single();

    if (error) {
        return { success: false, error: `Failed to create: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect(`/tonies/${data.id}`);
}

/**
 * Updates an existing Tonie figure.
 */
export async function updateTonie(formData: FormData): Promise<ActionResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const id = formData.get("id") as string;

    const rawData = {
        id,
        name: formData.get("name") as string,
        series: formData.get("series") as string,
        purchase_date: (formData.get("purchase_date") as string) || null,
        price: formData.get("price") ? Number(formData.get("price")) : null,
        notes: (formData.get("notes") as string) || null,
        favorite: formData.get("favorite") === "true",
        is_creative_tonie: formData.get("is_creative_tonie") === "true",
        track_list: formData.get("track_list")
            ? JSON.parse(formData.get("track_list") as string)
            : null,
    };

    const parsed = updateTonieSchema.safeParse(rawData);
    if (!parsed.success) {
        return {
            success: false,
            error: "Validation failed",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        };
    }

    // Handle image upload (replace)
    let imageUrl: string | undefined;
    const imageFile = formData.get("image") as File | null;
    if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 5 * 1024 * 1024) {
            return { success: false, error: "Image must be less than 5 MB" };
        }
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(imageFile.type)) {
            return { success: false, error: "Image must be JPEG, PNG, or WebP" };
        }

        const ext = imageFile.name.split(".").pop() ?? "jpg";
        const fileName = `${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("tonies-images")
            .upload(fileName, imageFile, {
                contentType: imageFile.type,
                upsert: false,
            });

        if (uploadError) {
            return { success: false, error: `Image upload failed: ${uploadError.message}` };
        }

        const {
            data: { publicUrl },
        } = supabase.storage.from("tonies-images").getPublicUrl(fileName);
        imageUrl = publicUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...updateData } = parsed.data;
    const { error } = await supabase
        .from("tonies")
        .update({
            ...updateData,
            ...(imageUrl !== undefined && { image_url: imageUrl }),
        })
        .eq("id", id);

    if (error) {
        return { success: false, error: `Failed to update: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath(`/tonies/${id}`);
    revalidatePath("/admin");
    redirect(`/tonies/${id}`);
}

/**
 * Deletes a Tonie figure and its image from storage.
 */
export async function deleteTonie(id: string): Promise<ActionResult> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Get current image URL to delete from storage
    const { data: tonie } = await supabase
        .from("tonies")
        .select("image_url")
        .eq("id", id)
        .single();

    if (tonie?.image_url) {
        // Extract the file name from the URL
        const url = new URL(tonie.image_url);
        const pathParts = url.pathname.split("/");
        const fileName = pathParts[pathParts.length - 1];
        if (fileName) {
            await supabase.storage.from("tonies-images").remove([fileName]);
        }
    }

    const { error } = await supabase.from("tonies").delete().eq("id", id);
    if (error) {
        return { success: false, error: `Failed to delete: ${error.message}` };
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
}
