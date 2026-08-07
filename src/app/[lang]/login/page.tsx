import React from "react";
import Section from "@/components/General/Section";
import LoginForm from "@/components/Login/LoginForm";
import { form_spacing } from "@/styles/tailwind_classes";

const Login = () => {
  return (
    <Section id="login" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <LoginForm />
      </div>
    </Section>
  );
};

export default Login;
