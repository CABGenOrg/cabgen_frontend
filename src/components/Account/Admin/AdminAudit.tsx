"use client";

import React, { useMemo, useRef, useState } from "react";
import { Search, ScrollText, X } from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import { SmartSelect } from "@/components/General/SmartSelect";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetAuditQuery,
  useGetAuditSelectOptionsQuery,
  type AdminAuditResponse,
} from "@/redux/services/admin/adminAuditService";
import { input_class } from "@/styles/tailwind_classes";

const columnHelper = createColumnHelper<AdminAuditResponse>();

const formatDate = (value: string | null | undefined, lang: string) => {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d.getTime())
    ? "-"
    : d.toLocaleDateString(lang, { timeZone: "UTC" });
};

const AdminAudit = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const adminDict = AccountDict.admin;
  const auditDict = adminDict.audit;

  const [filters, setFilters] = useState<{
    source: string;
    status: string;
    date: string;
    user_id: string;
    event: string;
  }>({ source: "", status: "", date: "", user_id: "", event: "" });
  // Controlled values for text/date inputs so the clear button resets what is visible
  const [inputs, setInputs] = useState({ source: "", status: "", date: "" });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleFilterChange = (key: string, value: string) => {
    setInputs((v) => ({ ...v, [key]: value }));
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, [key]: value }));
    }, 300);
  };

  const clearFilters = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setInputs({ source: "", status: "", date: "" });
    setFilters({ source: "", status: "", date: "", user_id: "", event: "" });
  };

  const { data = [], isLoading } = useGetAuditQuery(filters);
  const { data: options } = useGetAuditSelectOptionsQuery();
  const userOptions = options?.users ?? [];
  const eventOptions = options?.events ?? [];

  const columns = useMemo(
    () => [
      columnHelper.accessor("event", {
        header: auditDict.event,
        size: 150,
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[150px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("source", {
        header: auditDict.source,
        size: 150,
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[150px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: auditDict.status,
        size: 100,
        cell: (info) => info.getValue() ?? "-",
      }),
      columnHelper.accessor("username", {
        header: adminDict.user,
        size: 150,
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[150px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.accessor("created_at", {
        header: auditDict.date,
        size: 110,
        cell: (info) => formatDate(info.getValue(), lang),
      }),
      columnHelper.accessor("metadata", {
        header: auditDict.metadata,
        size: 200,
        meta: { responsive: "hidden lg:table-cell" },
        cell: (info) => (
          <span
            title={info.getValue() || ""}
            className="line-clamp-2 sm:truncate sm:block sm:max-w-[200px]"
          >
            {info.getValue() || "-"}
          </span>
        ),
      }),
    ],
    [adminDict, auditDict, lang],
  );

  return (
    <div className="w-full">
      <PageHeader icon={<ScrollText size={24} />} title={auditDict.title} />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={inputs.source}
            placeholder={auditDict.filterBySource}
            className={`${input_class} pl-9`}
            onChange={(e) => handleFilterChange("source", e.target.value)}
          />
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            value={inputs.status}
            placeholder={auditDict.filterByStatus}
            className={`${input_class} pl-9`}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          />
        </div>
        <div className="sm:w-48 sm:flex-none">
          <input
            type="date"
            value={inputs.date}
            aria-label={auditDict.filterByDate}
            className={input_class}
            lang={lang}
            onChange={(e) => {
              setInputs((v) => ({ ...v, date: e.target.value }));
              setFilters((f) => ({ ...f, date: e.target.value }));
            }}
          />
        </div>
        <div className="sm:w-48 sm:flex-none">
          <SmartSelect
            value={filters.user_id}
            onChange={(value) => setFilters((f) => ({ ...f, user_id: value }))}
            options={userOptions}
            placeholder={auditDict.filterByUser}
            searchable
          />
        </div>
        <div className="sm:w-48 sm:flex-none">
          <SmartSelect
            value={filters.event}
            onChange={(value) => setFilters((f) => ({ ...f, event: value }))}
            options={eventOptions}
            placeholder={auditDict.filterByEvent}
            searchable
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilters}
          className="sm:w-48 sm:flex-none"
        >
          <X size={16} />
          {auditDict.clearFilters}
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={isLoading}
        emptyMessage={auditDict.noAudit}
        countLabel={auditDict.showingAudit}
      />
    </div>
  );
};

export default AdminAudit;
