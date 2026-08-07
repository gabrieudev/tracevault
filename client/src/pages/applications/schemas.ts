import { z } from "zod";

export const applicationStatusSchema = z.enum(["ACTIVE", "INACTIVE"]);

export const createApplicationSchema = z.object({
	name: z.string().trim().min(1, "Nome obrigatório").max(150),

	description: z.string().trim().max(500),
});

export const editApplicationSchema = createApplicationSchema.extend({
	status: applicationStatusSchema,
});

export const rotateKeySchema = z.object({
	currentKey: z.string().trim().min(1, "A chave atual é obrigatória"),
});

export type ApplicationStatusForm = z.infer<typeof applicationStatusSchema>;

export type CreateApplicationForm = z.infer<typeof createApplicationSchema>;

export type EditApplicationForm = z.infer<typeof editApplicationSchema>;

export type RotateKeyForm = z.infer<typeof rotateKeySchema>;
