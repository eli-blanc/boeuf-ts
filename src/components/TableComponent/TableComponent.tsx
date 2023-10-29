import React from "react";
import styles from "./TableComponent.module.css";
import { Col, Row, message } from "antd";
import { Mise } from "../../models/Mise";
import { Action, ActionType } from "../../models/Action";
import { Paquet } from "../../models/Paquet";
import { Carte } from "../../models/Carte";
import JoueurComponent, { JoueurComponentMethods } from "../JoueurComponent/JoueurComponent";
import GroupeCartesComponent from "../GroupeCartesComponent/GroupeCartesComponent";
import MainComponent from "../MainComponent/MainComponent";

interface TableComponentProps {
	mise: Mise;
	action: Action;
	paquet: Paquet;
	ouvert: boolean;
	auto: boolean;
	avecQuettee: boolean;
	nextAction: () => void;
}

export interface TableComponentMethods {
	onCliqueCarte: (carte: Carte | undefined) => void;
}

const TableComponent: React.ForwardRefRenderFunction<TableComponentMethods, TableComponentProps> = (props, ref) => {
	React.useImperativeHandle(ref, () => ({ onCliqueCarte }));
	const joueur1ref = React.useRef<JoueurComponentMethods | null>(null);
	const joueur2ref = React.useRef<JoueurComponentMethods | null>(null);
	const joueur3ref = React.useRef<JoueurComponentMethods | null>(null);
	const joueur4ref = React.useRef<JoueurComponentMethods | null>(null);

	function onCliqueCarte(carte: Carte | undefined) {
		if (!carte) return;
		if (props.paquet.attendre) {
			return;
		}
		props.paquet.cliqueCarte(carte, props.action.joueur, props.action, props.mise.atout);
		if (props.action.cptJoueur === 0) {
			props.paquet.setSorteDemandee(carte, props.mise.atout);
		}

		if (props.action.type === ActionType.DISCARTER && carte.isAtout(props.mise.atout)) {
			props.paquet.atoutsJoues++;
		}
		if (props.action.cptCarte === 1) {
			if (props.paquet.atoutsJoues > 0) {
				onDiscarterAtout();
			}
			props.paquet.atoutsJoues = 0;
		}
		props.nextAction();
	}

	function updateJoueur(idx: number) {
		switch (idx) {
			case 0:
				return joueur1ref.current?.setCartes([]);
			case 1:
				return joueur2ref.current?.setCartes([]);
			case 2:
				return joueur3ref.current?.setCartes([]);
			case 3:
				return joueur4ref.current?.setCartes([]);
			default:
				return;
		}
	}

	function onDiscarterAtout() {
		const nCartes = props.paquet.atoutsJoues === 1 ? "1 carte" : "2 cartes";
		message.info(`${props.action.joueur.getNom()} a discarter ${nCartes} d'atout.`);
	}
	return (
		<div className={styles.TableComponent} data-testid="TableComponent">
			{/* Partenaire */}
			<div style={{ marginBottom: "60px" }}>
				<JoueurComponent
					ref={joueur3ref}
					mise={props.mise}
					joueur={props.paquet.joueur3}
					paquet={props.paquet}
					action={props.action}
					cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
					ouvert={props.ouvert}
					auto={props.auto}
					nextAction={props.nextAction}
					updateJoueur={updateJoueur}
				></JoueurComponent>
			</div>
			{/* Adversaires et Quettée */}
			<Row style={{ marginTop: "0px", marginBottom: "30px" }}>
				{/* Gauche */}
				<Col style={{ marginRight: "120px" }}>
					<JoueurComponent
						ref={joueur2ref}
						mise={props.mise}
						joueur={props.paquet.joueur2}
						paquet={props.paquet}
						action={props.action}
						cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
						ouvert={props.ouvert}
						auto={props.auto}
						nextAction={props.nextAction}
						updateJoueur={updateJoueur}
					></JoueurComponent>
				</Col>
				{/* Quettée */}
				{props.avecQuettee && props.action.type === ActionType.GAGER && (
					<Col style={{ marginTop: "52px" }}>
						<GroupeCartesComponent
							paquet={props.paquet}
							action={props.action}
							actif={false}
							ouvert={props.ouvert}
							auto={props.auto}
							cartes={props.paquet.getQuettee()}
							nextAction={props.nextAction}
						></GroupeCartesComponent>
					</Col>
				)}
				{/* Main */}
				{(props.action.type === ActionType.JOUER || props.action.type === ActionType.REMPORTER) && (
					<Col>
						<MainComponent paquet={props.paquet} ouvert={props.ouvert}></MainComponent>
					</Col>
				)}
				{/* Droite */}
				<Col style={{ marginLeft: "120px" }}>
					<JoueurComponent
						ref={joueur4ref}
						mise={props.mise}
						joueur={props.paquet.joueur4}
						paquet={props.paquet}
						action={props.action}
						cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
						ouvert={props.ouvert}
						auto={props.auto}
						nextAction={props.nextAction}
						updateJoueur={updateJoueur}
					></JoueurComponent>
				</Col>
			</Row>
			{/* Moi */}
			<div style={{ marginTop: "105px" }}>
				<JoueurComponent
					ref={joueur1ref}
					moi={true}
					mise={props.mise}
					joueur={props.paquet.joueur1}
					paquet={props.paquet}
					action={props.action}
					cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
					ouvert={true}
					auto={props.auto}
					nextAction={props.nextAction}
					updateJoueur={updateJoueur}
				></JoueurComponent>
			</div>
		</div>
	);
};

export default React.forwardRef(TableComponent);
