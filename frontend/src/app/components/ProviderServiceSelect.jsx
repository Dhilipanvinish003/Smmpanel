"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../components/ui/popover";
import { Input } from "../components/ui/input";
import { cn } from "../components/ui/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";

export function ProviderServiceSelect({ services, value, onSelect }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const selectedService = useMemo(
    () => services.find((s) => String(s.provider_service_id) === String(value)),
    [services, value]
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return services.slice(0, 30);
    const q = search.toLowerCase();
    return services.filter((s) => {
      const id = String(s.provider_service_id);
      const name = (s.name || "").toLowerCase();
      const type = (s.type || "").toLowerCase();
      const provider = (s.provider || "").toLowerCase();
      return (
        id.includes(q) ||
        name.includes(q) ||
        type.includes(q) ||
        provider.includes(q)
      );
    }).slice(0, 30);
  }, [services, search]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filtered.length]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleSelect = useCallback(
    (service) => {
      onSelect(service);
      setOpen(false);
      setSearch("");
    },
    [onSelect]
  );

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filtered[highlightedIndex]) {
          handleSelect(filtered[highlightedIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  };

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          style={{ width: "100%", maxWidth: "100%", minWidth: "0", boxSizing: "border-box", overflow: "hidden" }}
          className={cn(
            "flex h-9 items-center justify-between rounded-md border border-input bg-input-background px-3 py-2 text-sm transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "hover:bg-accent/50 cursor-pointer"
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: "0", flex: "1" }}
                className={cn("text-left", !selectedService && "text-muted-foreground")}
              >
                {selectedService
                  ? `#${selectedService.provider_service_id} - ${selectedService.name}`
                  : "Select provider service"}
              </span>
            </TooltipTrigger>
            {selectedService && (
              <TooltipContent side="top" align="start" className="max-w-[400px] break-words">
                <p>#{selectedService.provider_service_id} - {selectedService.name}</p>
              </TooltipContent>
            )}
          </Tooltip>
          <svg
            className="size-4 shrink-0 opacity-50 ml-2"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="M7 9l5-5 5 5" />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) min-w-[200px] max-w-[calc(100vw-2rem)] p-0"
        align="start"
        sideOffset={4}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="p-2 pb-0">
          <Input
            ref={inputRef}
            placeholder="Search by ID, name, platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-slate-50 border-slate-200 focus:bg-white rounded-lg"
          />
        </div>
        <div
          ref={listRef}
          className="max-h-[320px] overflow-y-auto p-1"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No services found
            </div>
          ) : (
            filtered.map((service, index) => (
              <div
                key={service._id}
                role="option"
                aria-selected={highlightedIndex === index}
                className={cn(
                  "relative flex flex-col rounded-sm px-3 py-2.5 text-sm outline-none cursor-pointer",
                  "transition-colors",
                  highlightedIndex === index
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent/50"
                )}
                onClick={() => handleSelect(service)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                <div className="font-mono text-xs text-muted-foreground">
                  #{service.provider_service_id}
                </div>
                <div className="font-medium text-sm mt-0.5 truncate" title={service.name}>
                  {service.name}
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 mt-1.5 text-xs text-muted-foreground">
                  <span>Provider: {service.provider}</span>
                  <span>Rate: ${Number(service.rate).toFixed(2)}</span>
                  <span>Min: {service.min}</span>
                  <span>Max: {service.max}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}