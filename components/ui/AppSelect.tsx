"use client";

/**
 * AppSelect — Reusable select/dropdown built on Headless UI v2 Listbox
 *
 * Install:  pnpm add @headlessui/react
 *
 * Usage:
 *   <AppSelect
 *     value={faculty}
 *     onChange={setFaculty}
 *     options={[{ value: "cs", label: "Computer Science" }]}
 *     placeholder="Select faculty"
 *   />
 */

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface AppSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Show a subtle error ring */
  error?: boolean;
}

export function AppSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  disabled = false,
  className = "",
  error = false,
}: AppSelectProps) {
  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      {/* ── Trigger Button ── */}
      <ListboxButton
        className={[
          // Base
          "group relative flex w-full items-center gap-2 px-3.5 py-2.5 rounded-xl border-2",
          "text-sm font-medium text-left transition-all duration-200 outline-none cursor-pointer",
          "bg-white dark:bg-[#3d3533]",
          // States
          disabled
            ? "opacity-50 cursor-not-allowed border-gray-200 dark:border-[#4a4441]"
            : error
              ? "border-red-400 focus:border-red-500 ring-2 ring-red-200 dark:ring-red-900/30"
              : [
                  "border-gray-200 dark:border-[#4a4441]",
                  "hover:border-orange-300 dark:hover:border-[#C96442]/60",
                  "data-[open]:border-orange-500 data-[open]:ring-2 data-[open]:ring-orange-200",
                  "dark:data-[open]:border-[#C96442] dark:data-[open]:ring-[#C96442]/20",
                ].join(" "),
          className,
        ].join(" ")}
      >
        {/* Value / Placeholder */}
        <span
          className={[
            "flex-1 truncate",
            selected
              ? "text-gray-900 dark:text-[#f0ebe5]"
              : "text-gray-400 dark:text-[#5a5350]",
          ].join(" ")}
        >
          {selected?.label ?? placeholder}
        </span>

        {/* Chevron */}
        <ChevronDown
          className={[
            "h-4 w-4 shrink-0 transition-transform duration-200",
            "text-gray-400 dark:text-[#5a5350]",
            "group-data-[open]:rotate-180 group-data-[open]:text-orange-500 dark:group-data-[open]:text-[#C96442]",
          ].join(" ")}
        />
      </ListboxButton>

      {/* ── Dropdown Panel ── */}
      <ListboxOptions
        anchor="bottom start"
        transition
        className={[
          // Layout & sizing
          "w-[var(--button-width)] z-50 mt-1.5 rounded-xl overflow-hidden",
          // Visual
          "bg-white dark:bg-[#2a2622]",
          "border border-gray-100 dark:border-[#4a4441]",
          "shadow-xl shadow-black/10 dark:shadow-black/40",
          // Transition
          "origin-top transition duration-150 ease-out",
          "data-[closed]:scale-95 data-[closed]:opacity-0",
        ].join(" ")}
      >
        {/* Thin orange accent line at top */}
        <div className="h-0.5 bg-gradient-to-r from-orange-400 to-orange-300 dark:from-[#C96442] dark:to-[#B5563A]" />

        <div
          className="py-1.5 px-1.5 max-h-56 overflow-y-auto"
          style={{ scrollbarWidth: "thin" }}
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className={[
                "group flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer",
                "text-sm font-medium transition-colors duration-100 select-none",
                "text-gray-700 dark:text-[#e8e0d8]",
                // Hover
                "data-[focus]:bg-orange-50 data-[focus]:text-orange-700",
                "dark:data-[focus]:bg-[#C96442]/15 dark:data-[focus]:text-[#f0ebe5]",
                // Selected
                "data-[selected]:bg-orange-100 data-[selected]:text-orange-700 data-[selected]:font-semibold",
                "dark:data-[selected]:bg-[#C96442]/25 dark:data-[selected]:text-[#f0ebe5]",
                // Disabled
                option.disabled ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {/* Check icon */}
              <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                <Check className="h-3.5 w-3.5 text-orange-500 dark:text-[#C96442] opacity-0 group-data-[selected]:opacity-100 transition-opacity" />
              </span>
              <span className="truncate">{option.label}</span>
            </ListboxOption>
          ))}
        </div>

        {/* Thin bottom accent */}
        <div className="h-0.5 bg-gray-50 dark:bg-[#3d3533]" />
      </ListboxOptions>
    </Listbox>
  );
}
