"use client";

import React from "react";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { Badge } from "@/components/ui/badge";
import Modal from "@/components/General/Modal";
import type { SampleResponse } from "@/redux/services/samples/samplesService";

const formatValue = (value: unknown): string => {
  if (value === undefined || value === null) return "";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "";
  return String(value);
};

const formatDate = (value: unknown, lang: string): string => {
  if (!value) return "";
  const date = new Date(String(value));
  return isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString(lang, { timeZone: "UTC" });
};

const SampleSection: React.FC<{
  title: string;
  rows: { label: string; value: unknown }[];
}> = ({ title, rows }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 overflow-x-auto mb-4 min-w-0">
    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
      <h2 className="font-semibold text-gray-900">{title}</h2>
    </div>
    <table className="w-full text-sm min-w-full">
      <tbody>
        {rows.map(({ label, value }) => {
          const formatted = formatValue(value);
          return (
            <tr
              key={label}
              className="border-b border-gray-100 last:border-0"
            >
              <th className="px-4 py-3 text-left font-medium text-gray-500 sm:whitespace-nowrap bg-gray-50/50 w-1/3">
                {label}
              </th>
              <td className="px-4 py-3 text-gray-900 break-words min-w-0">
                {formatted || "—"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

interface AccountSampleModalProps {
  open: boolean;
  onClose: () => void;
  sample: SampleResponse;
}

const AccountSampleModal = ({
  open,
  onClose,
  sample,
}: AccountSampleModalProps) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.sequences;
  const detailDict = dict.detail;
  const genderDict = AccountDict.option.gender;
  const optionDict = AccountDict.option;

  const translateOther = (
    value: string | undefined,
    sentinel: string,
    translated: string,
  ): string => (value === sentinel ? translated : (value ?? ""));

  const genderLabel =
    (genderDict as Record<string, string>)[
      sample?.gender?.toLowerCase() ?? ""
    ] ?? sample?.gender;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={sample?.origin_code || detailDict.title}
    >
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Badge variant="secondary">{detailDict.user}</Badge>
        <span>{sample?.user}</span>
      </div>

      <SampleSection
        title={detailDict.identity}
        rows={[
          { label: dict.originCode, value: sample?.origin_code },
          { label: dict.collectionDate, value: formatDate(sample?.collection_date, lang) },
          { label: dict.runNumber, value: sample?.run_number },
          { label: dict.runDate, value: formatDate(sample?.run_date, lang) },
        ]}
      />

      <SampleSection
        title={detailDict.classification}
        rows={[
          { label: dict.origin, value: sample?.origin },
          { label: dict.sampleSource, value: sample?.sample_source },
          { label: dict.microorganism, value: translateOther(sample?.microorganism, "option.microorganism.other", optionDict.microorganism.other) },
          { label: dict.sequencer, value: translateOther(sample?.sequencer, "option.sequencer.other", optionDict.sequencer.other) },
          { label: dict.laboratory, value: translateOther(sample?.laboratory, "option.laboratory.other", optionDict.laboratory.other) },
          { label: dict.healthService, value: translateOther(sample?.health_service, "option.healthService.other", optionDict.healthService.other) },
        ]}
      />

      <SampleSection
        title={detailDict.personalInfo}
        rows={[
          { label: dict.gender, value: genderLabel },
          { label: dict.dateOfBirth, value: formatDate(sample?.date_of_birth, lang) },
          { label: dict.country, value: sample?.country_code },
          { label: dict.city, value: translateOther(sample?.city, "option.city.other", optionDict.city.other) },
          { label: dict.originCode, value: sample?.origin_code },
        ]}
      />

      <SampleSection
        title={detailDict.files}
        rows={[
          { label: dict.fastq1, value: sample?.fastq1 },
          { label: dict.fastq2, value: sample?.fastq2 },
          { label: dict.fasta, value: sample?.fasta },
        ]}
      />
    </Modal>
  );
};

export default AccountSampleModal;
