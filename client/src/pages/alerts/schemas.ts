import { z } from "zod";

export const channelTypeSchema = z.enum(["WEBHOOK", "SLACK", "EMAIL", "DISCORD"]);

export const minSeveritySchema = z.enum(["INFO", "WARNING", "CRITICAL"]);

export const createAlertSchema = z
	.object({
		applicationId: z.string().min(1, "Selecione uma aplicação"),
		channelType: channelTypeSchema,
		destination: z.string().trim().min(1, "Informe o destino do alerta"),
		minSeverity: minSeveritySchema,
		triggerEvents: z.array(z.string()).min(1, "Selecione ao menos um evento"),
		messageTemplate: z.string().trim().max(500),
	})
	.refine((data) => data.channelType !== "EMAIL" || z.string().email().safeParse(data.destination).success, {
		message: "Informe um e-mail válido",
		path: ["destination"],
	})
	.refine((data) => data.channelType === "EMAIL" || z.string().url().safeParse(data.destination).success, {
		message: "Informe uma URL válida",
		path: ["destination"],
	});

export const editAlertSchema = z
	.object({
		channelType: channelTypeSchema,
		destination: z.string().trim().min(1, "Informe o destino do alerta"),
		minSeverity: minSeveritySchema,
		triggerEvents: z.array(z.string()).min(1, "Selecione ao menos um evento"),
		messageTemplate: z.string().trim().max(500),
		active: z.boolean(),
	})
	.refine((data) => data.channelType !== "EMAIL" || z.string().email().safeParse(data.destination).success, {
		message: "Informe um e-mail válido",
		path: ["destination"],
	})
	.refine((data) => data.channelType === "EMAIL" || z.string().url().safeParse(data.destination).success, {
		message: "Informe uma URL válida",
		path: ["destination"],
	});

export type CreateAlertForm = z.infer<typeof createAlertSchema>;
export type EditAlertForm = z.infer<typeof editAlertSchema>;
