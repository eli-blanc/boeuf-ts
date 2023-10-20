import React, { FC } from "react";
import styles from "./CarteComponent.module.css";
import { Card } from "antd";
// import "antd/dist/antd.min.css";
import { Carte } from "../../models/Carte";
import { useTranslation } from "react-i18next";

interface CarteComponentProps {
	clickable?: boolean;
	disabled?: boolean;
	carte: Carte;
	ouvert: boolean;
	auto?: boolean;
	moi?: boolean;
	carteMain?: boolean;
}

const CarteComponent: FC<CarteComponentProps> = (props: CarteComponentProps) => {
	const { t } = useTranslation();
	function marqueDesactive() {
		return props.disabled && (props.ouvert || !props.auto || props.moi);
	}
	return (
		<div className={styles.CarteComponent} data-testid="CarteComponent">
			<Card
				hoverable={props.clickable && !props.disabled}
				bordered
				style={{
					width: 45,
					height: 70,
					backgroundColor: props.carte.rang === -1 ? "transparent" : marqueDesactive() ? "grey" : "white",
					borderColor: props.carte.rang === -1 ? "transparent" : marqueDesactive() ? "grey" : "white",
				}}
				cover={
					<div className="App-center">
						{/* Ouvert */}
						{(props.ouvert || props.carteMain) && (
							<div hidden={props.carte.rang === -1}>
								<p style={{ color: props.carte.couleur, fontSize: "24px", marginTop: "-5px" }}>
									{props.carte.getSymbole()}
								</p>
								<div style={{ marginTop: !props.carte.symbole ? "-10px" : "-25px" }}>
									<img
										alt="oups..."
										className={!props.carte.symbole ? "App-jokers" : "App-sorte"}
										src={`assets/images/${props.carte.image}`}
									/>
								</div>
							</div>
						)}
						{/* Cachée */}
						{!(props.ouvert || props.carteMain) && (
							<div hidden={props.carte.rang === -1}>
								<div className="App-center" style={{ marginTop: "3px" }}>
									<img
										style={{ height: "65px", width: "40px" }}
										alt="oups..."
										src={`assets/images/endos.png`}
									/>
								</div>
							</div>
						)}
					</div>
				}
			></Card>
		</div>
	);
};

export default CarteComponent;
