import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { initReactI18next } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
i18n.use(initReactI18next).init({
	resources: {
		en: {
			translation: require("./locales/translation/en.json"),
		},
		fr: {
			translation: require("./locales/translation/fr.json"),
		},
	},
	lng: navigator.language.includes("fr") ? "fr" : "en",
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});
root.render(
	<React.StrictMode>
		<I18nextProvider i18n={i18n}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</I18nextProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
