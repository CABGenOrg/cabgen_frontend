"use client";

import React from "react";
import { useAuth } from "@/redux/AuthContext";
import { useLanguage } from "@/redux/LanguageContext";
import { getTranslateClient } from "@/lib/getTranslateClient";
import Loading from "../General/Loading";
import { User2 } from "lucide-react";

const Overview = () => {
  const { user, isLoading } = useAuth();
  const lang = useLanguage();
  const {
    dictionary: { Account: AccountDict },
  } = getTranslateClient(lang);

  if (isLoading) return <Loading />;

  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        {AccountDict.overview.title}
      </h1>
      <div className="bg-slate-200 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-cabgen-400 flex items-center justify-center">
            <User2 size={32} className="text-white" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {AccountDict.overview.welcome}, {user?.username}
            </p>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
