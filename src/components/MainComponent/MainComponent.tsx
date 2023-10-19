import React, { FC } from "react";
import styles from "./MainComponent.module.css";
import { Row, Col } from "antd";
import CarteComponent from "../CarteComponent/CarteComponent";
import { Paquet } from "../../models/Paquet";

interface MainComponentProps {
	paquet: Paquet;
	ouvert: boolean;
}

const MainComponent: FC<MainComponentProps> = (props: MainComponentProps) => {
	return (
		<div className={styles.MainComponent} data-testid="MainComponent">
			{/* Carte partenaire */}
			<Row justify="center" style={{ marginTop: "-30px" }}>
				<Col>
					<CarteComponent
						carte={props.paquet.main[2]}
						ouvert={props.ouvert}
						carteMain={true}
					></CarteComponent>
				</Col>
			</Row>
			{/* Adversaires */}
			<Row>
				{/* Carte adversaire gauche */}
				<Col>
					<CarteComponent
						carte={props.paquet.main[1]}
						ouvert={props.ouvert}
						carteMain={true}
					></CarteComponent>
				</Col>
				{/* Carte adversaire droit */}
				<Col style={{ marginLeft: "55px" }}>
					<CarteComponent
						carte={props.paquet.main[3]}
						ouvert={props.ouvert}
						carteMain={true}
					></CarteComponent>
				</Col>
			</Row>
			{/* Ma carte */}
			<Row justify="center" style={{ marginBottom: "-80px" }}>
				<Col>
					<CarteComponent carte={props.paquet.main[0]} ouvert={true}></CarteComponent>
				</Col>
			</Row>
		</div>
	);
};

export default MainComponent;
