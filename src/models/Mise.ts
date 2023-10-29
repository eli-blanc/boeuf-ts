import i18next from "i18next";
import { getSorteStr, Sorte } from "./Carte";
import { Joueur } from "./Joueur";

export enum Montant {
	NOMBRE = 0,
	PETITE = 1,
	GROSSE = 2,
}

export class Mise {
	constructor(
		public joueur: Joueur,
		public montant: number = 60,
		public atout: Sorte = Sorte.PIQUE,
		public petite: boolean = false
	) {
		this.atoutStr = getSorteStr(this.atout);
	}
	public atoutStr: string;

	public getStr(): string {
		let montantStr = `${this.montant}`;
		if (this.montant === 150) {
			montantStr = i18next.t(`gage.type.${this.petite ? Montant.PETITE : Montant.GROSSE}`);
		}
		if (this.atout === Sorte.SANS_ATOUT) {
			return i18next.t("gage.messageSansAtout", { joueur: this.joueur.nom, quoi: montantStr });
		}
		let atoutStr = i18next.t(`sortes.${Object.keys(this.atout)}`);
		return i18next.t("gage.message", { joueur: this.joueur.nom, quoi: montantStr, atout: atoutStr });
	}
}
