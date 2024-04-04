import React from "react";
import Section from "@/components/General/Section";
import ContactForm from "@/components/Contact/ContactForm";
import { form_spacing } from "@/styles/tailwind_classes";

const Contact = () => {
  return (
    <Section id="contact">
      <div className={form_spacing}>
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;
