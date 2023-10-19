import React from "react";
import "./App.css";
import { useTranslation } from "react-i18next";
import { Modal, Layout, Col, Row, Switch, Button } from "antd";
import { Action, ActionType } from "./models/Action";
import { Partie } from "./models/Partie";
import { Paquet } from "./models/Paquet";
import TableComponent, { TableComponentMethods } from "./components/TableComponent/TableComponent";
import { Mise } from "./models/Mise";
import { Sorte } from "./models/Carte";

const { Header, Content } = Layout;
const delaiAuto = 500;

function App() {
	const [paquet, setPaquet] = React.useState<Paquet>(new Paquet(true));
	const [action, setAction] = React.useState<Action>(new Action(ActionType.BRASSER, paquet.joueur1));
	const [partie, setPartie] = React.useState<Partie>(new Partie(paquet));
	const [auto, setAuto] = React.useState<boolean>(false);
	const [mise, setMise] = React.useState<Mise>(new Mise(paquet.joueur1, 0, Sorte.SANS_ATOUT));
	const [avecQuettee, setAvecQuettee] = React.useState<boolean>(true);
	const [ouvert, setOuvert] = React.useState<boolean>(true);
	const [titre, setTitre] = React.useState<string>("");
	const [showScore, setShowScore] = React.useState<boolean>(false);
	const tableRef = React.useRef<TableComponentMethods | null>(null);
	const { t, i18n } = useTranslation();
	function getSousTitre(): string {
		if (!action) {
			console.log("Action undefined!");
			return "";
		}
		let sousTitre = action.getMsg();
		if (action !== null && partie !== null) {
			if (action.type === ActionType.JOUER && paquet.sorteDemandee) {
				sousTitre = `${sousTitre} (${paquet.sorteDemandee} demandé)`;
			}
		}
		return sousTitre;
	}
	function onQuettee(checked: boolean) {}
	function onJeuOuvert(checked: boolean) {}
	function onAuto(checked: boolean) {}
	function onBrasser() {}
	function onGager() {}
	function onScore() {}
	function onTest() {}
	function nextAction() {
		const brasseur = partie.brasses[partie.brasses.length - 1].brasseur;
		setAction(action.next(mise, avecQuettee, paquet, brasseur, auto));
		if (action.type === ActionType.REMPORTER) {
			paquet.attendre = true;
			if (action.cptCarte === 8) {
				setTitre("On joue au beu!!!");
			}
			setTimeout(() => {
				nextAction();
				paquet.attendre = false;
			}, delaiAuto);
		}
		if (action.type === ActionType.BRASSER) {
			partie.nextBrasse(paquet.points, mise);
			setShowScore(true);
			onScore();
		}
		if (action.type === ActionType.JOUER && action.joueur.index !== 0 && auto) {
			setTimeout(() => {
				tableRef?.current?.onCliqueCarte(paquet.getMeilleureCarte(action, mise));
				paquet.attendre = false;
			}, delaiAuto);
		}
	}
	function onNextAction() {
		nextAction();
	}
	return (
		<div
			className="App"
			style={{
				backgroundColor: "rgb(50,50,50)",
			}}
		>
			{/* Titre */}
			<Header
				style={{
					backgroundColor: "rgb(50,50,50)",
				}}
			>
				<h1 style={{ color: "white", marginBottom: "-20px" }}>{t("general.titre")}</h1>
				{
					// Sous-titre
					<h2 style={{ color: "rgb(32,166,237)" }}>{getSousTitre()}</h2>
				}
			</Header>
			<Content>
				<div>
					<div className="App-controls">
						<Row gutter={6}>
							<Col>
								<p style={{ color: "white" }}>Quettée </p>
							</Col>
							<Col>
								<Switch defaultChecked onChange={(checked) => onQuettee(checked)} />
							</Col>
						</Row>
						<Row gutter={6}>
							<Col>
								<p style={{ color: "white" }}>Jeu ouvert</p>
							</Col>
							<Col>
								<Switch defaultChecked onChange={(checked) => onJeuOuvert(checked)} />
							</Col>
						</Row>
						<Row gutter={6}>
							<Col>
								<p style={{ color: "white" }}>Auto</p>
							</Col>
							<Col>
								<Switch onChange={(checked) => onAuto(checked)} />
							</Col>
						</Row>
						<Button type="primary" onClick={() => onBrasser()}>
							Brasser
						</Button>
						<Button style={{ marginTop: "15px" }} type="primary" onClick={() => onGager()}>
							Gager
						</Button>
						<Button style={{ marginTop: "15px" }} type="primary" onClick={() => onScore()}>
							Score
						</Button>
						<Button style={{ marginTop: "15px" }} type="primary" onClick={() => onTest()}>
							Test
						</Button>
					</div>

					{/* Table */}
					<div className="App-center" style={{ marginTop: "-60px", height: "100vh" }}>
						{paquet && (
							<TableComponent
								ref={tableRef}
								auto={auto}
								paquet={paquet}
								action={action}
								nextAction={onNextAction}
								mise={mise}
								ouvert={ouvert}
								avecQuettee={avecQuettee}
							></TableComponent>
						)}
					</div>
				</div>
			</Content>
		</div>
	);
}

export default App;
