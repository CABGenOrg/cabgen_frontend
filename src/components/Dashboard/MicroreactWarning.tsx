"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { isSafari } from "react-device-detect";

const MicroreactWarning = () => {
  const { toast } = useToast();
  const lang = useSelector(selectCurrentLanguage);
  const {
    dictionary: { Dashboard },
  } = getTranslateClient(lang);

  const TIME_INTERVAL = 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (isSafari) {
      try {
        const lastShown = localStorage.getItem("microreactWarningLastShown");
        const lastShownTime = lastShown ? Number(lastShown) : 0;

        if (isNaN(lastShownTime)) {
          localStorage.removeItem("microreactWarningLastShown");
        }

        if (
          !lastShown ||
          Date.now() - lastShownTime > TIME_INTERVAL
        ) {
          toast({
            description: Dashboard.microreactWarning,
            duration: 600000,
            action: <ToastAction altText="Ok">Ok</ToastAction>,
            className:
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          });

          localStorage.setItem(
            "microreactWarningLastShown",
            Date.now().toString()
          );
        }
      } catch (e) {
        toast({
          description: Dashboard.microreactWarning,
          duration: 600000,
          action: <ToastAction altText="Ok">Ok</ToastAction>,
        });
      }
    }
  }, [toast, Dashboard, TIME_INTERVAL]);

  return null;
};

export default MicroreactWarning;
