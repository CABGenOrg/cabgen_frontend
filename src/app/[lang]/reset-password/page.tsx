"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Section from "@/components/General/Section";
import CustomLink from "@/components/General/CustomLink";
import OptimizedImage from "@/components/General/OptimizedImage";
import Message from "@/components/General/Message";
import ResetPasswordForm from "@/components/ResetPassword/ResetPasswordForm";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { form_spacing } from "@/styles/tailwind_classes";

const ResetPassword = () => {
  const lang = useLanguage();
  const {
    dictionary: { ResetPassword: dict },
  } = getTranslateClient(lang);

  const token = useSearchParams().get("token");

  return (
    <Section id="reset-password" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <div className="mx-5 py-10 px-5 2xl:w-[30%] lg:w-[40%] md:w-[60%] bg-slate-200 rounded-lg">
          <div className="flex flex-col justify-center items-center py-6 sm:px-8 px-2">
            <div className="flex flex-row justify-center items-center">
              <OptimizedImage
                src="/Home/signature_cabgen_dark.png"
                alt="Cabgen logo"
                className="object-cover sm:w-6/12 w-2/3 mb-5"
              />
            </div>
            <h1 className="text-xl font-semibold mb-2">{dict.title}</h1>
            {token ? (
              <>
                <p className="text-center text-sm text-gray-600 mb-6">
                  {dict.description}
                </p>
                <ResetPasswordForm token={token} />
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Message msg={dict.invalidToken} type="error" />
                <CustomLink
                  href="/forgot-password"
                  className="text-blue-500 hover:text-blue-700"
                >
                  {dict.backToLogin}
                </CustomLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ResetPassword;
