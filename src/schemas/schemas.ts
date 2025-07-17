import z from "zod";

export const orderItemSchema = z.object({
    product_id: z.string(),
    quantity: z.number()
});

export const orderItemsSchema = z.object({
    items: z.array(orderItemSchema),
    notes: z.string().optional()
});