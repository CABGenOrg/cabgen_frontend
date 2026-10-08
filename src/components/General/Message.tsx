"use client";

import { useState, useEffect } from "react";

const msgTypes = ["error", "warning", "success"] as const;

type MsgTypes = (typeof msgTypes)[number];

const MSG_DURATION = 10000;

const msgTypesStyles = {
  error:
    "bg-red-200 border-red-400 dark:bg-red-950 dark:border-red-700 dark:text-red-100 border-2 2xl:text-lg text-center py-2 mt-3 rounded-md",
  warning:
    "bg-yellow-200 border-yellow-400 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-100 border-2 2xl:text-lg text-center py-2 mt-3 rounded-md",
  success:
    "bg-green-200 border-green-400 dark:bg-green-950 dark:border-green-700 dark:text-green-100 border-2 2xl:text-lg text-center py-2 mt-3 rounded-md",
  hidden: "hidden",
};

const Message = ({
  msg,
  type,
  timeout = true,
}: {
  msg: string;
  type: MsgTypes;
  timeout?: boolean;
}) => {
  const [messageStyle, setMessageStyle] = useState(msgTypesStyles[type]);

  useEffect(() => {
    setMessageStyle(msgTypesStyles[type]);
    if (timeout) {
      const id = setTimeout(() => {
        setMessageStyle(msgTypesStyles.hidden);
      }, MSG_DURATION);
      return () => clearTimeout(id);
    }
  }, [msg, type, timeout]);

  return (
    <div className={messageStyle} role="alert">
      <p>{msg}</p>
    </div>
  );
};

export default Message;
