"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const StatCardSkeleton = () => (
  <div className="bg-card rounded-lg shadow-md border border-border p-5 flex items-center gap-4">
    <Skeleton className="w-12 h-12 rounded-full shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export const ChartCardSkeleton = () => (
  <div className="bg-card rounded-lg shadow-md border border-border p-5 flex flex-col">
    <Skeleton className="h-6 w-2/3 mb-4" />
    <Skeleton className="h-[250px] md:h-[300px] w-full rounded-lg" />
  </div>
);

export const BoxInfoSkeleton = () => (
  <div className="grid lg:grid-cols-2 sm:grid-cols-1 grid-cols-2 content-around lg:gap-4 gap-2">
    {Array.from({ length: 4 }).map((_, idx) => (
      <div
        key={idx}
        className="flex flex-col justify-center items-center bg-muted p-2 rounded-xl 2xl:h-64 2xl:w-64 sm:h-48 sm:w-52 h-44 w-36"
      >
        <Skeleton className="2xl:h-3/5 sm:h-1/2 h-2/5 aspect-square rounded-full" />
        <div className="mt-2 flex flex-col items-center gap-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    ))}
  </div>
);

export const OverviewSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-64" />

    <div className="bg-card rounded-lg shadow-md p-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>

    <div className="grid sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <StatCardSkeleton key={idx} />
      ))}
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ChartCardSkeleton key={idx} />
      ))}
    </div>
  </div>
);

export const AdminOverviewSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-64" />

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 9 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-card rounded-lg shadow-md border border-border p-5 flex items-center gap-4"
        >
          <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          <Skeleton className="h-6 w-32" />
        </div>
      ))}
    </div>

    <div className="border-t border-border pt-6 mt-2">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <StatCardSkeleton key={idx} />
        ))}
      </div>
    </div>

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 10 }).map((_, idx) => (
        <ChartCardSkeleton key={idx} />
      ))}
    </div>
  </div>
);

export const TableSkeleton = ({
  columns,
  rows = 6,
}: {
  columns: number;
  rows?: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <tr key={rowIdx} className="border-b border-border">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <td key={colIdx} className="px-2 sm:px-3 py-2.5">
            <Skeleton className="h-4 w-full max-w-[80%]" />
          </td>
        ))}
      </tr>
    ))}
  </>
);
