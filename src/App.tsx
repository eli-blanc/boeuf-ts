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
import ScoreComponent, { ScoreComponentMethods } from "./components/ScoreComponent/ScoreComponent";
import MiseComponent from "./components/MiseComponent/MiseComponent";

const { Header, Content } = Layout;
const delaiAuto = 500;

function App() {
	// States
	const [paquet, setPaquet] = React.useState<Paquet>(new Paquet(true));
	const [action, setAction] = React.useState<Action>(getInitAction());
	const [partie, setPartie] = React.useState<Partie>(new Partie(paquet));
	const [auto, setAuto] = React.useState<boolean>(false);
	const [avecQuettee, setAvecQuettee] = React.useState<boolean>(true);
	const [showGager, setShowGager] = React.useState<boolean>(false);
	const [choisirAtout, setChoisirAtout] = React.useState<boolean>(false);
	const [mise, setMise] = React.useState<Mise>(new Mise(paquet.joueur1));
	const [ouvert, setOuvert] = React.useState<boolean>(true);
	const [titre, setTitre] = React.useState<string>("");
	const [sousTitre, setSousTitre] = React.useState<string>("");
	const [showScore, setShowScore] = React.useState<boolean>(false);

	// Ref
	const tableRef = React.useRef<TableComponentMethods | null>(null);
	const scoreRef = React.useRef<ScoreComponentMethods | null>(null);

	// Other
	const { t, i18n } = useTranslation();

	// Methods
	function updateSousTitre() {
		if (!action) {
			console.log("Action undefined!");
			return "";
		}
		let newSousTitre = action.getMsg();
		if (action !== null && partie !== null) {
			if (action.type === ActionType.JOUER && paquet.sorteDemandee) {
				newSousTitre = `${newSousTitre} (${paquet.sorteDemandee} demandé)`;
			}
		}
		setSousTitre(newSousTitre);
	}

	function getInitAction(): Action {
		return new Action(ActionType.GAGER, paquet.joueur1);
	}
	function onJeuOuvert() {
		setOuvert(!ouvert);
	}

	function onQuettee(checked: boolean) {
		setAvecQuettee(checked);
		paquet.avecQuettee = checked;
		paquet.brasser();
		setAction(getInitAction());
	}

	function onAuto() {
		setAuto(!auto);
	}

	function onBrasser() {
		partie.paquet.brasser();
		setMise(new Mise(paquet.joueur1));
		setAction(getInitAction());
	}

	function onGager() {
		let mise;
		if (mise === null || action.type === ActionType.BRASSER) {
			setMise(new Mise(paquet.joueur1));
		}

		setShowGager(true);
	}

	function onScore() {
		scoreRef?.current?.updateData(partie.brasses);
		setShowScore(true);
	}

	function onGagerOk() {
		setShowGager(false);
		setChoisirAtout(!choisirAtout);
		setTitre(mise.getStr());
		nextAction();
	}

	function onGagerCancel() {
		setShowGager(false);
	}

	function onScoreOk() {
		setShowScore(false);
	}

	function onScoreCancel() {
		setShowScore(false);
	}
	function nextAction() {
		setSousTitre("");
		const brasseur = partie.brasses[partie.brasses.length - 1].brasseur;
		setAction(action.next(mise, paquet.avecQuettee, paquet, brasseur));
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
		if (action.type === ActionType.JOUER && action.joueur?.index !== 0 && auto) {
			setTimeout(() => {
				tableRef?.current?.onCliqueCarte(paquet.getMeilleureCarte(action, mise));
				paquet.attendre = false;
			}, delaiAuto);
		}
		if (action.type === ActionType.PASSER) {
			tableRef.current?.updateJoueurs();
		}
	}
	function onNextAction() {
		nextAction();
	}

	React.useEffect(() => {
		paquet.brasser();
	}, [paquet]);

	React.useEffect(() => {
		if (sousTitre === "") {
			updateSousTitre();
		}
	}, [sousTitre]);

	React.useEffect(() => {
		updateSousTitre();
	}, [action]);
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
					<h2 style={{ color: "rgb(32,166,237)" }}>{sousTitre}</h2>
				}
			</Header>
			<Content>
				<div>
					<div className="App-controls">
						<Row className="Switch-container control">
							<span className="Switch-label">Quettée</span>
							<Switch checked={avecQuettee} onChange={(checked) => onQuettee(checked)} />
						</Row>
						<Row className="Switch-container control">
							<span className="Switch-label">Jeu ouvert</span>
							<Switch defaultChecked={true} onChange={onJeuOuvert} />
						</Row>
						<Row className="Switch-container control">
							<span className="Switch-label">Auto</span>
							<Switch defaultChecked={false} onChange={onAuto} />
						</Row>
						<Button className="control" type="primary" onClick={() => onBrasser()}>
							Brasser
						</Button>
						<Button className="control" type="primary" onClick={() => onGager()}>
							Gager
						</Button>
						<Button className="control" type="primary" onClick={() => onScore()}>
							Score
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
								avecQuettee={paquet.avecQuettee}
							></TableComponent>
						)}
					</div>{" "}
					{/* Gager */}
					<Modal title="Configurer la mise" open={showGager} onOk={onGagerOk} onCancel={onGagerCancel}>
						<MiseComponent
							mise={mise}
							joueurs={paquet.joueurs}
							atoutEnabled={choisirAtout}
							setMise={setMise}
						></MiseComponent>
					</Modal>
					{/* Score */}
					<Modal title="Score" open={showScore} onOk={onScoreOk} onCancel={onScoreCancel}>
						<ScoreComponent brasses={partie.brasses} ref={scoreRef}></ScoreComponent>
					</Modal>
				</div>
			</Content>
		</div>
	);
}

export default App;
