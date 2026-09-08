"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { input_class, label_class } from "@/styles/tailwind_classes";
import PasswordInput from "@/components/General/PasswordInput";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import {
  useDeleteProfileMutation,
  useUpdatePasswordMutation,
  useRequestEmailUpdateMutation,
} from "@/redux/services/users/usersService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Modal from "@/components/General/Modal";

const AccountSecurity = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.security;

  const [deleteProfile, { isLoading: deleting, error: deleteError }] =
    useDeleteProfileMutation();

  const [
    updatePassword,
    { isLoading: updatingPassword, error: passwordError },
  ] = useUpdatePasswordMutation();
  const [
    requestEmailUpdate,
    { isLoading: requestingEmail, error: emailError },
  ] = useRequestEmailUpdateMutation();

  const [emailRequested, setEmailRequested] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const emailSchema = z
    .object({
      new_email: z
        .string()
        .min(1, dict.validation.required)
        .email(dict.validation.email),
      confirm_new_email: z.string().min(1, dict.validation.required),
    })
    .refine((data) => data.new_email === data.confirm_new_email, {
      message: dict.validation.match,
      path: ["confirm_new_email"],
    });
  type EmailFormData = z.infer<typeof emailSchema>;

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  const passwordSchema = z
    .object({
      current_password: z.string().min(1, dict.validation.required),
      new_password: z
        .string()
        .min(1, dict.validation.required)
        .min(8, dict.validation.passwordMinLength),
      confirm_password: z.string().min(1, dict.validation.required),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: dict.validation.match,
      path: ["confirm_password"],
    })
    .refine((data) => data.new_password !== data.current_password, {
      message: dict.validation.passwordDifferent,
      path: ["new_password"],
    });
  type PasswordFormData = z.infer<typeof passwordSchema>;

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onRequestEmail: SubmitHandler<EmailFormData> = async (data) => {
    try {
      await requestEmailUpdate({
        new_email: data.new_email,
        confirm_new_email: data.confirm_new_email,
      }).unwrap();
      setEmailRequested(true);
    } catch {}
  };

  const onUpdatePassword: SubmitHandler<PasswordFormData> = async (data) => {
    try {
      await updatePassword({
        current_password: data.current_password,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      }).unwrap();
      passwordForm.reset({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordUpdated(true);
      setTimeout(() => setPasswordUpdated(false), 3000);
    } catch {}
  };

  const handleDelete = async () => {
    try {
      await deleteProfile().unwrap();
    } catch {}
    window.location.href = "/";
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-5 flex items-center gap-2">
        <Shield className="text-cabgen-400" size={24} />
        <span className="bg-gradient-to-r from-cabgen-700 to-cabgen-400 bg-clip-text text-transparent">
          {dict.title}
        </span>
      </h1>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium mb-1">{dict.changeEmail}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {dict.changeEmailDescription}
        </p>
        {emailRequested ? (
          <Message msg={dict.requestEmailSuccess} type="success" />
        ) : (
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onRequestEmail)}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
                <FormField
                  control={emailForm.control}
                  name="new_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {dict.newEmail}
                      </FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          className={input_class}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={emailForm.control}
                  name="confirm_new_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={label_class}>
                        {dict.confirmNewEmail}
                      </FormLabel>
                      <FormControl>
                        <input
                          type="email"
                          className={input_class}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-600" />
                    </FormItem>
                  )}
                />
              </div>

              {emailError && (
                <div className="mt-4">
                  <Message
                    msg={
                      typeof emailError === "string" &&
                      emailError === "internalServer"
                        ? Errors[emailError]
                        : String(emailError)
                    }
                    type="error"
                  />
                </div>
              )}

              <div className="flex justify-end mt-4">
                {requestingEmail ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="bg-cabgen-200 hover:bg-cabgen-100 rounded-lg py-2 px-6 text-base text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 focus-visible:ring-offset-2"
                  >
                    {dict.sendVerification}
                  </button>
                )}
              </div>
            </form>
          </Form>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-6">
        <h2 className="text-lg font-medium mb-1">{dict.changePassword}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {dict.changePasswordDescription}
        </p>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onUpdatePassword)}>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-6 gap-y-4">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {dict.currentPassword}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {dict.newPassword}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={label_class}>
                      {dict.confirmPassword}
                    </FormLabel>
                    <FormControl>
                      <PasswordInput field={field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
            </div>

            {passwordError && (
              <div className="mt-4">
                <Message
                  msg={
                    typeof passwordError === "string" &&
                    passwordError === "internalServer"
                      ? Errors[passwordError]
                      : String(passwordError)
                  }
                  type="error"
                />
              </div>
            )}

            {passwordUpdated && (
              <div className="mt-4">
                <Message msg={dict.changePasswordSuccess} type="success" />
              </div>
            )}

            <div className="flex justify-end mt-4">
              {updatingPassword ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="bg-cabgen-200 hover:bg-cabgen-100 rounded-lg py-2 px-6 text-base text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabgen-200 focus-visible:ring-offset-2"
                >
                  {dict.save}
                </button>
              )}
            </div>
          </form>
        </Form>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-red-200 p-6">
        <h2 className="text-lg font-medium mb-1 text-red-600">
          {dict.deleteAccount}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {dict.deleteAccountDescription}
        </p>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 rounded-lg py-2 px-6 text-base text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2"
          >
            {dict.deleteAccount}
          </button>
        </div>
      </div>

      <Modal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title={dict.deleteAccount}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <p className="text-gray-900 font-medium mb-1">
              {dict.deleteAccount}
            </p>
            <p className="text-gray-500 text-sm">{dict.deleteConfirm}</p>
          </div>
        </div>

        {deleteError && (
          <div className="mt-4">
            <Message
              msg={
                typeof deleteError === "string" &&
                deleteError === "internalServer"
                  ? Errors[deleteError]
                  : String(deleteError)
              }
              type="error"
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
            {dict.cancel}
          </Button>
          {deleting ? (
            <Loading />
          ) : (
            <Button variant="destructive" onClick={handleDelete}>
              {dict.delete}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default AccountSecurity;
