"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Modal from "./Modal";
import Message from "./Message";
import Loading from "./Loading";
import { SmartSelect } from "./SmartSelect";
import { label_class } from "@/styles/tailwind_classes";

interface UploadTableModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (fd: FormData) => Promise<string>;
  errorsDict: Record<string, string>;
  dict: {
    title: string;
    hint: string;
    fileLabel: string;
    required: string;
    cancel: string;
    submit: string;
    selectPlaceholder: string;
    userLabel?: string;
    userOptions?: { value: string; label: string }[];
  };
}

const UploadTableModal = ({
  open,
  onClose,
  onSubmit,
  errorsDict,
  dict,
}: UploadTableModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const userOptions = dict.userOptions;
  const needsUser = userOptions !== undefined;

  useEffect(() => {
    if (open) {
      setFile(null);
      setUserId("");
      setError(null);
      setSubmitting(false);
    }
  }, [open]);

  const validate = (): string | null => {
    if (!file) return dict.required;
    if (!file.name.toLowerCase().endsWith(".xlsx")) return dict.hint;
    if (needsUser && !userId) return dict.required;
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("table", file as File);
      if (needsUser) fd.append("user_id", userId);
      await onSubmit(fd);
      onClose();
    } catch (err) {
      const message = typeof err === "string" ? err : "internalServer";
      setError(
        message === "internalServer" && errorsDict.internalServer
          ? errorsDict.internalServer
          : message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={dict.title}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">{dict.hint}</p>

        <div className="flex flex-col gap-2">
          <span className={label_class}>
            {dict.fileLabel} <span className="text-red-500">*</span>
          </span>
          <label
            className={`
              flex items-center justify-between gap-3 px-4 py-3 rounded-md border-2 border-dashed cursor-pointer
              transition-colors
              ${submitting ? "opacity-50 pointer-events-none" : ""}
              ${
                file
                  ? "border-cabgen-200 bg-cabgen-200/5"
                  : "border-border hover:border-cabgen-300 bg-muted/50"
              }
            `}
          >
            <span
              className={`text-sm truncate ${file ? "text-foreground font-medium" : "text-muted-foreground"}`}
            >
              {file?.name ?? ".xlsx"}
            </span>
            <span className="text-xs shrink-0 px-2 py-1 rounded bg-card border border-border text-muted-foreground">
              {file
                ? `${(file.size / 1024).toFixed(0)} KB`
                : dict.selectPlaceholder}
            </span>
            <input
              type="file"
              accept=".xlsx"
              disabled={submitting}
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                setError(null);
              }}
              className="hidden"
            />
          </label>
        </div>

        {needsUser && (
          <div className="flex flex-col gap-1.5">
            <span className={label_class}>
              {dict.userLabel} <span className="text-red-500">*</span>
            </span>
            <SmartSelect
              value={userId}
              onChange={(v) => {
                setUserId(v);
                setError(null);
              }}
              options={userOptions ?? []}
              placeholder={dict.selectPlaceholder}
              searchable
            />
          </div>
        )}

        {error && <Message msg={error} type="error" timeout={false} />}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="px-6 py-2 text-base"
          >
            {dict.cancel}
          </Button>
          {submitting ? (
            <Loading />
          ) : (
            <Button
              type="button"
              variant="green"
              className="px-6 py-2 text-base"
              onClick={handleSubmit}
            >
              {dict.submit}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default UploadTableModal;
