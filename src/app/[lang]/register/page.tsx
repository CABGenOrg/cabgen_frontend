import React from "react";
import Section from "@/components/General/Section";
import RegisterForm from "@/components/Register/RegisterForm";
import { form_spacing } from "@/styles/tailwind_classes";

const Register = () => {
  return (
    <Section id="register">
      <div className={form_spacing}>
        <RegisterForm />
      </div>
    </Section>
  );
};

export default Register;
