import React from "react";
import Section from "@/components/General/Section";
import ForgotPasswordForm from "@/components/ForgotPassword/ForgotPasswordForm";
import { form_spacing } from "@/styles/tailwind_classes";

const ForgotPassword = () => {
  return (
    <Section id="forgot-password" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <ForgotPasswordForm />
      </div>
    </Section>
  );
};

export default ForgotPassword;
