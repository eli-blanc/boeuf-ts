import React from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { Header } from "antd/es/layout/layout";
import { Action, ActionType } from "./models/Action";
import { Partie } from "./models/Partie";
import { Paquet } from "./models/Paquet";

function App() {
	const [action, setAction] = React.useState<Action>();
	const [partie, setPartie] = React.useState<Partie>();
	const [paquet, setPaquet] = React.useState<Paquet>(new Paquet(true));
	function getSousTitre(): string {
		if (!action) {
			console.log("Action undefined!");
			return "";
		}
		let sousTitre = action.getMsg();
		if (action !== null && partie !== null) {
			if (action.type === ActionType.JOUER && paquet.sorteDemandee) {
				sousTitre = `${sousTitre} (${paquet.sorteDemandee} demandé)`;
			}
		}
		return sousTitre;
	}
	const { t, i18n } = useTranslation();
	return (
		<div
			className="App"
			style={{
				backgroundColor: "rgb(50,50,50)",
			}}
		>
			{/* Titre */}
			<Header
				style={{
					backgroundColor: "rgb(50,50,50)",
				}}
			>
				<h1 style={{ color: "white", marginBottom: "-20px" }}>{t("general.titre")}</h1>
				{
					// Sous-titre
					<h2 style={{ color: "rgb(32,166,237)" }}>{getSousTitre()}</h2>
				}
			</Header>
		</div>
	);
}

export default App;
