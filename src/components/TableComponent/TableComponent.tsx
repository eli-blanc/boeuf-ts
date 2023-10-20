import React, { FC } from "react";
import styles from "./TableComponent.module.css";
import { Col, Row, message } from "antd";
import { Mise } from "../../models/Mise";
import { Action, ActionType } from "../../models/Action";
import { Paquet } from "../../models/Paquet";
import { Carte } from "../../models/Carte";
import JoueurComponent from "../JoueurComponent/JoueurComponent";
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
	const [cartesAtout, setCartesAtout] = React.useState<number>(0);

	React.useImperativeHandle(ref, () => ({ onCliqueCarte }));

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
			setCartesAtout(cartesAtout + 1);
		}
		if (props.action.cptCarte === 1) {
			if (cartesAtout > 0) {
				onDiscarterAtout();
			}
			setCartesAtout(0);
		}
		props.nextAction();
	}

	function onDiscarterAtout() {
		const nCartes = cartesAtout === 1 ? "1 carte" : "2 cartes";
		message.info(`${props.action.joueur.getNom()} a discarter ${nCartes} d'atout.`);
	}

	return (
		<div className={styles.TableComponent} data-testid="TableComponent">
			{/* Partenaire */}
			<div style={{ marginBottom: "60px" }}>
				<JoueurComponent
					mise={props.mise}
					sorteDemandee={props.paquet.sorteDemandee}
					action={props.action}
					cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
					ouvert={props.ouvert}
					auto={props.auto}
					joueur={props.paquet.getJoueur3()}
				></JoueurComponent>
			</div>
			{/* Adversaires et Quettée */}
			<Row style={{ marginTop: "0px", marginBottom: "30px" }}>
				{/* Gauche */}
				<Col style={{ marginRight: "120px" }}>
					<JoueurComponent
						mise={props.mise}
						sorteDemandee={props.paquet.sorteDemandee}
						action={props.action}
						cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
						ouvert={props.ouvert}
						auto={props.auto}
						joueur={props.paquet.getJoueur2()}
					></JoueurComponent>
				</Col>
				{/* Quettée */}
				{props.avecQuettee && props.action.type === ActionType.GAGER && (
					<Col style={{ marginTop: "50px" }}>
						<GroupeCartesComponent
							action={props.action}
							actif={false}
							ouvert={props.ouvert}
							auto={props.auto}
							cartes={props.paquet.getQuettee()}
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
						mise={props.mise}
						sorteDemandee={props.paquet.sorteDemandee}
						action={props.action}
						cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
						ouvert={props.ouvert}
						auto={props.auto}
						joueur={props.paquet.getJoueur4()}
					></JoueurComponent>
				</Col>
			</Row>
			{/* Moi */}
			<div style={{ marginTop: "105px" }}>
				<JoueurComponent
					moi={true}
					mise={props.mise}
					sorteDemandee={props.paquet.sorteDemandee}
					action={props.action}
					cliqueCarte={(carte: Carte) => onCliqueCarte(carte)}
					ouvert={true}
					auto={props.auto}
					joueur={props.paquet.getJoueur1()}
				></JoueurComponent>
			</div>
		</div>
	);
};

export default React.forwardRef(TableComponent);
