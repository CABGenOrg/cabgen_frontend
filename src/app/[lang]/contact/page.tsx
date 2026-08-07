import React from "react";
import Section from "@/components/General/Section";
import ContactForm from "@/components/Contact/ContactForm";
import { form_spacing } from "@/styles/tailwind_classes";

const Contact = () => {
  return (
    <Section id="contact" className="flex-1">
      <div className={`${form_spacing} flex-1`}>
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;
