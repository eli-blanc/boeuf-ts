import { Form, InputNumber, Radio, Select } from "antd";
import React, { FC } from "react";
import { Sorte } from "../../models/Carte";
import { Joueur } from "../../models/Joueur";
import { Mise, Montant } from "../../models/Mise";
import styles from "./MiseComponent.module.css";

interface MiseComponentProps {
	mise: Mise;
	joueurs: Joueur[];
	atoutEnabled: boolean;
	setMise: (newMise: Mise) => void;
}

const MiseComponent: FC<MiseComponentProps> = (props) => {
	const [radioIdx, setRadioIdx] = React.useState<number>(1);
	const [mise, setMise] = React.useState<Mise>(props.mise);

	const joueurs: any[] = [];
	props.joueurs.map((item: Joueur, index: number) =>
		joueurs.push(<Select.Option key={index}>{item.nom}</Select.Option>)
	);
	const atoutsList = [Sorte.COEUR, Sorte.PIQUE, Sorte.CARREAU, Sorte.TREFLE, Sorte.SANS_ATOUT];
	const atouts: any[] = [];
	atoutsList.map((item, index) => atouts.push(<Select.Option key={index}>{item}</Select.Option>));

	function onJoueur(nom: string) {
		const joueur = props.joueurs.find((j) => j.nom === nom);
		if (joueur) {
			mise.joueur = joueur;
			props.setMise(mise);
		}
	}

	function onAtout(idx: number) {
		props.mise.atout = atoutsList[idx];
	}

	function onMontant(value: any) {
		props.mise.montant = value;
	}

	function onMontantRadio(idx: any) {
		setRadioIdx(idx);

		if (idx > 1) {
			props.mise.montant = 150;
		}
		if (idx === 2) {
			props.mise.petite = true;
		}
	}
	return (
		<div className={styles.MiseComponent} data-testid="MiseComponent">
			<Form
				colon={false}
				labelCol={{
					span: 4,
				}}
				wrapperCol={{
					span: 14,
				}}
				layout="horizontal"
			>
				<Form.Item label="Qui?" required style={{ width: "600px" }}>
					{/* Joueur */}
					<Select
						allowClear
						onChange={(nom: string) => onJoueur(nom)}
						defaultValue="Gilberte"
						disabled={props.atoutEnabled}
					>
						{joueurs}
					</Select>
				</Form.Item>
				{/* Montant */}
				<Form.Item label="Combien?" required style={{ width: "600px" }}>
					<Radio.Group
						onChange={(e) => onMontantRadio(e.target.value)}
						value={radioIdx}
						style={{ width: "600px" }}
						disabled={props.atoutEnabled}
					>
						<Radio value={1}>
							<InputNumber
								style={{ width: "70px" }}
								defaultValue="60"
								step="5"
								min="50"
								max="140"
								disabled={props.atoutEnabled}
								onChange={(value) => onMontant(value)}
							/>
						</Radio>
						<Radio value={2}>{Montant.PETITE}</Radio>
						<Radio value={3}>{Montant.GROSSE}</Radio>
					</Radio.Group>
				</Form.Item>
				{/* Atout */}
				<Form.Item label="En quoi?" required style={{ width: "600px" }}>
					<Select
						allowClear
						onChange={(atout) => onAtout(atout)}
						defaultValue={Sorte.PIQUE}
						disabled={!props.atoutEnabled}
					>
						{atouts}
					</Select>
				</Form.Item>
			</Form>
		</div>
	);
};

export default MiseComponent;
