import { Joueur } from "./Joueur";
import { Mise } from "./Mise";
import { Paquet } from "./Paquet";

export enum ActionType {
	GAGER = "GAGER",
	CHOISIR_ATOUT = "CHOISIR_ATOUT",
	PASSER = "PASSER",
	DISCARTER = "DISCARTER",
	JOUER = "JOUER",
	REMPORTER = "REMPORTER",
	BRASSER = "BRASSER",
}

export class Action {
	constructor(
		public type: ActionType,
		public joueur: Joueur,
		public remporteur: Joueur,
		public cptCarte: number = 0,
		public cptJoueur = 0
	) {}

	public getMsg() {
		switch (this.type) {
			case ActionType.GAGER: {
				return `C'est le temps de gager!`;
			}
			case ActionType.CHOISIR_ATOUT: {
				return `${this.joueur.nom}, c'est le temps de choisir l'atout!`;
			}
			case ActionType.PASSER: {
				return `${this.joueur.nom}, c'est à toi à discarter!`;
			}
			case ActionType.DISCARTER: {
				return `${this.joueur.nom}, c'est à toi à discarter!`;
			}
			case ActionType.JOUER: {
				return `${this.joueur.nom}, c'est à toi à jouer!`;
			}
			case ActionType.BRASSER: {
				return `${this.joueur.nom}, c'est à toi à brasser!`;
			}
			case ActionType.REMPORTER: {
				if (!this.remporteur) return "";
				return `${this.remporteur.nom} a remporté la main!`;
			}
			default: {
				return "";
			}
		}
	}

	public copy() {
		return JSON.parse(JSON.stringify(this));
	}

	public next(mise: Mise, avecQuettee: boolean, paquet: Paquet, brasseur: Joueur, auto: boolean): Action {
		const action = this.copy();
		switch (this.type) {
			case ActionType.GAGER: {
				if (avecQuettee) {
					paquet.prendreQuettee(mise);
					action.type = ActionType.CHOISIR_ATOUT;
					action.cptCarte = 0;
				} else {
					action.type = ActionType.JOUER;
				}
				action.joueur = paquet.getJoueurParNom(mise.joueur.nom);
				break;
			}
			case ActionType.CHOISIR_ATOUT: {
				paquet.trierBibittes(mise);
				action.type = ActionType.PASSER;
				break;
			}
			case ActionType.PASSER: {
				if (action.cptCarte === 0) {
					action.cptCarte++;
				} else {
					action.cptCarte = 0;
					action.type = ActionType.DISCARTER;
					action.joueur = paquet.getPartenaire(action.joueur);
				}
				break;
			}
			case ActionType.DISCARTER: {
				if (action.cptCarte === 0) {
					action.cptCarte++;
				} else {
					action.cptCarte = 0;
					action.type = ActionType.JOUER;
					paquet.sorteDemandee = null;
					const miseur = paquet.getJoueurParNom(mise.joueur.nom);
					if (miseur) {
						// Clear quettee pour miseur
						for (let carte of miseur.cartes) {
							carte.surelevee = false;
						}
						// Clear quettee pour partenaire
						for (let carte of action.joueur.cartes) {
							carte.surelevee = false;
						}
						action.joueur = paquet.getNextJoueur(miseur);
					} else {
						console.log("Pas de miseur!");
					}
				}
				break;
			}
			case ActionType.JOUER: {
				action.cptJoueur++;
				if (action.cptJoueur === 4) {
					action.type = ActionType.REMPORTER;
					action.cptCarte++;
					action.cptJoueur = 0;
					action.remporteur = paquet.getRemporteur(mise, action.cptCarte === 8);
					action.joueur = action.remporteur;
				} else {
					action.joueur = paquet.getNextJoueur(action.joueur);
				}

				break;
			}
			case ActionType.REMPORTER: {
				paquet.clearMain();
				if (action.cptCarte === 8) {
					action.cptCarte = 0;
					action.cptJoueur = 0;
					action.type = ActionType.BRASSER;
					action.joueur = paquet.getNextJoueur(brasseur);
					action.remporteur = null;
				} else {
					action.type = ActionType.JOUER;
				}
				break;
			}
			case ActionType.BRASSER: {
				action.type = ActionType.BRASSER;
				break;
			}
			default: {
			}
		}
		paquet.setJoueurActif(action.joueur);
		return action;
	}
}
