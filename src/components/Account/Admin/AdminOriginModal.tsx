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
  useGetOriginByIDQuery,
  useCreateOriginMutation,
  useUpdateOriginMutation,
} from "@/redux/services/admin/adminOriginsService";
import type {
  AdminOriginDetailResponse,
  AdminOriginInput,
} from "@/redux/services/admin/adminOriginsService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { getChangedFields } from "@/utils/getChangedFields";

const AdminOriginModalBody: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminOriginDetailResponse | null;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, initial, errorsDict }) => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);
  const dict = AccountDict.admin;
  const isEdit = !!initial;

  const originSchema = z.object({
    names: z.object({
      pt: z.string().min(1, dict.validation.required),
      en: z.string().min(1, dict.validation.required),
      es: z.string().min(1, dict.validation.required),
    }),
    is_active: z.boolean(),
  });

  type OriginFormData = z.infer<typeof originSchema>;

  const initialValues = useMemo(() => {
    if (!initial) return undefined;
    return {
      names: {
        pt: initial.names?.pt ?? "",
        en: initial.names?.en ?? "",
        es: initial.names?.es ?? "",
      },
      is_active: initial.is_active ?? true,
    };
  }, [initial]);

  const form = useForm<OriginFormData>({
    resolver: zodResolver(originSchema),
    values: initialValues,
  });

  const [createOrigin, { isLoading: creating, error: createError }] =
    useCreateOriginMutation();
  const [updateOrigin, { isLoading: updating, error: updateError }] =
    useUpdateOriginMutation();

  const isLoading = creating || updating;
  const error = createError || updateError;

  const onSubmit: SubmitHandler<OriginFormData> = async (data) => {
    try {
      if (isEdit && initial) {
        const changed = getChangedFields(
          initialValues ?? ({} as OriginFormData),
          data,
        );
        if (Object.keys(changed).length === 0) return;
        await updateOrigin({
          id: initial.id,
          data: changed as Partial<AdminOriginInput>,
        }).unwrap();
      } else {
        await createOrigin(data as AdminOriginInput).unwrap();
      }
      form.reset();
      onClose();
    } catch {}
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? dict.editOrigin : dict.newOrigin}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
            <TextField
              name="names.pt"
              label={dict.names.pt}
              form={form}
              required
            />
            <TextField
              name="names.en"
              label={dict.names.en}
              form={form}
              required
            />
            <TextField
              name="names.es"
              label={dict.names.es}
              form={form}
              required
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
                {isEdit ? dict.save : dict.createOrigin}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </Modal>
  );
};

const AdminOriginModal: React.FC<{
  open: boolean;
  onClose: () => void;
  initial?: AdminOriginDetailResponse;
  errorsDict: Record<string, string>;
}> = ({ open, onClose, initial, errorsDict }) => {
  const isEdit = !!initial;
  const title = isEdit ? "Edit Origin" : "New Origin";

  if (isEdit) {
    return (
      <AdminOriginModalBody
        open={open}
        onClose={onClose}
        initial={initial}
        errorsDict={errorsDict}
      />
    );
  }

  return (
    <AdminOriginModalBody
      open={open}
      onClose={onClose}
      errorsDict={errorsDict}
    />
  );
};

export default AdminOriginModal;
