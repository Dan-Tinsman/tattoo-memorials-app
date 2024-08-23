import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface SubmissionResult {
    success: boolean;
    orderId?: string;
    error?: string;
}

async function submitMemoriamForm(
    formData: any,
    supabase: any
): Promise<SubmissionResult> {
    let orderData: { id: string } | null = null;

    try {
        // 1. Insert into base_orders table
        const { data, error: orderError } = await supabase
            .from("base_orders")
            .insert([
                {
                    // first_name: formData.firstName,
                    // last_name: formData.lastName,
                    // email: formData.email,
                    // phone: formatPhoneNumber(formData.phone),
                    // street_address: formData.streetAddress,
                    // street_address2: formData.streetAddress2,
                    // city: formData.city,
                    // state: formData.state,
                    // postal_code: formData.postalCode,
                    // as_is: formData.asIs,
                    // altered: formData.altered,
                    // alteration_notes: formData.alterationNotes,
                    // inspiration_notes: formData.inspirationNotes,
                    order_type: "Memoriam",
                },
            ])
            .select()
            .single();

        if (orderError) throw orderError;
        if (!data) throw new Error("No data returned from base_orders insert");

        orderData = data;

        // 2. Insert into living_orders table
        const { error: livingOrderError } = await supabase
            .from("living_orders")
            .insert([{ id: orderData?.id }]);
        if (livingOrderError) throw livingOrderError;

        // 3. Insert into order_mediums table
        const { error: mediumsError } = await supabase
            .from("order_mediums")
            .insert([
                {
                    id: orderData?.id,
                    acrylic: formData.acrylic,
                    charcoal: formData.charcoal,
                    digital_tattoo_stencil: formData.digitalTattooStencil,
                    ink: formData.ink,
                    oil_paint: formData.oilPaint,
                    pastel: formData.pastel,
                    pencil: formData.pencil,
                    digital: formData.digital,
                    synthetic_skin: formData.syntheticSkin,
                    watercolor: formData.watercolor,
                },
            ]);
        if (mediumsError) throw mediumsError;

        return { success: true, orderId: orderData?.id };
    } catch (error) {
        console.error("Error submitting living form:", error);
        // If an error occurred after creating the order, we should delete it
        if (orderData && orderData.id) {
            await supabase.from("base_orders").delete().eq("id", orderData.id);
        }
        return { success: false, error: (error as Error).message };
    }
}

export async function POST(request: Request) {
    try {
        // Initialize Supabase client inside the request handler
        const supabase = createClient();

        const { formData } = await request.json();

        // TODO: Validate formData here

        const result = await submitMemoriamForm(formData, supabase);

        if (result.success) {
            return NextResponse.json(result, { status: 201 });
        } else {
            return NextResponse.json(result, { status: 400 });
        }
    } catch (error) {
        console.error("Error processing living form submission:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
