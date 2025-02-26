"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";
import { getTranslateClient } from "@/lib/getTranslateClient";

const MicroreactWarning = () => {
  const { toast } = useToast();
  const lang = useSelector(selectCurrentLanguage);
  const {
    dictionary: { Dashboard },
  } = getTranslateClient(lang);

  const TIME_INTERVAL = 72 * 60 * 60 * 1000;

  const isSafari = () => {
    return (
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) &&
      navigator.userAgent.includes("Safari")
    );
  };

  useEffect(() => {
    if (isSafari()) {
      const lastShown = localStorage.getItem("microreactWarningLastShown");

      if (!lastShown || Date.now() - parseInt(lastShown, 10) > TIME_INTERVAL) {
        toast({
          description: Dashboard.microreactWarning,
          duration: 180000,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
          className:
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
        });

        localStorage.setItem(
          "microreactWarningLastShown",
          Date.now().toString()
        );
      }
    }
  }, [toast, Dashboard, TIME_INTERVAL]);

  return null;
};

export default MicroreactWarning;
