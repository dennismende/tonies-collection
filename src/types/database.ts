/**
 * Supabase database type definitions.
 * Manually defined to match our migration schema.
 *
 * In production, these would be generated via `supabase gen types typescript`.
 * We define them manually here for type safety during development.
 */
export type Database = {
    public: {
        Tables: {
            tonies: {
                Row: {
                    id: string;
                    name: string;
                    series: string;
                    image_url: string | null;
                    purchase_date: string | null;
                    price: number | null;
                    notes: string | null;
                    favorite: boolean;
                    track_list: string[] | null;
                    is_creative_tonie: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    series: string;
                    image_url?: string | null;
                    purchase_date?: string | null;
                    price?: number | null;
                    notes?: string | null;
                    favorite?: boolean;
                    track_list?: string[] | null;
                    is_creative_tonie?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    series?: string;
                    image_url?: string | null;
                    purchase_date?: string | null;
                    price?: number | null;
                    notes?: string | null;
                    favorite?: boolean;
                    track_list?: string[] | null;
                    is_creative_tonie?: boolean;
                    updated_at?: string;
                };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: Record<string, never>;
        CompositeTypes: Record<string, never>;
    };
};
