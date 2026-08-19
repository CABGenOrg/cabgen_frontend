"use client";

import { useState, useMemo, useCallback } from "react";
import {
  MessageSquare,
  UserCheck,
  CheckCircle,
  Trash2,
  Eye,
} from "lucide-react";
import { createColumnHelper } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/General/PageHeader";
import DataTable from "@/components/General/DataTable";
import DeleteConfirmModal from "@/components/General/DeleteConfirmModal";
import Modal from "@/components/General/Modal";
import IconButton from "@/components/General/IconButton";
import { useLanguage } from "@/redux/LanguageContext";
import { useAuth } from "@/redux/AuthContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import {
  useGetTicketsQuery,
  useAssignTicketMutation,
  useResolveTicketMutation,
  useDeleteTicketMutation,
} from "@/redux/services/admin/adminTicketsService";
import type { TicketResponse } from "@/redux/services/admin/adminTicketsService";

const columnHelper = createColumnHelper<TicketResponse>();

const FILTERS = [
  { label: "My", value: "MY" },
  { label: "Open", value: "OPEN" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "All", value: "ALL" },
] as const;

const AdminTickets = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const { user } = useAuth();

  const [statusFilter, setStatusFilter] =
    useState<(typeof FILTERS)[number]["value"]>("OPEN");
  const [modal, setModal] = useState<{
    type: "delete" | "view" | null;
    ticket?: TicketResponse;
  }>({ type: null });
  const closeModal = () => setModal({ type: null });

  const filterConfig = FILTERS.find((f) => f.value === statusFilter);
  const isMyTickets = filterConfig?.value === "MY";
  const status =
    isMyTickets || filterConfig?.value === "ALL" ? "" : statusFilter;
  const adminID = isMyTickets ? (user?.id ?? "") : "";

  const { data = [], isLoading: loadingTickets } = useGetTicketsQuery({
    status,
    adminID,
  });
  const [assignTicket] = useAssignTicketMutation();
  const [resolveTicket] = useResolveTicketMutation();
  const [deleteTicket, { isLoading: deleting, error: deleteError }] =
    useDeleteTicketMutation();

  const handleAssign = useCallback(
    async (ticketId: string) => {
      try {
        await assignTicket(ticketId).unwrap();
      } catch {}
    },
    [assignTicket],
  );

  const handleResolve = useCallback(
    async (ticketId: string) => {
      try {
        await resolveTicket(ticketId).unwrap();
      } catch {}
    },
    [resolveTicket],
  );

  const handleDelete = async () => {
    try {
      await deleteTicket(modal.ticket?.id ?? "").unwrap();
      closeModal();
    } catch {}
  };

  const statusVariant = (status: string) => {
    switch (status) {
      case "OPEN":
        return "pending";
      case "IN_PROGRESS":
        return "running";
      case "RESOLVED":
        return "done";
      default:
        return "default";
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: dict.name,
        size: 150,
      }),
      columnHelper.accessor("email", {
        header: dict.email,
        size: 180,
      }),
      columnHelper.accessor("subject", {
        header: dict.subject,
        size: 200,
      }),
      columnHelper.accessor("status", {
        header: dict.status,
        size: 110,
        cell: (info) => {
          const status = info.getValue();
          return (
            <Badge variant={statusVariant(status) as never}>
              {(dict.ticketStatusValues as Record<string, string>)[status] ??
                status}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("admin", {
        header: dict.adminLabel,
        size: 150,
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("created_at", {
        header: dict.createdAt,
        size: 120,
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString(
            lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: dict.actions,
        size: 130,
        cell: (info) => {
          const ticket = info.row.original;
          return (
            <div className="flex items-center gap-1.5">
              <IconButton
                label={dict.view}
                icon={<Eye size={18} />}
                onClick={() => setModal({ type: "view", ticket })}
              />
              {ticket.status === "OPEN" && (
                <IconButton
                  variant="success"
                  label={dict.assign}
                  icon={<UserCheck size={18} />}
                  onClick={() => handleAssign(ticket.id)}
                />
              )}
              {ticket.status === "IN_PROGRESS" && (
                <IconButton
                  variant="info"
                  label={dict.resolve}
                  icon={<CheckCircle size={18} />}
                  onClick={() => handleResolve(ticket.id)}
                />
              )}
              {ticket.status === "RESOLVED" && (
                <IconButton
                  variant="danger"
                  label={dict.delete}
                  icon={<Trash2 size={18} />}
                  onClick={() => setModal({ type: "delete", ticket })}
                />
              )}
            </div>
          );
        },
      }),
    ],
    [dict, lang, handleAssign, handleResolve],
  );

  return (
    <div className="w-full">
      <PageHeader icon={<MessageSquare size={24} />} title={dict.tickets} />

      <div className="flex gap-2 mb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 ${
              statusFilter === filter.value
                ? "bg-cabgen-200 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {(dict.filterValues as Record<string, string>)[filter.label] ??
              filter.label}
          </button>
        ))}
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={loadingTickets}
        emptyMessage={dict.noTickets}
        countLabel={dict.showingTickets}
      />

      <Modal
        open={modal.type === "view"}
        onClose={closeModal}
        title={modal.ticket?.subject || ""}
      >
        {modal.ticket && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant(modal.ticket.status) as never}>
                {(dict.ticketStatusValues as Record<string, string>)[
                  modal.ticket.status
                ] ?? modal.ticket.status}
              </Badge>
              <span className="text-sm text-gray-500">
                {new Date(modal.ticket.created_at).toLocaleDateString(
                  lang === "pt" ? "pt-BR" : lang === "es" ? "es-ES" : "en-US",
                )}
              </span>
            </div>
            <div className="text-sm">
              <p>
                <span className="font-semibold">{dict.name}:</span>{" "}
                {modal.ticket.name}
              </p>
              <p>
                <span className="font-semibold">{dict.email}:</span>{" "}
                {modal.ticket.email}
              </p>
              {modal.ticket.institution && (
                <p>
                  <span className="font-semibold">{dict.institution}:</span>{" "}
                  {modal.ticket.institution}
                </p>
              )}
              {modal.ticket.admin && (
                <p>
                  <span className="font-semibold">{dict.adminLabel}:</span>{" "}
                  {modal.ticket.admin}
                </p>
              )}
            </div>
            <div className="border-t pt-3">
              <p className="font-semibold mb-1">{dict.message}:</p>
              <p className="text-gray-700 whitespace-pre-wrap">
                {modal.ticket.message}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <DeleteConfirmModal
        open={modal.type === "delete"}
        onClose={closeModal}
        entityName={modal.ticket?.subject || ""}
        onDelete={handleDelete}
        deleting={deleting}
        error={
          typeof deleteError === "string" && deleteError === "internalServer"
            ? Errors[deleteError]
            : String(deleteError)
        }
        dict={{
          delete: dict.delete,
          cancel: dict.cancel,
          deleteConfirm: dict.deleteConfirm,
        }}
      />
    </div>
  );
};

export default AdminTickets;
