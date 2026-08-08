import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface SearchComboboxOption {
	label: string;
	value: string;
}

interface SearchComboboxProps {
	options: SearchComboboxOption[];
	value?: string;
	onChange: (value?: string) => void;
	placeholder?: string;
	emptyText?: string;
	className?: string;
}

export function SearchCombobox({
	options,
	value,
	onChange,
	placeholder = "Selecionar...",
	emptyText = "Nenhum resultado encontrado.",
	className,
}: SearchComboboxProps) {
	const [open, setOpen] = useState(false);

	const selected = options.find((item) => item.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("justify-between font-normal", className)}
				>
					<span className="truncate">{selected?.label ?? placeholder}</span>

					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent className="p-0">
				<Command>
					<CommandInput placeholder="Buscar..." />

					<CommandList>
						<CommandEmpty>{emptyText}</CommandEmpty>

						<CommandGroup>
							{options.map((option) => (
								<CommandItem
									key={option.value}
									value={option.label}
									onSelect={() => {
										onChange(option.value === value ? undefined : option.value);

										setOpen(false);
									}}
								>
									<Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />

									{option.label}
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
