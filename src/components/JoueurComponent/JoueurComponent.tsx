import { group } from "console";
import React from "react";
import { Action } from "../../models/Action";
import { Carte } from "../../models/Carte";
import { Joueur } from "../../models/Joueur";
import { Mise } from "../../models/Mise";
import { Paquet } from "../../models/Paquet";
import GroupeCartesComponent, { GroupeCartesComponentMethods } from "../GroupeCartesComponent/GroupeCartesComponent";
import styles from "./JoueurComponent.module.css";

interface JoueurComponentProps {
	paquet: Paquet;
	joueur: Joueur;
	moi?: boolean;
	mise: Mise;
	action: Action;
	auto: boolean;
	ouvert: boolean;
	cliqueCarte: (carte: Carte) => void;
	nextAction: () => void;
	updateJoueur: (idx: number) => void;
}

export interface JoueurComponentMethods {
	setCartes: (cartes: Carte[]) => void;
}

const JoueurComponent: React.ForwardRefRenderFunction<JoueurComponentMethods, JoueurComponentProps> = (props, ref) => {
	React.useImperativeHandle(ref, () => ({ setCartes }));
	const groupeCartesRef = React.useRef<GroupeCartesComponentMethods | null>(null);

	function onDiscarte(carte: Carte) {
		props.cliqueCarte(carte);
	}
	function setCartes(cartes: Carte[]) {
		groupeCartesRef.current?.setCartes?.([]);
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
					{props.joueur.nom}
				</p>
			)}
			{/* Cartes */}
			<GroupeCartesComponent
				ref={groupeCartesRef}
				paquet={props.paquet}
				moi={props.moi}
				mise={props.mise}
				action={props.action}
				actif={props.joueur.actif}
				cliqueCarte={onDiscarte}
				ouvert={props.ouvert}
				auto={props.auto}
				cartes={props.joueur.cartes}
				nextAction={props.nextAction}
				updateJoueur={props.updateJoueur}
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
					{props.joueur.nom}
				</p>
			)}
		</div>
	);
};

export default React.forwardRef(JoueurComponent);
