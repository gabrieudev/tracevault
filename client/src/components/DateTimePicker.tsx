import { format, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, ChevronLeft, ChevronRight, Clock3, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { memo, useEffect, useMemo, useState } from "react";

interface DatePickerProps {
	value?: Date;
	onChange: (date?: Date) => void;
	placeholder?: string;
	className?: string;
	clearable?: boolean;
	minYear?: number;
	maxYear?: number;
}

const MONTHS = Array.from({ length: 12 }, (_, month) => ({
	value: month,
	label: format(new Date(2024, month, 1), "MMMM", {
		locale: ptBR,
	}),
}));

const pad = (value: number) => String(value).padStart(2, "0");

export function DateTimePicker({
	value,
	onChange,
	placeholder = "Selecionar data e hora",
	className,
	clearable = true,
	minYear = 1900,
	maxYear = 2100,
}: DatePickerProps) {
	const [open, setOpen] = useState(false);

	const [calendarMonth, setCalendarMonth] = useState(() => value ?? new Date());

	const [draftTime, setDraftTime] = useState(() => ({
		hour: value?.getHours() ?? 0,
		minute: value?.getMinutes() ?? 0,
		second: value?.getSeconds() ?? 0,
	}));

	const [timeError, setTimeError] = useState(false);

	const years = useMemo(
		() => Array.from({ length: maxYear - minYear + 1 }, (_, index) => maxYear - index),
		[maxYear, minYear],
	);

	useEffect(() => {
		if (!open) {
			const currentDate = value ?? new Date();

			setCalendarMonth(currentDate);

			setDraftTime({
				hour: currentDate.getHours(),
				minute: currentDate.getMinutes(),
				second: currentDate.getSeconds(),
			});
		}
	}, [open, value]);

	const selectedDate = value;

	const handleOpenChange = (nextOpen: boolean) => {
		if (nextOpen) {
			const currentDate = value ?? new Date();

			setCalendarMonth(currentDate);

			setDraftTime({
				hour: currentDate.getHours(),
				minute: currentDate.getMinutes(),
				second: currentDate.getSeconds(),
			});

			setTimeError(false);
		}

		setOpen(nextOpen);
	};

	const handleSelect = (date?: Date) => {
		if (!date) {
			onChange(undefined);
			return;
		}

		const nextDate = new Date(date);

		nextDate.setHours(draftTime.hour, draftTime.minute, draftTime.second, 0);

		onChange(nextDate);
		setCalendarMonth(nextDate);
	};

	const handleMonthChange = (monthIndex: string) => {
		const nextDate = setMonth(calendarMonth, Number(monthIndex));

		setCalendarMonth(nextDate);
	};

	const handleYearChange = (year: string) => {
		const nextDate = setYear(calendarMonth, Number(year));

		setCalendarMonth(nextDate);
	};

	const handlePreviousMonth = () => {
		const nextDate = new Date(calendarMonth);

		nextDate.setMonth(nextDate.getMonth() - 1);

		setCalendarMonth(nextDate);
	};

	const handleNextMonth = () => {
		const nextDate = new Date(calendarMonth);

		nextDate.setMonth(nextDate.getMonth() + 1);

		setCalendarMonth(nextDate);
	};

	const handleTimeChange = (field: "hour" | "minute" | "second", rawValue: string) => {
		if (rawValue === "") {
			setDraftTime((current) => ({
				...current,
				[field]: 0,
			}));

			setTimeError(false);
			return;
		}

		const numericValue = Number(rawValue);

		if (!Number.isInteger(numericValue)) {
			return;
		}

		const limits = {
			hour: 23,
			minute: 59,
			second: 59,
		};

		if (numericValue < 0 || numericValue > limits[field]) {
			setTimeError(true);
			return;
		}

		setTimeError(false);

		setDraftTime((current) => ({
			...current,
			[field]: numericValue,
		}));
	};

	const handleApplyTime = () => {
		if (timeError) {
			return;
		}

		const baseDate = selectedDate ? new Date(selectedDate) : new Date(calendarMonth);

		baseDate.setHours(draftTime.hour, draftTime.minute, draftTime.second, 0);

		onChange(baseDate);
		setCalendarMonth(baseDate);
		setOpen(false);
	};

	const handleToday = () => {
		const today = new Date();

		onChange(today);
		setCalendarMonth(today);

		setDraftTime({
			hour: today.getHours(),
			minute: today.getMinutes(),
			second: today.getSeconds(),
		});

		setOpen(false);
	};

	const handleClear = (event?: React.MouseEvent) => {
		event?.stopPropagation();

		onChange(undefined);
		setOpen(false);
	};

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn("h-10 w-full justify-start text-left font-normal", !value && "text-muted-foreground", className)}
				>
					<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />

					<span className="truncate">{value ? format(value, "dd/MM/yyyy HH:mm:ss") : placeholder}</span>

					{clearable && value && (
						<X
							className="ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
							onClick={handleClear}
						/>
					)}
				</Button>
			</PopoverTrigger>

			<PopoverContent align="start" className="w-82.5 overflow-hidden rounded-xl p-0">
				{/* Header */}
				<div className="border-b bg-muted/30 px-3 py-3">
					<div className="flex items-center gap-1">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 shrink-0"
							onClick={handlePreviousMonth}
							aria-label="Mês anterior"
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>

						<Select value={String(calendarMonth.getMonth())} onValueChange={handleMonthChange}>
							<SelectTrigger
								className={cn("h-8 flex-1 border-0 bg-transparent", "px-2 font-medium capitalize", "shadow-none focus:ring-0")}
							>
								<SelectValue />
							</SelectTrigger>

							<SelectContent>
								{MONTHS.map((month) => (
									<SelectItem key={month.value} value={String(month.value)} className="capitalize">
										{month.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select value={String(calendarMonth.getFullYear())} onValueChange={handleYearChange}>
							<SelectTrigger className="h-8 w-19 shrink-0 border-0 bg-transparent px-2 font-medium shadow-none focus:ring-0">
								<SelectValue />
							</SelectTrigger>

							<SelectContent className="max-h-72">
								{years.map((year) => (
									<SelectItem key={year} value={String(year)}>
										{year}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 shrink-0"
							onClick={handleNextMonth}
							aria-label="Próximo mês"
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Calendar */}
				<div className="flex justify-center px-3 py-2">
					<Calendar
						mode="single"
						selected={selectedDate}
						month={calendarMonth}
						onMonthChange={setCalendarMonth}
						onSelect={handleSelect}
						locale={ptBR}
						className="p-0"
						classNames={{
							month: "space-y-3",
							month_caption: "hidden",
							nav: "hidden",
							day: cn("h-9 w-9 rounded-md p-0", "font-normal", "aria-selected:opacity-100"),
						}}
					/>
				</div>

				{/* Time */}
				<div className="border-t px-4 py-3">
					<div className="mb-2.5 flex items-center gap-2">
						<div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted">
							<Clock3 className="h-3.5 w-3.5 text-muted-foreground" />
						</div>

						<div>
							<p className="text-sm font-medium leading-none">Horário</p>

							<p className="mt-1 text-[11px] text-muted-foreground">HH : MM : SS</p>
						</div>
					</div>

					<div className="flex items-end gap-2">
						<TimeField label="Hora" value={draftTime.hour} max={23} onChange={(value) => handleTimeChange("hour", value)} />

						<span className="mb-2.5 text-muted-foreground">:</span>

						<TimeField
							label="Min"
							value={draftTime.minute}
							max={59}
							onChange={(value) => handleTimeChange("minute", value)}
						/>

						<span className="mb-2.5 text-muted-foreground">:</span>

						<TimeField
							label="Seg"
							value={draftTime.second}
							max={59}
							onChange={(value) => handleTimeChange("second", value)}
						/>

						<Button
							type="button"
							size="icon"
							className="mb-0 h-9 w-9 shrink-0"
							onClick={handleApplyTime}
							disabled={timeError}
							aria-label="Aplicar horário"
						>
							<Check className="h-4 w-4" />
						</Button>
					</div>

					{timeError && <p className="mt-2 text-xs text-destructive">Hora: 00–23 · Minutos e segundos: 00–59</p>}
				</div>

				<div className="flex items-center justify-between border-t bg-muted/20 px-3 py-2">
					<Button type="button" variant="ghost" size="sm" onClick={handleToday} className="h-8 px-2.5 text-xs font-medium">
						Hoje
					</Button>

					{clearable && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							onClick={() => handleClear()}
							className="h-8 px-2.5 text-xs text-muted-foreground hover:text-destructive"
						>
							Limpar
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

interface TimeFieldProps {
	label: string;
	value: number;
	max: number;
	onChange: (value: string) => void;
}

const TimeField = memo(function TimeField({ label, value, max, onChange }: TimeFieldProps) {
	return (
		<div className="min-w-0 flex-1">
			<label htmlFor={label} className="mb-1 block text-[11px] font-medium text-muted-foreground">
				{label}
			</label>

			<Input
				id={label}
				type="number"
				min={0}
				max={max}
				value={pad(value)}
				onChange={(event) => onChange(event.target.value)}
				onFocus={(event) => event.target.select()}
				className={cn(
					"h-9 px-2 text-center font-mono text-sm",
					"[appearance:textfield]",
					"[&::-webkit-inner-spin-button]:appearance-none",
					"[&::-webkit-outer-spin-button]:appearance-none",
				)}
				aria-label={label}
			/>
		</div>
	);
});
