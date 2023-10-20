import { outputError } from "../utils/generalUtil";
import { Joueur } from "./Joueur";
import { Mise } from "./Mise";
import { Paquet } from "./Paquet";

export class Brasse {
	constructor(public idx: number, public brasseur: Joueur, points: number[]) {
		this.points = [0, 0];
		this.points[0] += points[0];
		this.points[1] += points[1];
	}
	public points: number[];
	public done: boolean = false;
}

export class Partie {
	constructor(public paquet: Paquet) {
		this.paquet = paquet;
		this.paquet.brasser(paquet.avecQuettee);
		this.brasses = [new Brasse(0, this.paquet.joueur1, [0, 0])];
	}
	public brasses: Brasse[];

	public nextBrasse(points: number[], mise: Mise) {
		const brasseCourante = this.brasses[this.brasses.length - 1];
		const equipeMise = mise.joueur.equipeIdx;
		const autreEquipe = equipeMise === 0 ? 1 : 0;

		if (points[equipeMise] >= mise.montant) {
			if (mise.montant === 150) {
				brasseCourante.points[equipeMise] += 500;
			} else {
				brasseCourante.points[equipeMise] += points[equipeMise];
			}
		} else {
			brasseCourante.points[equipeMise] -= mise.montant;
		}
		brasseCourante.points[autreEquipe] += points[autreEquipe];
		brasseCourante.done = true;

		const nouveauBrasseur = this.paquet.getNextJoueur(brasseCourante.brasseur);
		if (!nouveauBrasseur) return outputError("Pas de nouveau brasseur!");
		this.brasses.push(new Brasse(this.brasses.length, nouveauBrasseur, brasseCourante.points));
	}
}
