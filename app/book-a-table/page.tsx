"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Info,
  MapPin,
  Minus,
  Plus,
  UsersRound,
} from "lucide-react";
import type {
  Area,
  TableData,
  TableSceneProps,
} from "@/app/Componants/TableScene";

const TableScene = dynamic<TableSceneProps>(
  () => import("@/app/Componants/TableScene"),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-[#14110f] text-sm text-stone-400">
        Loading the dining room...
      </div>
    ),
  },
);

const TABLES: Record<Area, TableData[]> = {
  indoor: [
    {
      id: 1,
      label: "T-01",
      x: -6,
      z: -4.5,
      seats: 2,
      shape: "round",
      reserved: false,
    },
    {
      id: 2,
      label: "T-02",
      x: 0,
      z: -4.5,
      seats: 4,
      shape: "square",
      reserved: false,
    },
    {
      id: 3,
      label: "T-03",
      x: 6,
      z: -4.5,
      seats: 6,
      shape: "round",
      reserved: true,
    },
    {
      id: 4,
      label: "T-04",
      x: -6,
      z: -0.5,
      seats: 2,
      shape: "square",
      reserved: false,
    },
    {
      id: 5,
      label: "T-05",
      x: 0,
      z: -0.5,
      seats: 4,
      shape: "round",
      reserved: false,
    },
    {
      id: 6,
      label: "T-06",
      x: 6,
      z: -0.5,
      seats: 4,
      shape: "square",
      reserved: false,
    },
    {
      id: 7,
      label: "T-07",
      x: 5.5,
      z: 3,
      seats: 3,
      shape: "round",
      reserved: false,
    },
    {
      id: 8,
      label: "T-08",
      x: 0,
      z: 3.5,
      seats: 2,
      shape: "round",
      reserved: false,
    },
    {
      id: 9,
      label: "T-09",
      x: -5.5,
      z: 3,
      seats: 3,
      shape: "round",
      reserved: false,
    },
  ],
  // Organized layout: 3 tables / 2 tables (staggered) / 3 tables
  outdoor: [
    {
      id: 11,
      label: "T-01",
      x: -6,
      z: -4.6,
      seats: 4,
      shape: "round",
      reserved: false,
    },
    {
      id: 12,
      label: "T-02",
      x: 0,
      z: -4.6,
      seats: 6,
      shape: "round",
      reserved: false,
    },
    {
      id: 13,
      label: "T-03",
      x: 6,
      z: -4.6,
      seats: 4,
      shape: "round",
      reserved: false,
    },
    {
      id: 14,
      label: "T-04",
      x: -3,
      z: -0.8,
      seats: 4,
      shape: "square",
      reserved: true,
    },
    {
      id: 15,
      label: "T-05",
      x: 3,
      z: -0.8,
      seats: 4,
      shape: "square",
      reserved: false,
    },
    {
      id: 16,
      label: "T-06",
      x: -6,
      z: 3,
      seats: 2,
      shape: "round",
      reserved: false,
    },
    {
      id: 17,
      label: "T-07",
      x: 0,
      z: 3,
      seats: 4,
      shape: "round",
      reserved: false,
    },
    {
      id: 18,
      label: "T-08",
      x: 6,
      z: 3,
      seats: 2,
      shape: "round",
      reserved: false,
    },
  ],
};

const TIME_SLOTS = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
];
const STORAGE_KEY = "gusto-reservations";
// Local date (YYYY-MM-DD), not UTC, so "today" is correct for the visitor
const today = new Date().toLocaleDateString("en-CA");

type Booking = {
  id: string;
  area: Area;
  tableId: number;
  tableLabel: string;
  guests: number;
  date: string;
  time: string;
  guestName: string;
  createdAt: string;
};

function createBookingId() {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().replaceAll("-", "").slice(0, 6)
      : Math.random().toString(36).slice(2, 8);
  return `GST-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${random.toUpperCase()}`;
}

function getStoredBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Booking[]) : [];
  } catch {
    return [];
  }
}

/* Shared input styling so every field stays identical on all screen sizes */
const FIELD =
  "h-12 w-full rounded-xl border border-white/10 bg-[#0e0d0c] px-3 text-base text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/15 sm:text-sm";

export default function BookATable() {
  const [area, setArea] = useState<Area>("indoor");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("7:00 PM");
  const [guestName, setGuestName] = useState("");
  const [bookings, setBookings] = useState<Booking[]>(getStoredBookings);
  const [confirmation, setConfirmation] = useState<Booking | null>(null);

  const tables = useMemo(
    () =>
      TABLES[area].map((table) => ({
        ...table,
        reserved:
          table.reserved ||
          bookings.some(
            (b) =>
              b.area === area &&
              b.tableId === table.id &&
              b.date === date &&
              b.time === time,
          ),
      })),
    [area, bookings, date, time],
  );
  const selected = useMemo(
    () => tables.find((table) => table.id === selectedId),
    [tables, selectedId],
  );
  const canConfirm = Boolean(selected && !selected.reserved && date);

  const resetConfirmation = () => setConfirmation(null);
  const changeArea = (next: Area) => {
    setArea(next);
    setSelectedId(null);
    resetConfirmation();
  };
  const changeGuests = (next: number) => {
    setGuests(next);
    if (selected && selected.seats < next) setSelectedId(null);
    resetConfirmation();
  };

  const confirm = () => {
    if (!canConfirm || !selected) return;
    const booking: Booking = {
      id: createBookingId(),
      area,
      tableId: selected.id,
      tableLabel: selected.label,
      guests,
      date,
      time,
      guestName: guestName.trim() || "Guest",
      createdAt: new Date().toISOString(),
    };
    const nextBookings = [...bookings, booking];
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBookings));
    } catch {
      /* Keep the confirmation usable if storage is unavailable. */
    }
    setBookings(nextBookings);
    setConfirmation(booking);
  };

  const areaTitle =
    area === "indoor" ? "The dining room" : "The outdoor terrace";

  return (
    <main className="min-h-[100dvh] overflow-x-clip bg-[#0c0b0a] pb-12 pt-24 text-stone-100 sm:pb-16 sm:pt-32">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <header className="mb-6 grid gap-4 border-b border-white/10 pb-6 sm:mb-8 sm:gap-5 sm:pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-400 sm:mb-3">
              Reservations
            </p>
            <h1 className="max-w-xl text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
              Set the scene for your evening.
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-stone-400 sm:text-base">
              Choose where you would like to dine, then select a table that fits
              your party.
            </p>
          </div>
          <p className="flex items-center gap-3 text-sm text-stone-400">
            <MapPin className="h-4 w-4 text-red-400" />
            Gusto, Downtown
          </p>
        </header>

        {/* Area switcher: full width on phones, compact on larger screens */}
        <div
          className="mb-5 flex w-full gap-1 rounded-2xl border border-white/10 bg-[#171412] p-1.5 sm:mb-6 sm:w-fit"
          role="tablist"
          aria-label="Dining area"
        >
          {(["indoor", "outdoor"] as Area[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => changeArea(option)}
              role="tab"
              aria-selected={area === option}
              className={`flex-1 whitespace-nowrap rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition sm:flex-none sm:px-5 ${
                area === option
                  ? "bg-red-600 text-white shadow-[0_8px_24px_rgba(220,38,38,0.26)]"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              {option === "indoor" ? "Dining room" : "Outdoor terrace"}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <section className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#15110f] shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
            <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div>
                <h2 className="font-semibold text-white">{areaTitle}</h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  Select a bright table to continue
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-stone-100" />
                  Available
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  Your selection
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                  Unavailable
                </span>
              </div>
            </div>

            <div className="relative h-[clamp(440px,68dvh,560px)] sm:h-[560px] lg:h-[650px]">
              <TableScene
                area={area}
                tables={tables}
                guests={guests}
                selectedId={selectedId}
                onSelect={(id) => {
                  setSelectedId(id);
                  resetConfirmation();
                }}
              />
              <p className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] rounded-lg border border-white/10 bg-black/55 px-2.5 py-1.5 text-[11px] text-stone-300 backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-2 sm:text-xs">
                <span className="sm:hidden">
                  Swipe sideways to rotate · Pinch to zoom
                </span>
                <span className="hidden sm:inline">
                  Drag to explore <span className="mx-1 text-stone-600">|</span>{" "}
                  Scroll to zoom
                </span>
              </p>
            </div>
          </section>

          <aside className="min-w-0 xl:sticky xl:top-24 xl:self-start">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#171412] shadow-[0_20px_70px_rgba(0,0,0,0.28)]">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
                  Your reservation
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Reservation details
                </h2>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {/* On tablets the date/time sit side by side to save height */}
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-stone-200">
                    Reservation name{" "}
                    <span className="font-normal text-stone-500">
                      (optional)
                    </span>
                  </span>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => {
                      setGuestName(e.target.value);
                      resetConfirmation();
                    }}
                    placeholder="Your full name"
                    autoComplete="name"
                    className={`${FIELD} placeholder:text-stone-600`}
                  />
                </label>

                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                  <label className="block min-w-0">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
                      <CalendarDays className="h-4 w-4 text-red-400" />
                      Date
                    </span>
                    <input
                      type="date"
                      min={today}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        resetConfirmation();
                      }}
                      className={`${FIELD} [color-scheme:dark]`}
                    />
                  </label>

                  <label className="block min-w-0">
                    <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
                      <Clock3 className="h-4 w-4 text-red-400" />
                      Arrival time
                    </span>
                    <select
                      value={time}
                      onChange={(e) => {
                        setTime(e.target.value);
                        resetConfirmation();
                      }}
                      className={FIELD}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
                    <UsersRound className="h-4 w-4 text-red-400" />
                    Party size
                  </span>
                  <div className="flex h-12 items-center justify-between rounded-xl border border-white/10 bg-[#0e0d0c] p-1.5">
                    <button
                      type="button"
                      onClick={() => changeGuests(Math.max(1, guests - 1))}
                      disabled={guests === 1}
                      aria-label="Remove a guest"
                      className="grid h-10 w-10 place-items-center rounded-lg text-stone-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-white">
                      {guests} {guests === 1 ? "guest" : "guests"}
                    </span>
                    <button
                      type="button"
                      onClick={() => changeGuests(Math.min(6, guests + 1))}
                      disabled={guests === 6}
                      aria-label="Add a guest"
                      className="grid h-10 w-10 place-items-center rounded-lg text-stone-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    selected
                      ? "border-red-500/30 bg-red-500/[0.07]"
                      : "border-white/8 bg-white/[0.03]"
                  }`}
                >
                  {selected ? (
                    <div className="flex gap-3">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-red-500 text-white">
                        <Check className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">
                          Table {selected.label} selected
                        </p>
                        <p className="mt-1 text-xs leading-5 text-stone-400">
                          {area === "indoor"
                            ? "Dining room"
                            : "Outdoor terrace"}{" "}
                          • Seats up to {selected.seats}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-stone-500" />
                      <p className="text-sm leading-5 text-stone-400">
                        Choose an available table from the map. Tables that do
                        not fit your party are unavailable.
                      </p>
                    </div>
                  )}
                </div>

                {confirmation ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                    <p className="flex items-center gap-2 font-semibold text-emerald-300">
                      <Check className="h-4 w-4" />
                      Reservation confirmed
                    </p>
                    <p className="mt-2 leading-5">
                      Thanks, {confirmation.guestName}. Your table is held for{" "}
                      {confirmation.time}.
                    </p>
                    <p className="mt-3 break-all border-t border-emerald-400/20 pt-3 text-xs text-emerald-200/80">
                      Booking reference{" "}
                      <span className="font-semibold text-emerald-200">
                        {confirmation.id}
                      </span>
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={confirm}
                    disabled={!canConfirm}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(220,38,38,0.22)] transition hover:bg-red-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400 disabled:shadow-none"
                  >
                    {selected ? "Confirm reservation" : "Select a table"}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-3 px-1 text-center text-xs leading-5 text-stone-500">
              Your table will be held for 15 minutes after your selected arrival
              time.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
