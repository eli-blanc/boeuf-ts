import { Joueur } from "./Joueur";
import { Mise } from "./Mise";
import { FOU, Paquet } from "./Paquet";

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
		public joueur: Joueur = FOU,
		public remporteur: Joueur = FOU,
		public cptCarte: number = 0,
		public cptJoueur = 0
	) {}

	public getMsg(): string {
		if (!this.joueur) {
			console.log("Pas de joueur courant!");
			return "";
		}
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

	public next(mise: Mise, avecQuettee: boolean, paquet: Paquet, brasseur: Joueur): Action {
		if (!this.joueur) {
			console.log("Pas de joueur actif!");
			return this;
		}
		switch (this.type) {
			case ActionType.GAGER: {
				if (avecQuettee) {
					paquet.prendreQuettee(mise);
					this.type = ActionType.CHOISIR_ATOUT;
					this.cptCarte = 0;
				} else {
					this.type = ActionType.JOUER;
				}
				this.joueur = mise.joueur;
				break;
			}
			case ActionType.CHOISIR_ATOUT: {
				paquet.trierBibittes(mise);
				this.type = ActionType.PASSER;
				break;
			}
			case ActionType.PASSER: {
				if (this.cptCarte === 0) {
					this.cptCarte++;
				} else {
					this.cptCarte = 0;
					this.type = ActionType.DISCARTER;
					this.joueur = paquet.getPartenaire(this.joueur);
				}
				break;
			}
			case ActionType.DISCARTER: {
				if (this.cptCarte === 0) {
					this.cptCarte++;
				} else {
					this.cptCarte = 0;
					this.type = ActionType.JOUER;
					paquet.sorteDemandee = undefined;
					const miseur = paquet.getJoueurParNom(mise.joueur.nom);
					if (miseur) {
						// Clear quettee pour miseur
						for (let carte of miseur.cartes) {
							carte.surelevee = false;
						}
						// Clear quettee pour partenaire
						for (let carte of this.joueur.cartes) {
							carte.surelevee = false;
						}
						this.joueur = paquet.getNextJoueur(miseur);
					} else {
						console.log("Pas de miseur!");
					}
				}
				break;
			}
			case ActionType.JOUER: {
				this.cptJoueur++;
				if (this.cptJoueur === 4) {
					this.type = ActionType.REMPORTER;
					this.cptCarte++;
					this.cptJoueur = 0;
					this.remporteur = paquet.getRemporteur(mise, this.cptCarte === 8);
					this.joueur = this.remporteur;
				} else {
					this.joueur = paquet.getNextJoueur(this.joueur);
				}

				break;
			}
			case ActionType.REMPORTER: {
				paquet.clearMain();
				if (this.cptCarte === 8) {
					this.cptCarte = 0;
					this.cptJoueur = 0;
					this.type = ActionType.BRASSER;
					this.joueur = paquet.getNextJoueur(brasseur);
					this.remporteur = FOU;
				} else {
					this.type = ActionType.JOUER;
				}
				break;
			}
			case ActionType.BRASSER: {
				this.type = ActionType.BRASSER;
				break;
			}
			default: {
			}
		}
		if (!this.joueur) {
			console.log("Pas de joueur actif!");
			return this;
		}
		paquet.setJoueurActif(this.joueur);
		return this;
	}
}
