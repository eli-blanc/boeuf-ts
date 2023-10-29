import React from "react";
import styles from "./GroupeCartesComponent.module.css";
import { Col, message, Row } from "antd";
import { Carte } from "../../models/Carte";
import { Mise } from "../../models/Mise";
import { Action, ActionType } from "../../models/Action";
import CarteComponent from "../CarteComponent/CarteComponent";
import { Paquet } from "../../models/Paquet";
import { outputError } from "../../utils/generalUtil";

interface GroupeCartesComponentProps {
	actif: boolean;
	mise?: Mise;
	action: Action;
	paquet: Paquet;
	cartes: Carte[];
	ouvert: boolean;
	auto: boolean;
	moi?: boolean;
	cliqueCarte?: (carte: Carte) => void;
	nextAction: () => void;
	updateJoueur?: (idx: number) => void;
}

export interface GroupeCartesComponentMethods {
	setCartes?: (cartes: Carte[]) => void;
}

const GroupeCartesComponent: React.ForwardRefRenderFunction<
	GroupeCartesComponentMethods,
	GroupeCartesComponentProps
> = (props, ref) => {
	const [cartes, setCartes] = React.useState<Carte[]>([]);

	React.useImperativeHandle(ref, () => ({ setCartes }));

	function initCartes() {
		const newCartes: Carte[] = [];
		for (let carte of props.cartes) {
			newCartes.push(carte);
		}
		setCartes(newCartes);
	}
	function onClick(e: any, carte: Carte) {
		if (isDisabled(carte) || !isClickable()) {
			return;
		}
		if (e.detail === 2 && props.actif) {
			onCliqueCarte(carte);
		}
	}
	function onCliqueCarte(carte: Carte) {
		if (props.paquet.attendre) {
			return;
		}

		if (!props.mise) return outputError("Pas de mise!");

		if (props.action.type === ActionType.JOUER && props.action.cptJoueur === 0) {
			props.paquet.setSorteDemandee(carte, props.mise.atout);
		}

		const joueurIdx = props.paquet.cliqueCarte(carte, props.action.joueur, props.action, props.mise.atout);
		if (joueurIdx !== undefined) {
			props.updateJoueur?.(joueurIdx);
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
		setCartes([]);

		props.nextAction();
	}

	function onDiscarterAtout() {
		const nCartes = props.paquet.atoutsJoues === 1 ? "1 carte" : "2 cartes";
		message.info(`${props.action.joueur.getNom()} a discarter ${nCartes} d'atout.`);
	}

	function isDisabled(carte: Carte): boolean {
		if (!props.actif) {
			return false;
		}
		if (props.action === null) {
			return false;
		}
		if (props.mise === null) {
			return false;
		}
		if (props.action.type === ActionType.DISCARTER && carte.points !== 0) {
			return true;
		}
		if (props.action.type === ActionType.JOUER) {
			if (!props.paquet.sorteDemandee || !props.mise) return false;
			return carte.isDisabled(cartes, props.paquet.sorteDemandee, props.mise.atout);
		}
		return false;
	}

	function isClickable() {
		return props.actif && props.action.type !== ActionType.CHOISIR_ATOUT;
	}

	React.useEffect(() => {
		initCartes();
	}, [props.paquet, props.cartes, props.cartes.length, cartes]);

	return (
		<div className={styles.GroupeCartesComponent} data-testid="GroupeCartesComponent">
			<Row gutter={6}>
				{/* Chaque carte */}
				{cartes.map((carte: Carte, index: number) => (
					<Col
						onClick={(e) => onClick(e, carte)}
						style={{ marginTop: carte.surelevee && props.actif ? "-10px" : "0px" }}
						key={index}
					>
						<CarteComponent
							moi={props.moi}
							clickable={isClickable()}
							disabled={isDisabled(carte)}
							carte={carte}
							ouvert={props.ouvert}
							auto={props.auto}
						></CarteComponent>
					</Col>
				))}
			</Row>
		</div>
	);
};

export default React.forwardRef(GroupeCartesComponent);
