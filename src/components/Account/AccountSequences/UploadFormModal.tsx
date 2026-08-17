"use client";

import { useDispatch } from "react-redux";
import { baseUrl } from "@/utils/handleRequest";
import handleError from "@/utils/handleError";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  section_btn,
  label_class,
} from "@/styles/tailwind_classes";
import Message from "@/components/General/Message";
import { apiSlice } from "@/redux/api/apiSlice";
import { SAMPLES_ENDPOINTS } from "@/redux/services/samples/samplesEndpoints";
import type { SampleResponse } from "@/redux/services/samples/samplesService";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Modal from "./Modal";

const ensureGzipped = async (file: File): Promise<File> => {
  if (file.name.endsWith(".gz")) return file;
  const stream = file.stream().pipeThrough(new CompressionStream("gzip"));
  const blob = await new Response(stream).blob();
  return new File([blob], `${file.name}.gz`, { type: "application/gzip" });
};

const uploadWithProgress = (
  url: string,
  lang: string,
  formData: FormData,
  onProgress: (percent: number) => void,
): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("Accept-Language", lang);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: unknown = null;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        data = xhr.responseText;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data);
      } else {
        reject({ status: xhr.status, data });
      }
    };

    xhr.onerror = () => reject({ status: "FETCH_ERROR", data: null });

    xhr.send(formData);
  });
};

const UploadFormModal: React.FC<{
  open: boolean;
  onClose: () => void;
  lang: string;
  dict: ReturnType<
    typeof getTranslateClient
  >["dictionary"]["Account"]["sequences"];
  errorsDict: Record<string, string>;
  sample: SampleResponse | null;
}> = ({ open, onClose, lang, dict, errorsDict, sample }) => {
  const dispatch = useDispatch();

  const [files, setFiles] = useState<{
    fastq1: File | null;
    fastq2: File | null;
    fasta: File | null;
  }>({
    fastq1: null,
    fastq2: null,
    fasta: null,
  });

  const [phase, setPhase] = useState<"idle" | "compressing" | "uploading">(
    "idle",
  );
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = (files.fastq1 && files.fastq2) || files.fasta;
  const isBusy = phase !== "idle";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sample || !canSubmit || isBusy) return;
    setError(null);

    try {
      const formData = new FormData();

      if (files.fastq1 && files.fastq2) {
        setPhase("compressing");
        const [fq1, fq2] = await Promise.all([
          ensureGzipped(files.fastq1),
          ensureGzipped(files.fastq2),
        ]);
        formData.append("fastq1", fq1);
        formData.append("fastq2", fq2);
      }

      if (files.fasta) {
        formData.append("fasta", files.fasta);
      }

      setPhase("uploading");
      setProgress(0);
      await uploadWithProgress(
        `${baseUrl}${SAMPLES_ENDPOINTS.DEFAULT}/${sample.id}/upload`,
        lang,
        formData,
        setProgress,
      );

      dispatch(
        apiSlice.util.invalidateTags([
          { type: "Samples", id: sample.id },
          "Samples",
        ]),
      );
      setFiles({ fastq1: null, fastq2: null, fasta: null });
      onClose();
    } catch (err) {
      setError(handleError(err as any));
    } finally {
      setPhase("idle");
    }
  };

  const fileInput = (key: keyof typeof files, label: string) => (
    <div className="flex flex-col gap-2">
      <span className={label_class}>{label}</span>
      <label
        className={`
          flex items-center justify-between gap-3 px-4 py-3 rounded-md border-2 border-dashed cursor-pointer
          transition-colors
          ${isBusy ? "opacity-50 pointer-events-none" : ""}
          ${
            files[key]
              ? "border-cabgen-200 bg-cabgen-200/5"
              : "border-gray-300 hover:border-cabgen-300 bg-gray-50"
          }
        `}
      >
        <span
          className={`text-sm truncate ${files[key] ? "text-gray-900 font-medium" : "text-gray-400"}`}
        >
          {files[key]?.name ??
            (key === "fasta" ? ".fasta" : ".fastq|.fastq.gz")}
        </span>
        <span className="text-xs shrink-0 px-2 py-1 rounded bg-white border border-gray-200 text-gray-500">
          {files[key]
            ? `${(files[key]!.size / 1024).toFixed(0)} KB`
            : dict.selectPlaceholder}
        </span>
        <input
          type="file"
          disabled={isBusy}
          onChange={(e) =>
            setFiles((p) => ({ ...p, [key]: e.target.files?.[0] ?? null }))
          }
          className="hidden"
        />
      </label>
    </div>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${dict.uploadSequences} - ${sample?.origin_code ?? ""}`}
    >
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-5">
          {fileInput("fastq1", dict.fastq1)}
          {fileInput("fastq2", dict.fastq2)}
          {fileInput("fasta", dict.fasta)}
        </div>

        {phase === "compressing" && (
          <p className="mt-4 text-sm text-gray-500">{dict.compressing}</p>
        )}

        {phase === "uploading" && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{dict.uploading}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-cabgen-200 transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <Message
              msg={error === "internalServer" ? errorsDict[error] : error}
              type="error"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isBusy}
          >
            {dict.cancel}
          </Button>
          <button
            type="submit"
            className={`${section_btn} flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed`}
            disabled={!canSubmit || isBusy}
          >
            {isBusy && <Loader2 size={16} className="animate-spin" />}
            {dict.upload}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadFormModal;
