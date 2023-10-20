import React, { FC } from "react";
import { Action } from "../../models/Action";
import { Carte, Sorte } from "../../models/Carte";
import { Joueur } from "../../models/Joueur";
import { Mise } from "../../models/Mise";
import GroupeCartesComponent from "../GroupeCartesComponent/GroupeCartesComponent";
import styles from "./JoueurComponent.module.css";

interface JoueurComponentProps {
	joueur: Joueur;
	moi?: boolean;
	mise: Mise;
	sorteDemandee: Sorte | undefined;
	action: Action;
	auto: boolean;
	ouvert: boolean;
	cliqueCarte: (carte: Carte) => void;
}

const JoueurComponent: FC<JoueurComponentProps> = (props: JoueurComponentProps) => {
	function onDiscarte(carte: Carte) {
		props.cliqueCarte(carte);
	}
	return (
		<div className={`${styles.JoueurComponent} App-center`} data-testid="JoueurComponent">
			{/* Nom au-dessus */}
			{!props.moi && (
				<p
					style={{
						fontSize: "24px",
						marginBottom: "0px",
						color: props.joueur.actif ? "rgb(32,166,237)" : "white",
					}}
				>
					{props.joueur.getNom()}
				</p>
			)}
			{/* Cartes */}
			<GroupeCartesComponent
				moi={props.moi}
				mise={props.mise}
				sorteDemandee={props.sorteDemandee}
				action={props.action}
				actif={props.joueur.actif}
				cliqueCarte={onDiscarte}
				ouvert={props.ouvert}
				auto={props.auto}
				cartes={props.joueur.getCartes()}
			></GroupeCartesComponent>
			{/* Nom en-dessous */}
			{props.moi && (
				<p
					style={{
						fontSize: "24px",
						marginBottom: "0px",
						color: props.joueur.actif ? "rgb(32,166,237)" : "white",
					}}
				>
					{props.joueur.getNom()}
				</p>
			)}
		</div>
	);
};

export default JoueurComponent;
