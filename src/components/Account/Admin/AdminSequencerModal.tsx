"use client";

import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Modal from "@/components/General/Modal";
import TextField from "@/components/General/TextField";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import {
  useCreateSequencerMutation,
  useUpdateSequencerMutation,
} from "@/redux/services/admin/adminSequencersService";
import type {
  AdminSequencerTableResponse,
  AdminSequencerInput,
} from "@/redux/services/admin/adminSequencersService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { getChangedFields } from "@/utils/getChangedFields";

const AdminSequencerModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminSequencerTableResponse;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, initial, errorsDict }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const isEdit = !!initial;

  const sequencerSchema = z.object({
    brand: z.string().min(1, dict.validation.required),
    model: z.string().min(1, dict.validation.required),
    is_active: z.boolean(),
  });

  type SequencerFormData = z.infer<typeof sequencerSchema>;

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      brand: initial.brand ?? "",
      model: initial.model ?? "",
      is_active: initial.is_active ?? true,
    };
  }, [initial]);

  const form = useForm<SequencerFormData>({
    resolver: zodResolver(sequencerSchema),
    values: initialValues,
  });

  const [createSequencer, { isLoading: creating, error: createError }] =
    useCreateSequencerMutation();
  const [updateSequencer, { isLoading: updating, error: updateError }] =
    useUpdateSequencerMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<SequencerFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        const changed = getChangedFields(
          initialValues ?? ({} as SequencerFormData),
          data,
        );
        if (Object.keys(changed).length === 0) return;
        await updateSequencer({
          id: initial.id,
          data: changed as Partial<AdminSequencerInput>,
        }).unwrap();
      } else {
        await createSequencer(data as AdminSequencerInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editSequencer : dict.newSequencer}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField name="brand" label={dict.brand} form={form} required />
            <TextField name="model" label={dict.model} form={form} required />
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
                {isEdit ? dict.save : dict.createSequencer}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

export default AdminSequencerModal;
