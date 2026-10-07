"use client";

import React from "react";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Modal from "@/components/General/Modal";
import type { AdminHealthServiceTableResponse } from "@/redux/services/admin/adminHealthServicesService";

interface AdminHealthServiceViewModalProps {
  open: boolean;
  onClose: () => void;
  healthService: AdminHealthServiceTableResponse;
}

const AdminHealthServiceViewModal = ({
  open,
  onClose,
  healthService,
}: AdminHealthServiceViewModalProps) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const hsOther = AccountDict.option?.healthService?.other ?? "Other";

  const name =
    healthService.name === "option.healthService.other"
      ? hsOther
      : healthService.name;

  const rows: { label: string; value: string; variant?: "green" | "red" }[] = [
    { label: dict.type, value: (dict.healthServiceTypeValues as Record<string, string>)[healthService.type] ?? (healthService.type || "-") },
    { label: dict.country, value: healthService.country || "-" },
    { label: dict.city, value: healthService.city || "-" },
    { label: dict.contactant, value: healthService.contactant || "-" },
    { label: dict.contactEmail, value: healthService.contact_email || "-" },
    { label: dict.contactPhone, value: healthService.contact_phone || "-" },
    {
      label: dict.isActive,
      value: healthService.is_active ? dict.activeValues.yes : dict.activeValues.no,
      variant: healthService.is_active ? "green" : "red",
    },
  ];

  return (
    <Modal open={open} onClose={onClose} title={name || dict.viewHealthService}>
      <div className="bg-card rounded-lg shadow-md border border-border overflow-x-auto mb-4 min-w-0">
        <table className="w-full text-sm min-w-full">
          <tbody>
            {rows.map(({ label, value, variant }) => (
              <tr key={label} className="border-b border-border last:border-0">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground sm:whitespace-nowrap bg-muted/50 w-1/3">
                  {label}
                </th>
                <td className="px-4 py-3 text-foreground break-words min-w-0">
                  {variant ? (
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-base font-medium ${
                        variant === "green"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {value}
                    </span>
                  ) : (
                    value
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default AdminHealthServiceViewModal;
