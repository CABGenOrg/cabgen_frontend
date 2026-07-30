"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useConfirmEmailUpdateMutation } from "@/redux/services/users/usersService";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Message from "@/components/General/Message";
import Loading from "@/components/General/Loading";
import { form_spacing } from "@/styles/tailwind_classes";

const ConfirmEmailUpdate = () => {
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict, Errors },
  } = getTranslateClient(lang);
  const dict = AccountDict.security;

  const token = useSearchParams().get("token");
  const [confirmEmail, { isLoading, error, isSuccess }] =
    useConfirmEmailUpdateMutation();

  useEffect(() => {
    if (token && !isLoading && !isSuccess && !error) {
      confirmEmail({ token });
    }
  }, [token, confirmEmail, isLoading, isSuccess, error]);

  return (
    <div className={form_spacing}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-md border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          {dict.confirmEmailTitle}
        </h1>

        {isLoading && (
          <div className="flex flex-col items-center gap-3">
            <Loading />
            <p className="text-gray-500">{dict.confirmEmailLoading}</p>
          </div>
        )}

        {isSuccess && (
          <div className="flex flex-col items-center gap-4">
            <Message msg={dict.confirmEmailSuccess} type="success" />
            <Link
              href={`/${lang}/account/security`}
              className="text-cabgen-200 hover:text-cabgen-300 underline"
            >
              {dict.backToSecurity}
            </Link>
          </div>
        )}

        {(error || !token) && !isLoading && (
          <div className="flex flex-col items-center gap-4">
            <Message
              msg={
                !token
                  ? dict.confirmEmailError
                  : typeof error === "string" && error === "internalServer"
                    ? Errors[error]
                    : String(error)
              }
              type="error"
            />
            <Link
              href={`/${lang}/account/security`}
              className="text-cabgen-200 hover:text-cabgen-300 underline"
            >
              {dict.backToSecurity}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmEmailUpdate;
