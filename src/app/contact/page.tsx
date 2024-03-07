import React from "react";
import Section from "@/components/General/Section";
import ContactForm from "@/components/Contact/ContactForm";

const Contact = () => {
  return (
    <Section id="contact">
      <div
        className="w-full flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(256, 256, 256, 0.3), rgba(256, 256, 256, 0.3)), url(/Contact/dna-helix-attacked-by-bacteria.jpg)",
        }}
      >
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;
