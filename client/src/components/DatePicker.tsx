import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";

interface DatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string;
	className?: string;
	clearable?: boolean;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Selecionar data",
	className,
	clearable = true,
}: DatePickerProps) {
	const [open, setOpen] = React.useState(false);

	function handleSelect(date?: Date) {
		onChange(date);
		setOpen(false);
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn("justify-start text-left font-normal", !value && "text-muted-foreground", className)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />

					{value ? format(value, "dd/MM/yyyy") : <span>{placeholder}</span>}

					{clearable && value && (
						<X
							className="ml-auto h-4 w-4 opacity-50 hover:opacity-100"
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();

								onChange(undefined);
							}}
						/>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent className="w-auto p-0" align="start">
				<Calendar mode="single" selected={value} onSelect={handleSelect} locale={ptBR} />
			</PopoverContent>
		</Popover>
	);
}
