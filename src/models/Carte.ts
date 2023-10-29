import i18next from "i18next";

export enum Sorte {
	COEUR = 1,
	PIQUE = 2,
	CARREAU = 3,
	TREFLE = 4,
	JOKER = 5,
	BLANCHE = 6,
	SANS_ATOUT = 7,
}

export enum Couleur {
	NOIR = "black",
	ROUGE = "red",
}

export enum Symbole {
	SEPT = 1,
	HUIT = 2,
	NEUF = 3,
	DIX = 4,
	JACK = 5,
	DAME = 6,
	ROI = 7,
	AS = 8,
}

export function getSorteStr(sorte: Sorte): string {
	const key = getKeyByValue(Sorte, sorte);
	if (!key) return "";
	const sorteStr = i18next.t(`sortes.${key}`);
	return sorteStr;
}

export function getSymboleStr(symbole: Symbole | null): string {
	if (symbole === null) return "";
	const key = getKeyByValue(Symbole, symbole);
	if (!key) return "";
	const symboleStr = i18next.t(`symboles.${key}`);
	return symboleStr;
}

function getKeyByValue(enumType: any, value: string | number): string | undefined {
	const keys = Object.keys(enumType).filter((key) => enumType[key] === value);
	return keys.length > 0 ? keys[0] : undefined;
}

export class Carte {
	constructor(
		public rang: number = -1,
		public sorte: Sorte = Sorte.COEUR,
		public symbole: Symbole | null = Symbole.AS,
		public poids = 0
	) {
		this.key = `${getSymboleStr(symbole)}|${getSorteStr(sorte)}`;
		this.symbole = symbole;
		this.poids = poids;

		this.image = this.getImage();
		this.couleur = this.getCouleur();
		this.setPoints();
	}
	public key: string;
	public surelevee: boolean = false;
	public couleur: Couleur;
	public image: string;
	public points: number = 0;

	public copy() {
		const carte = new Carte(this.rang, this.sorte, this.symbole, this.poids);
		return carte;
	}
	public getSymbole(): string {
		if (!this.symbole) return "";
		const key = getKeyByValue(Symbole, this.symbole);
		const str = i18next.t(`symboles.${key}`);
		return str;
	}

	public getImage(): string {
		switch (this.sorte) {
			case Sorte.COEUR: {
				return "coeur.png";
			}
			case Sorte.PIQUE: {
				return "pique.png";
			}
			case Sorte.CARREAU: {
				return "carreau.png";
			}
			case Sorte.TREFLE: {
				return "trefle.png";
			}
			case Sorte.JOKER: {
				return "joker.png";
			}
			case Sorte.BLANCHE: {
				return "blanche.png";
			}
			default: {
				return "blanche.png";
			}
		}
	}

	public setPoints() {
		this.points = 0;
		if (this.symbole === Symbole.DIX) {
			this.points = 10;
		} else if (this.symbole === Symbole.ROI) {
			this.points = 25;
		}
	}

	public getCouleur(): Couleur {
		return this.sorte === Sorte.COEUR || this.sorte === Sorte.CARREAU || this.sorte === Sorte.JOKER
			? Couleur.ROUGE
			: Couleur.NOIR;
	}

	public setFromPoids(poids: number, sorte: Sorte) {
		this.poids = poids;
		this.sorte = sorte;
		this.symbole = (poids - 7) as Symbole;
		this.rang = sorte * 8 + poids - 7;
		this.key = `${this.symbole}|${sorte}`;
		this.couleur = this.getCouleur();
		this.image = this.getImage();
		this.setPoints();
	}

	public isAtout(atout: Sorte) {
		if (atout === Sorte.SANS_ATOUT) {
			return false;
		}
		return this.sorte === Sorte.BLANCHE || this.sorte === Sorte.JOKER || this.sorte === atout;
	}

	public isSorteDemandee(sorteDemandee: Sorte, atout: Sorte) {
		if (sorteDemandee === this.sorte) {
			return true;
		}
		if (sorteDemandee === atout && this.isAtout(atout)) {
			return true;
		}
		return false;
	}

	public isDisabled(cartes: Carte[], sorteDemandee: Sorte, atout: Sorte) {
		if (this.isSorteDemandee(sorteDemandee, atout)) {
			return false;
		}

		const idx = cartes.findIndex((i) => i.isSorteDemandee(sorteDemandee, atout));
		if (idx === -1) {
			return false;
		}
		return true;
	}

	public isSeche(cartes: Carte[], atout: Sorte) {
		// Cherche même sorte
		const memeSorte = cartes.find((c) => c.sorte === this.sorte && c.symbole !== this.symbole);
		if (memeSorte !== undefined) {
			// Si trouvé, carte pas sèche
			return false;
		}
		// Si carte d'atout, cherche bibittes
		if (this.isAtout(atout)) {
			const bibittes = cartes.filter((c) => c.poids > 14);
			if (bibittes.length > 0) {
				// Si trouvées, carte pas sèche
				return false;
			}
		}
		// Carte sèche
		return true;
	}

	public isChien(atout: Sorte, dixPasse: boolean) {
		if (this.sorte === atout) {
			return false;
		}
		if (this.points !== 0) {
			return false;
		}
		if (this.poids < 10) {
			return true;
		}
		if ((this.symbole === Symbole.JACK || this.symbole === Symbole.DAME) && dixPasse) {
			return true;
		}
		if (this.poids > 14 && atout === Sorte.SANS_ATOUT) {
			return true;
		}
		return false;
	}

	public isBlanche() {
		return this.sorte === Sorte.BLANCHE;
	}

	public isJoker() {
		return this.sorte === Sorte.JOKER;
	}

	public isBibitte() {
		return this.isJoker() || this.isBlanche();
	}

	public setJoker() {
		this.setFromPoids(15, Sorte.JOKER);
	}

	public setBlanche() {
		this.setFromPoids(16, Sorte.BLANCHE);
	}
}
