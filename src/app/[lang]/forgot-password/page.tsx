import React from "react";
import Section from "@/components/General/Section";
import ForgotPasswordForm from "@/components/ForgotPassword/ForgotPasswordForm";
import { form_spacing } from "@/styles/tailwind_classes";

const ForgotPassword = () => {
  return (
    <Section id="forgot-password">
      <div className={form_spacing}>
        <ForgotPasswordForm />
      </div>
    </Section>
  );
};

export default ForgotPassword;
