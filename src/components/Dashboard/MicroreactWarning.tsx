"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "@/redux/slices/languageSlice";
import { getTranslateClient } from "@/lib/getTranslateClient";
import { isSafari } from "react-device-detect";

const TIME_INTERVAL = 24 * 60 * 60 * 1000;

const writeLocalStorage = () => {
  try {
    localStorage.setItem("microreactWarningLastShown", Date.now().toString());
  } catch (_) {}
};

const MicroreactWarning = () => {
  const { toast } = useToast();
  const lang = useSelector(selectCurrentLanguage);
  const {
    dictionary: { Dashboard },
  } = getTranslateClient(lang);

  useEffect(() => {
    if (isSafari) {
      try {
        const lastShown = localStorage.getItem("microreactWarningLastShown");
        const lastShownTime = lastShown ? Number(lastShown) : 0;

        if (isNaN(lastShownTime)) {
          localStorage.removeItem("microreactWarningLastShown");
        }

        const now = Date.now();
        const MAX_TIMESTAMP = now + 7 * 24 * 60 * 60 * 1000;

        const isInvalid = !lastShownTime || lastShownTime > MAX_TIMESTAMP;
        const isExpired = lastShownTime && now - lastShownTime >= TIME_INTERVAL;

        if (isInvalid || isExpired) {
          toast({
            description: Dashboard.microreactWarning,
            duration: 600000,
            action: (
              <ToastAction altText="Ok" onClick={writeLocalStorage}>
                Ok
              </ToastAction>
            ),
            className:
              "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          });
        }
      } catch (e) {
        toast({
          description: Dashboard.microreactWarning,
          duration: 600000,
          action: (
            <ToastAction altText="Ok" onClick={writeLocalStorage}>
              Ok
            </ToastAction>
          ),
        });
      }
    }
  }, [toast, Dashboard.microreactWarning]);

  return null;
};

export default MicroreactWarning;
