import { Carte, Sorte } from "./Carte";

export class RefuseSorte {
	constructor(public sorte: Sorte) {}
	// True si a déjà refusé
	public refuse = false;
}

export class Joueur {
	constructor(public nom: string = "", public index: number = 0) {
		this.actif = false;
		this.equipeIdx = this.index % 2;
		this.refuseSorte = [
			new RefuseSorte(Sorte.COEUR),
			new RefuseSorte(Sorte.PIQUE),
			new RefuseSorte(Sorte.CARREAU),
			new RefuseSorte(Sorte.TREFLE),
		];
	}
	public cartes: Carte[] = [];
	public actif: boolean = false;
	public equipeIdx: number;
	public refuseSorte: RefuseSorte[];

	public getNom() {
		return this.nom;
	}

	public getIndex() {
		return this.index;
	}

	public setCartes(cartes: Carte[]) {
		this.cartes = cartes;
	}

	public getCartes() {
		return this.cartes;
	}

	public getRefuseSorte(sorte: Sorte) {
		const item = this.refuseSorte.find((i) => i.sorte === sorte);
		if (item !== undefined) {
			return item.refuse;
		}
	}

	public setRefuseSorte(sorteDemandee: Sorte | undefined, carte: Carte, atout: Sorte) {
		let sorte = carte.sorte;
		if (carte.isAtout(atout)) {
			sorte = atout;
		}
		if (sorte !== sorteDemandee) {
			const item = this.refuseSorte.find((i) => i.sorte === sorteDemandee);
			if (item !== undefined) {
				item.refuse = true;
			}
		}
	}

	public resetRefuseSorte() {
		for (let sorte of this.refuseSorte) {
			sorte.refuse = false;
		}
	}

	public compteSorte(sorte: Sorte, atout: Sorte) {
		let cartesSorte = this.cartes.filter((c) => c.sorte === sorte);
		if (atout !== Sorte.SANS_ATOUT) {
			const bibittes = this.cartes.filter((c) => c.sorte === Sorte.JOKER || c.sorte === Sorte.BLANCHE);
			cartesSorte = cartesSorte.concat(bibittes);
		}
		return cartesSorte.length;
	}
}
