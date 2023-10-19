import React, { FC } from "react";
import styles from "./GroupeCartesComponent.module.css";
import { Col, Row } from "antd";
import { Carte, Sorte } from "../../models/Carte";
import { Mise } from "../../models/Mise";
import { Action, ActionType } from "../../models/Action";
import CarteComponent from "../CarteComponent/CarteComponent";

interface GroupeCartesComponentProps {
	actif: boolean;
	mise?: Mise;
	sorteDemandee?: Sorte;
	action: Action;
	cartes: Carte[];
	ouvert: boolean;
	auto: boolean;
	moi?: boolean;
	cliqueCarte?: (carte: Carte) => void;
}

const GroupeCartesComponent: FC<GroupeCartesComponentProps> = (props: GroupeCartesComponentProps) => {
	function onClick(e: any, carte: Carte) {
		if (isDisabled(carte) || !isClickable()) {
			return;
		}
		if (e.detail === 2 && props.actif) {
			props.cliqueCarte?.(carte);
		}
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
			if (!props.sorteDemandee || !props.mise) return false;
			return carte.isDisabled(props.cartes, props.sorteDemandee, props.mise.atout);
		}
		return false;
	}

	function isClickable() {
		return props.actif && props.action.type !== ActionType.CHOISIR_ATOUT;
	}

	return (
		<div className={styles.GroupeCartesComponent} data-testid="GroupeCartesComponent">
			<Row gutter={6}>
				{/* Chaque carte */}
				{props.cartes.map((carte: Carte, index: number) => (
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

export default GroupeCartesComponent;
