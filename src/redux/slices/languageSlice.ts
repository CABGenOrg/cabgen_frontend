import { createSlice } from "@reduxjs/toolkit";
import { Locale, i18n } from "@/i18n/i18n.config";

type initialStateProps = {
  defaultLocale: Locale;
  locales: readonly Locale[];
  currentLocale: Locale;
};

const initialState: initialStateProps = {
  defaultLocale: i18n.defaultLocale,
  locales: i18n.locales,
  currentLocale: i18n.defaultLocale,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    updateLanguage: (state, action) => {
      const language = action.payload;
      state.currentLocale = state.locales.includes(language)
        ? language
        : state.defaultLocale;
    },
  },
});

export const { updateLanguage } = languageSlice.actions;

export default languageSlice.reducer;

export const selectCurrentLanguage = (state: { language: initialStateProps }) =>
  state.language.currentLocale;
