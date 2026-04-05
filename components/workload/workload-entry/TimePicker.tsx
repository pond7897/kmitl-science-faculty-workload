"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TimePickerProps {
  value: string; // "HH:mm" format, empty string = no value
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  hasError?: boolean; // ← NEW: show red border when true
}

// ── Data ────────────────────────────────────────────────────
const HOURS = Array.from({ length: 24 }, (_, i) =>
  String(i).padStart(2, "0"),
);
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0"),
);

const ITEM_H = 36;

// ── Single scrollable column ─────────────────────────────────
function TimeColumn({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx === -1 || !listRef.current) return;
    listRef.current.scrollTo({ top: idx * ITEM_H - ITEM_H, behavior: "smooth" });
  }, [selected, items]);

  return (
    <div
      ref={listRef}
      className="h-[180px] overflow-y-auto scroll-smooth"
      style={{ scrollbarWidth: "thin" }}
    >
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <button
            key={item}
            type="button"
            onClick={() => onSelect(item)}
            style={{ height: ITEM_H }}
            className={[
              "w-full flex items-center justify-center font-mono text-sm font-semibold rounded-lg transition-all duration-150 cursor-pointer",
              isSelected
                ? "bg-orange-500 text-white dark:bg-[#C96442] shadow-sm"
                : "text-gray-600 dark:text-[#c8bfb8] hover:bg-orange-50 dark:hover:bg-[#C96442]/15 hover:text-orange-600 dark:hover:text-[#C96442]",
            ].join(" ")}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}

// ── Main TimePicker ──────────────────────────────────────────
export function TimePicker({
  value,
  onChange,
  disabled = false,
  placeholder = "--:--",
  className = "",
  hasError = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [hour, minute] = value ? value.split(":") : ["", ""];
  const hasValue = !!hour && !!minute;

  const handleHourSelect = (h: string) => onChange(`${h}:${minute || "00"}`);
  const handleMinuteSelect = (m: string) => onChange(`${hour || "00"}:${m}`);

  // Determine border/ring style based on state priority:
  // open > hasError > hasValue > default
  const triggerBorderClass = open
    ? "border-orange-500 ring-2 ring-orange-200 dark:border-[#C96442] dark:ring-[#C96442]/20"
    : hasError
      ? "border-red-400 ring-2 ring-red-200 dark:border-red-500 dark:ring-red-500/20"
      : hasValue
        ? "border-orange-300 dark:border-[#C96442]/60 hover:border-orange-400"
        : "border-gray-200 dark:border-[#4a4441] hover:border-orange-300 dark:hover:border-[#C96442]/50";

  return (
    <Popover open={open} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={[
            "group flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer",
            "bg-white dark:bg-[#2a2622]",
            hasError && !open ? "bg-red-50 dark:bg-red-900/10" : "",
            triggerBorderClass,
            disabled ? "opacity-50 cursor-not-allowed" : "",
            className,
          ].join(" ")}
        >
          <Clock
            className={[
              "h-4 w-4 shrink-0 transition-colors",
              open
                ? "text-orange-500 dark:text-[#C96442]"
                : hasError
                  ? "text-red-400 dark:text-red-400"
                  : hasValue
                    ? "text-orange-500 dark:text-[#C96442]"
                    : "text-gray-400 dark:text-[#5a5350]",
            ].join(" ")}
          />
          <span
            className={[
              "flex-1 text-left font-mono text-sm font-semibold tracking-wider",
              hasValue
                ? "text-gray-900 dark:text-[#f0ebe5]"
                : hasError
                  ? "text-red-400 dark:text-red-400"
                  : "text-gray-400 dark:text-[#5a5350]",
            ].join(" ")}
          >
            {hour || "--"}
            <span
              className={[
                "mx-0.5 font-black",
                hasError && !open
                  ? "text-red-300 dark:text-red-500/70"
                  : "text-orange-400 dark:text-[#C96442]/70",
              ].join(" ")}
            >
              :
            </span>
            {minute || "--"}
          </span>
          <ChevronDown
            className={[
              "h-3.5 w-3.5 shrink-0 transition-all duration-200",
              open
                ? "rotate-180 text-orange-500 dark:text-[#C96442]"
                : hasError
                  ? "text-red-400 dark:text-red-400"
                  : "text-gray-400 dark:text-[#5a5350]",
            ].join(" ")}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-52 p-3 rounded-2xl shadow-xl border border-gray-100 dark:border-[#4a4441] dark:bg-[#2a2622]"
        align="start"
        sideOffset={6}
      >
        {/* Column headers */}
        <div className="grid grid-cols-2 mb-2">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#8b7f77]">
            ชั่วโมง
          </p>
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-[#8b7f77]">
            นาที
          </p>
        </div>
        <div className="h-px bg-orange-100 dark:bg-[#C96442]/20 mb-2" />

        {/* Two scroll columns */}
        <div className="flex gap-3">
          <div className="flex-1">
            <TimeColumn items={HOURS} selected={hour || ""} onSelect={handleHourSelect} />
          </div>
          <div className="w-px bg-orange-100 dark:bg-[#C96442]/20 self-stretch" />
          <div className="flex-1">
            <TimeColumn items={MINUTES} selected={minute || ""} onSelect={handleMinuteSelect} />
          </div>
        </div>

        {/* Done button */}
        <div className="mt-2 pt-2 border-t border-orange-100 dark:border-[#C96442]/20">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="w-full h-8 rounded-lg bg-orange-500 hover:bg-orange-600 dark:bg-[#C96442] dark:hover:bg-[#B5563A] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            ยืนยัน
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}