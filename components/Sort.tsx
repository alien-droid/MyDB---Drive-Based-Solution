'use client'
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter, usePathname } from "next/navigation";
import { sortTypes } from "@/constants";

const Sort = () => {
  const path = usePathname();
  const router = useRouter();

  const handleChange = (value: string) => {
    router.push(`${path}?sort=${value}`);
  };

  return (
    <Select onValueChange={handleChange} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].label} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map(({ label, value }) => (
          <SelectItem key={value} value={value} className="shad-select-item">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
