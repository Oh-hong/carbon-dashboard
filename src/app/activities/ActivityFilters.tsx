"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface ActivityFiltersProps {
  availableMonths: string[];
  currentFilters: {
    month?: string;
    category?: string;
    scope?: number;
  };
}

const CATEGORY_OPTIONS = [
  { value: "ELECTRICITY", label: "전기" },
  { value: "RAW_MATERIAL", label: "원소재" },
  { value: "TRANSPORT", label: "운송" },
];

const SCOPE_OPTIONS = [
  { value: "2", label: "Scope 2" },
  { value: "3", label: "Scope 3" },
];

export function ActivityFilters({ availableMonths, currentFilters }: ActivityFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string | null | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/activities?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push("/activities");
  };

  const hasFilters = currentFilters.month || currentFilters.category || currentFilters.scope;

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* 월 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">월:</span>
            <Select
              value={currentFilters.month ?? "all"}
              onValueChange={(value) => updateFilter("month", value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {availableMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month.replace("-", "년 ")}월
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">카테고리:</span>
            <Select
              value={currentFilters.category ?? "all"}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {CATEGORY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Scope 필터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Scope:</span>
            <Select
              value={currentFilters.scope?.toString() ?? "all"}
              onValueChange={(value) => updateFilter("scope", value)}
            >
              <SelectTrigger className="w-28">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                {SCOPE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 필터 초기화 */}
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4 mr-1" />
              초기화
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
