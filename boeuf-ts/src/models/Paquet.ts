import { outputError } from "../utils/generalUtil";
import { getMain1Carte1, getMeilleurChien, isCarteMaitre, piger } from "../utils/meilleureCarteUtil";
import { Action, ActionType } from "./Action";
import { Carte, Sorte, Symbole } from "./Carte";
import { Joueur } from "./Joueur";
import { Mise } from "./Mise";

export class Paquet {
	constructor(public avecQuettee: boolean) {
		this.initCartes();

		this.joueur1 = new Joueur("Gilberte", 0);
		this.joueur2 = new Joueur("Xavier", 1);
		this.joueur3 = new Joueur("Georgette", 2);
		this.joueur4 = new Joueur("Alexis", 3);

		this.joueurs = [this.joueur1, this.joueur2, this.joueur3, this.joueur4];

		this.clearMain();

		this.brasser();
	}
	public joueur1: Joueur;
	public joueur2: Joueur;
	public joueur3: Joueur;
	public joueur4: Joueur;
	public joueurs: Joueur[];
	public sorteDemandee: Sorte | null = null;
	public attendre: boolean = false;
	public points: number[] = [0, 0];
	public cartes: Carte[] = [];
	public pile: Carte[] = [];
	public main: Carte[] = [];
	public quettee: Carte[] | null = null;

	public initCartes() {
		this.cartes = [];
		let rang = 0;
		for (let sorte of [Sorte.COEUR, Sorte.PIQUE, Sorte.CARREAU, Sorte.TREFLE]) {
			let poids = 7;
			for (let symbole of [
				Symbole.SEPT,
				Symbole.HUIT,
				Symbole.NEUF,
				Symbole.DIX,
				Symbole.JACK,
				Symbole.DAME,
				Symbole.ROI,
				Symbole.AS,
			]) {
				this.cartes.push(new Carte(rang++, sorte, symbole, poids++));
			}
		}

		this.quettee = null;
		if (this.avecQuettee) {
			this.quettee = [];
			this.cartes.push(new Carte(rang++, Sorte.JOKER, null, 15));
			this.cartes.push(new Carte(rang, Sorte.BLANCHE, null, 16));
		}
	}

	public setJoueurActif(joueurActif: Joueur) {
		for (let joueur of this.joueurs) {
			if (joueur.getNom() === joueurActif.getNom()) {
				joueur.actif = true;
			} else {
				joueur.actif = false;
			}
		}
	}

	public getCartes() {
		return this.cartes;
	}

	public getJoueur1() {
		return this.joueur1;
	}

	public getJoueur2() {
		return this.joueur2;
	}

	public getJoueur3() {
		return this.joueur3;
	}

	public getJoueur4() {
		return this.joueur4;
	}

	public getJoueurs() {
		return this.joueurs.map((item) => item.getNom());
	}

	public getQuettee() {
		return this.quettee;
	}

	public getNextJoueur(joueur: Joueur): Joueur | undefined {
		let idx = joueur.getIndex() + 1;
		if (idx >= 4) {
			idx = 0;
		}
		return this.getJoueurParIdx(idx);
	}

	public clearMain() {
		this.main = [new Carte(), new Carte(), new Carte(), new Carte()];
		this.sorteDemandee = null;
	}

	public prendreQuettee(mise: Mise) {
		if (!this.quettee) return outputError("Pas de quettée!");
		const joueur = this.getJoueurParNom(mise.joueur.nom);

		if (!joueur) return outputError("Pas de joueur actif!");

		const carte1 = this.quettee[0];
		const carte2 = this.quettee[1];
		carte1.surelevee = true;
		carte2.surelevee = true;
		joueur.cartes.push(carte1);
		joueur.cartes.push(carte2);
		joueur.cartes.sort((a, b) => a.rang - b.rang);
		this.quettee = [];
	}

	public getJoueurParNom(nom: string): Joueur | undefined {
		return this.joueurs.find((item) => item.getNom() === nom);
	}

	public getJoueurParIdx(idx: number): Joueur | undefined {
		return this.joueurs.find((item) => item.getIndex() === idx);
	}

	public brasser() {
		// Paquet neuf
		this.initCartes();

		// Mélange
		for (let i = this.cartes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * i);
			const temp = this.cartes[i];
			this.cartes[i] = this.cartes[j];
			this.cartes[j] = temp;
		}

		// Passe aux joueurs
		this.joueur1.cartes = this.cartes.slice(0, 8).sort((a, b) => a.rang - b.rang);
		this.joueur2.cartes = this.cartes.slice(8, 16).sort((a, b) => a.rang - b.rang);
		this.joueur3.cartes = this.cartes.slice(16, 24).sort((a, b) => a.rang - b.rang);
		this.joueur4.cartes = this.cartes.slice(24, 32).sort((a, b) => a.rang - b.rang);

		// Passe quettée
		if (this.quettee !== null) {
			this.quettee = this.cartes.slice(32, 34).sort((a, b) => a.rang - b.rang);
		}

		// Réinitialize
		this.points = [0, 0];
		for (let joueur of this.joueurs) {
			joueur.resetRefuseSorte();
		}
	}

	public getPartenaire(joueur: Joueur): Joueur {
		switch (joueur.index) {
			case 0:
				return this.joueur3;
			case 1:
				return this.joueur4;
			case 2:
				return this.joueur1;
			case 3:
				return this.joueur2;
			default: {
				console.log("Joueur inconnu!");
				return new Joueur();
			}
		}
	}

	public cliqueCarte(carte: Carte, joueur: Joueur, action: Action, atout: Sorte) {
		if (joueur !== null) {
			switch (action.type) {
				case ActionType.PASSER: {
					if (!this.getPartenaire(joueur)) return outputError("Pas de partenaire!");
					const copie = carte.copy();
					copie.surelevee = true;
					this.getPartenaire(joueur).cartes.push(copie);
					this.getPartenaire(joueur).cartes.sort((a, b) => a.rang - b.rang);
					this.enleveCarte(carte, joueur.cartes);
					return;
				}
				case ActionType.DISCARTER: {
					this.enleveCarte(carte, joueur.cartes);
					this.enleveCarte(carte, this.cartes);
					this.pile.push(carte);
					return;
				}
				case ActionType.JOUER: {
					const joueurIdx = joueur.getIndex();
					this.main[joueurIdx] = carte.copy();
					this.pile.push(carte);

					if (!this.sorteDemandee) return outputError("Pas de sorte demandée!");
					joueur.setRefuseSorte(this.sorteDemandee, carte, atout);
					this.enleveCarte(carte, joueur.cartes);
					this.enleveCarte(carte, this.cartes);
					return;
				}
				default: {
					return;
				}
			}
		}
	}

	public enleveCarte(carte: Carte, cartes: Carte[]) {
		const idx = cartes.findIndex((item) => item.key === carte.key);
		cartes.splice(idx, 1);
	}

	public getCarteLead(atout: Sorte, petite: boolean): { carte: Carte; joueur: Joueur | undefined; points: number } {
		let carteGagnante = this.main[0];
		let remporteur: Joueur | undefined = this.joueur1;
		for (let i = 1; i < this.main.length; ++i) {
			let carte = this.main[i];
			if (carte.isAtout(atout) && !carteGagnante.isAtout(atout)) {
				carteGagnante = carte;
				remporteur = this.getJoueurParIdx(i);
			} else if (
				carte.sorte === this.sorteDemandee &&
				carteGagnante.sorte !== this.sorteDemandee &&
				!carteGagnante.isAtout(atout)
			) {
				carteGagnante = carte;
				remporteur = this.getJoueurParIdx(i);
			} else if (carte.sorte === carteGagnante.sorte || (carte.isAtout(atout) && carteGagnante.isAtout(atout))) {
				if (petite) {
					if (carte.rang < carteGagnante.rang) {
						carteGagnante = carte;
						remporteur = this.getJoueurParIdx(i);
					}
				} else {
					if (carte.rang > carteGagnante.rang) {
						carteGagnante = carte;
						remporteur = this.getJoueurParIdx(i);
					}
				}
			}
		}
		let points = 0;
		for (let carte of this.main) {
			points += carte.points;
		}
		return { carte: carteGagnante, joueur: remporteur, points: points };
	}

	public getRemporteur(mise: Mise, mainDeTable: boolean): Joueur | undefined {
		const lead = this.getCarteLead(mise.atout, mise.petite);
		if (lead.joueur) {
			this.points[lead.joueur.equipeIdx] += lead.points;
			if (mainDeTable) {
				this.points[lead.joueur.equipeIdx] += 10;
			}
		}
		return lead.joueur;
	}

	public trierBibittes(mise: Mise) {
		let rang1 = -1;

		switch (mise.atout) {
			case Sorte.COEUR: {
				rang1 = 7;
				break;
			}
			case Sorte.PIQUE: {
				rang1 = 15;
				break;
			}
			case Sorte.CARREAU: {
				rang1 = 23;
				break;
			}
			case Sorte.TREFLE: {
				rang1 = 31;
				break;
			}
			case Sorte.SANS_ATOUT: {
				rang1 = 0;
				break;
			}
			default: {
				break;
			}
		}

		const joker = this.cartes.find((carte) => carte.sorte === Sorte.JOKER);
		const blanche = this.cartes.find((carte) => carte.sorte === Sorte.BLANCHE);

		if (mise.atout === Sorte.SANS_ATOUT) {
			if (mise.petite) {
				if (joker !== undefined) joker.rang = rang1 + 0.25;
				if (blanche !== undefined) blanche.rang = rang1 + 0.75;
			} else {
				if (joker !== undefined) joker.rang = rang1 - 0.25;
				if (blanche !== undefined) blanche.rang = rang1 - 0.75;
			}
		} else {
			if (joker !== undefined) joker.rang = rang1 + 0.25;
			if (blanche !== undefined) blanche.rang = rang1 + 0.75;
		}
		for (let joueur of this.joueurs) {
			joueur.cartes.sort((a, b) => a.rang - b.rang);
		}
	}

	public getMeilleureCarte(action: Action, mise: Mise): Carte | undefined {
		if (!this.sorteDemandee) return outputError("Pas de sorte demandee!");
		const cartes = action.joueur.cartes;
		// 1re main, 1re carte
		if (action.cptCarte === 0 && action.cptJoueur === 0) {
			return getMain1Carte1(cartes, mise.atout, this.pile);
		}
		// 1re carte
		if (action.cptJoueur === 0) {
			return this.getCarte1(action.joueur, mise, this.pile, this.cartes);
		}
		// Dernière carte de la main
		if (action.cptJoueur === 3) {
			return this.getCarte4(action.joueur, this.sorteDemandee, mise);
		}
		const sorteDemandee: Sorte = this.sorteDemandee;
		return cartes.find((c) => !c.isDisabled(cartes, sorteDemandee, mise.atout));
	}

	public getCarte(poids: number, sorte: Sorte): Carte | undefined {
		return this.cartes.find((c) => c.sorte === sorte && c.poids === poids);
	}

	public setSorteDemandee(carte: Carte, atout: Sorte) {
		if (carte.isAtout(atout)) {
			this.sorteDemandee = atout;
		} else {
			this.sorteDemandee = carte.sorte;
		}
	}

	public adversairesAtout(joueur: Joueur, atout: Sorte): boolean {
		if (joueur.getIndex() % 2 === 0) {
			return !this.joueur2.getRefuseSorte(atout) || !this.joueur4.getRefuseSorte(atout);
		}

		return !this.joueur1.getRefuseSorte(atout) || !this.joueur3.getRefuseSorte(atout);
	}

	public getCarte1(joueur: Joueur, mise: Mise, pile: Carte[], cartesRestantes: Carte[]): Carte {
		const mesCartes = joueur.getCartes();
		const cartesAtout = joueur.getCartes().filter((c) => c.isAtout(mise.atout));
		const adversairesAtout = this.adversairesAtout(joueur, mise.atout);
		if (cartesAtout.length > 0) {
			// Adversaires pas d'atout et j'en ai plus d'un
			if (!adversairesAtout && cartesAtout.length > 1) {
				return piger(cartesAtout, "max");
			}

			const joueurGage = mise.joueur === joueur;
			const equipeGage = joueurGage || mise.joueur === this.getPartenaire(joueur);

			if (equipeGage) {
				if (cartesAtout.length > 1 || !joueurGage) {
					// Carte maître
					const atoutMax = piger(cartesAtout, "max");
					if (isCarteMaitre(atoutMax, mesCartes, pile, mise.atout)) {
						return atoutMax;
					}

					// Adversaire pas d'atout
					if (!adversairesAtout) {
						return piger(cartesAtout, "max");
					}

					const atoutsPasPoint = cartesAtout.filter((c) => c.points === 0);

					if (atoutsPasPoint.length > 0) {
						// Partenaire gagé
						if (mise.joueur === this.getPartenaire(joueur)) {
							// Plus gros atout qui n'est pas un point
							if (atoutsPasPoint.length > 0) {
								return piger(atoutsPasPoint, "max");
							}
						}

						// Plus petit atout qui n'est pas un point
						return piger(atoutsPasPoint, "min");
					}
				}
			}
		}
		return joueur.cartes[0];
	}

	public getCarte4(joueur: Joueur, sorteDemandee: Sorte, mise: Mise): Carte {
		const mesCartes = joueur.getCartes();
		const cartesPossibles = mesCartes.filter((c) => !c.isDisabled(mesCartes, sorteDemandee, mise.atout));

		const lead = this.getCarteLead(mise.atout, mise.petite);
		// Partenaire lead
		if (lead.joueur === this.getPartenaire(joueur)) {
			// Atout demandé et disponible
			if (sorteDemandee === mise.atout && !joueur.getRefuseSorte(mise.atout)) {
				// Plus gros atout
				return piger(cartesPossibles, "max");
			}

			// Plus gros point
			const points = cartesPossibles.filter((c) => c.points > 0);
			if (points.length > 0) {
				return piger(points, "max");
			}

			// Meilleur chien
			const chien = getMeilleurChien(mesCartes, mise.atout, this.pile);
			if (chien !== null) {
				return chien;
			}
		}
		// Adversaire lead
		else {
			const points = this.main.filter((c) => c.points > 0);

			// Points en jeu
			if (points.length > 0) {
				// A sorte demandee
				if (!joueur.getRefuseSorte(sorteDemandee)) {
					// Carte plus forte
					const cartesRemporte = cartesPossibles.filter((c) => c.rang > lead.carte.rang);
					if (cartesRemporte.length > 0) {
						return piger(cartesRemporte, "min");
					}
					const cartesPasPoint = cartesPossibles.filter((c) => c.points === 0);
					if (cartesPasPoint.length > 0) {
						return piger(cartesPasPoint, "min");
					}
					return piger(cartesPossibles, "min");
				}
				const cartesAtout = cartesPossibles.filter((c) => c.isAtout(mise.atout));
				// Coupe
				if (cartesAtout.length > 0) {
					const pointsAtout = cartesAtout.filter((c) => c.points > 0);
					// Avec plus gros point
					if (pointsAtout.length > 0) {
						return piger(pointsAtout, "max");
					}
					// Avec plus petit atout
					return piger(cartesAtout, "min");
				}
			}
		}
		return joueur.cartes[0];
	}
}
