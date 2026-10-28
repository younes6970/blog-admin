"use client";
import classNames from "classnames";
import { format, parse } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getDateLib } from "react-day-picker/persian";
import { Calendar, type CalendarProps } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const dateLib = getDateLib();

type Props = {
  name: string;
  placeholder?: string;
  className?: string;
  disabled?: CalendarProps["disabled"];
  onChange?: (date: string) => void;
  value?: string; // yyyy/MM/dd
};

function parseDateString(dateStr?: string): Date | undefined {
  if (!dateStr) return undefined;
  const parsed = parse(dateStr, "yyyy/MM/dd", new Date());
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

function DatePicker({
  name,
  placeholder,
  className,
  disabled,
  onChange,
  value,
  ...props
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedDate = parseDateString(value);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ?? new Date(),
  );

  useEffect(() => {
    if (open && selectedDate) setVisibleMonth(selectedDate);
  }, [open, value]);

  const handleSelect = (date?: Date) => {
    if (!date) return;

    onChange?.(format(date, "yyyy/MM/dd"));
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild dir="rtl" className="group">
        <button
          type="button"
          className={classNames(
            className,
            "no-spinner",
            "border-input disabled:bg-light-dasht h-9 w-full min-w-0 rounded-lg border bg-white py-1 pr-3 pl-10 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "relative flex items-center justify-start",
          )}
        >
          <ChevronDownIcon className="text-gray-400 absolute left-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />

          {selectedDate ? (
            <span className="font-light">
              {dateLib.format(selectedDate, "yyyy/MM/dd")}
            </span>
          ) : (
            <span className="text-gray-400 font-light">{placeholder}</span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="start"
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest('[data-slot="select-content"]')) {
            event.preventDefault();
          }
        }}
      >
        <Calendar
          id={name}
          mode="single"
          required
          showOutsideDays={false}
          selected={selectedDate}
          month={visibleMonth}
          onMonthChange={setVisibleMonth}
          onSelect={handleSelect}
          className="rounded-xl border border-gray-200 bg-white shadow-lg"
          captionLayout="dropdown"
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
export default DatePicker;
