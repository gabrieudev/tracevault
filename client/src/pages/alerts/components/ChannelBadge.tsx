import { Hash, Mail, Webhook as WebhookIcon } from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import type { ChannelType } from "../types";

export const CHANNEL_META: Record<
	ChannelType,
	{ label: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }
> = {
	WEBHOOK: { label: "Webhook", icon: WebhookIcon },
	SLACK: { label: "Slack", icon: Hash },
	DISCORD: { label: "Discord", icon: FaDiscord },
	EMAIL: { label: "E-mail", icon: Mail },
};

export function ChannelBadge({ channelType }: { channelType: ChannelType }) {
	const meta = CHANNEL_META[channelType];
	const Icon = meta.icon;

	return (
		<span className="inline-flex items-center gap-1.5 rounded-md border bg-muted/40 px-2 py-1 text-xs font-medium text-foreground">
			<Icon className="h-3.5 w-3.5 text-muted-foreground" />
			{meta.label}
		</span>
	);
}
