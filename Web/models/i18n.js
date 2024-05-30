const i18n = require("i18n");
const path = require("path");

i18n.configure({
  locales: ["en", "ar"], // List of supported languages
  directory: path.join(__dirname, "../locales"), // Path to the locale files
  defaultLocale: "en", // Default language
  cookie: "lang", // Cookie name to store the selected language
  queryParameter: "lang", // URL query parameter to switch language
  autoReload: true, // Auto reload locale files on change
  updateFiles: false, // Prevent writing missing translations to disk
  syncFiles: true, // Synchronize locale information across all files
});

module.exports = i18n;
