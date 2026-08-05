"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Modal from "@/components/General/Modal";
import TextField from "@/components/General/TextField";
import SelectField from "@/components/General/SelectField";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import {
  useCreateMicroorganismMutation,
  useUpdateMicroorganismMutation,
} from "@/redux/services/admin/adminMicroorganismsService";
import type {
  AdminMicroorganismDetailResponse,
  AdminMicroorganismInput,
} from "@/redux/services/admin/adminMicroorganismsService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { getChangedFields } from "@/utils/getChangedFields";
import { emptyToNull } from "@/utils/zodHelpers";

const AdminMicroorganismModalBody: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminMicroorganismDetailResponse | null;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, initial, errorsDict }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const isEdit = !!initial;

  const taxonOptions = Object.entries(
    (dict.taxonValues as Record<string, string>) ?? {},
  ).map(([value, label]) => ({ value, label }));

  const microorganismSchema = z.object({
    taxon: z.string().min(1, dict.validation.required),
    species: z.string().min(1, dict.validation.required),
    variety: z
      .object({
        pt: emptyToNull,
        en: emptyToNull,
        es: emptyToNull,
      })
      .nullable()
      .refine((val) => {
        if (val === null) return true;
        const values = Object.values(val);
        return (
          values.every((v) => v === null) || values.every((v) => v !== null)
        );
      }, { message: dict.validation.required }),
    is_active: z.boolean(),
  });

  type MicroorganismFormData = z.infer<typeof microorganismSchema>;

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      taxon: initial.taxon ?? "",
      species: initial.species ?? "",
      variety: {
        pt: initial.variety?.pt ?? "",
        en: initial.variety?.en ?? "",
        es: initial.variety?.es ?? "",
      },
      is_active: initial.is_active ?? true,
    };
  }, [initial]);

  const form = useForm<MicroorganismFormData>({
    resolver: zodResolver(microorganismSchema),
    values: initialValues,
  });

  const [createMicroorganism, { isLoading: creating, error: createError }] =
    useCreateMicroorganismMutation();
  const [updateMicroorganism, { isLoading: updating, error: updateError }] =
    useUpdateMicroorganismMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<MicroorganismFormData> = async (data) => {
    try {
      const variety =
        data.variety && Object.values(data.variety).every((v) => v === null)
          ? null
          : data.variety;
      const normalized = { ...data, variety };

      if (isEdit && initial) {
        const changed = getChangedFields(
          initialValues ?? ({} as MicroorganismFormData),
          normalized,
        );
        if (Object.keys(changed).length === 0) return;
        await updateMicroorganism({
          id: initial.id,
          data: changed as Partial<AdminMicroorganismInput>,
        }).unwrap();
      } else {
        await createMicroorganism(normalized as AdminMicroorganismInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editMicroorganism : dict.newMicroorganism}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <SelectField
              name="taxon"
              label={dict.taxon}
              form={form}
              options={taxonOptions}
              placeholder={dict.selectPlaceholder}
              required
            />
            <TextField
              name="species"
              label={dict.species}
              form={form}
              required
            />
            <TextField
              name="variety.pt"
              label={`${dict.variety} (PT)`}
              form={form}
            />
            <TextField
              name="variety.en"
              label={`${dict.variety} (EN)`}
              form={form}
            />
            <TextField
              name="variety.es"
              label={`${dict.variety} (ES)`}
              form={form}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                className="h-4 w-4 rounded border-gray-300 text-cabgen-200 focus:ring-cabgen-200"
                {...form.register("is_active")}
              />
              <label htmlFor="is_active" className="text-gray-900">
                {dict.isActive}
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4">
              <Message
                msg={
                  typeof error === "string" && error === "internalServer"
                    ? errorsDict[error]
                    : String(error)
                }
                type="error"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6 py-2 text-base"
            >
              {dict.cancel}
            </Button>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type="submit"
                variant="green"
                className="px-6 py-2 text-base"
              >
                {isEdit ? dict.save : dict.createMicroorganism}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const AdminMicroorganismModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminMicroorganismDetailResponse;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, initial, errorsDict }) => {
  return (
    <AdminMicroorganismModalBody
      open={open}
      onClose={onClose}
      initial={initial}
      errorsDict={errorsDict}
    />
  );
};

export default AdminMicroorganismModal;
