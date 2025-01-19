"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const YEAR_OPTIONS = Array.from({ length: 10 }, (_, i) => CURRENT_YEAR - i).map(
  (year) => ({ value: year.toString(), label: year.toString() }),
);

const TimeSelect = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const currentPeriod =
    searchParams.get("period") ||
    `${CURRENT_MONTH.toString().padStart(2, "0")}-${CURRENT_YEAR}`;
  const [month, year] = currentPeriod.split("-");

  const handleTimeChange = (newMonth: string, newYear: string) => {
    push(`/?period=${newMonth}-${newYear}`);
  };
  return (
    <div className="flex space-x-4">
      <Select
        onValueChange={(value) => handleTimeChange(value, year)}
        defaultValue={month}
      >
        <SelectTrigger className="w-[150px] rounded-full">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Seletor de Ano */}
      <Select
        onValueChange={(value) => handleTimeChange(month, value)}
        defaultValue={year}
      >
        <SelectTrigger className="w-[150px] rounded-full">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {YEAR_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeSelect;
