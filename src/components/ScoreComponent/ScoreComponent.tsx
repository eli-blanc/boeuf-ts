import React, { FC } from "react";
import styles from "./ScoreComponent.module.css";
import { Table } from "antd";
import { Brasse } from "../../models/Partie";

interface ScoreComponentProps {
	brasses: Brasse[];
}

export interface ScoreComponentMethods {
	updateData: (brasses: Brasse[]) => void;
}

const ScoreComponent: React.ForwardRefRenderFunction<ScoreComponentMethods, ScoreComponentProps> = (props, ref) => {
	const [data, setData] = React.useState<any[]>([]);
	const columns = [
		{
			title: "Brasse",
			dataIndex: "key",
			key: "key",
		},
		{
			title: "Brasseur",
			dataIndex: "brasseur",
			key: "brasseur",
		},
		{
			title: "Nous",
			dataIndex: "nous",
			key: "eux",
		},
		{
			title: "Eux",
			dataIndex: "eux",
			key: "eux",
		},
	];
	React.useImperativeHandle(ref, () => ({ updateData }));

	function updateData(brasses: Brasse[]) {
		const newData = [];
		for (let brasse of brasses) {
			const ligne = {
				key: brasse.idx + 1,
				brasseur: brasse.brasseur.getNom(),
				nous: brasse.done ? brasse.points[0] : null,
				eux: brasse.done ? brasse.points[1] : null,
			};
			newData.push(ligne);
			setData(newData);
		}
	}

	return (
		<div className={styles.ScoreComponent} data-testid="ScoreComponent">
			<Table size="small" columns={columns} dataSource={data} />
		</div>
	);
};

export default React.forwardRef(ScoreComponent);
