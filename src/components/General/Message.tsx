"use client";

import { useState, useEffect } from "react";

const msgTypes = ["error", "warning", "success"] as const;

type MsgTypes = (typeof msgTypes)[number];

const Message = ({
  msg,
  type,
  timeout = true,
}: {
  msg: string;
  type: MsgTypes;
  timeout?: boolean;
}) => {
  const msgTypesStyles = {
    error:
      "bg-red-200 border-red-400 border-2 2xl:text-xl text-center py-2 mt-3 rounded-md",
    warning:
      "bg-yellow-200 border-yellow-400 border-2 2xl:text-xl text-center py-2 mt-3 rounded-md",
    success:
      "bg-green-200 border-green-400 border-2 2xl:text-xl text-center py-2 mt-3 rounded-md",
    hidden: "hidden",
  };
  const [messageStyle, setMessageStyle] = useState(msgTypesStyles[type]);

  useEffect(() => {
    if (timeout) {
      setTimeout(() => {
        setMessageStyle(msgTypesStyles.hidden);
      }, 4500);
    }
  });

  return (
    <div className={messageStyle}>
      <p>{msg}</p>
    </div>
  );
};

export default Message;
