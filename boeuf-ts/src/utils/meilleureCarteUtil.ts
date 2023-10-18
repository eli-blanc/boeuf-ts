import { Carte, Sorte, Symbole } from "../models/Carte";

export function piger(cartes: Carte[], contrainte?: "min" | "max"): Carte {
	if (cartes.length === 1) {
		return cartes[0];
	}
	let choix = [];
	switch (contrainte) {
		case "min": {
			const minVal = Math.min(...cartes.map((c) => c.poids));
			choix = cartes.filter((c) => c.poids === minVal);
			break;
		}
		case "max": {
			const minVal = Math.max(...cartes.map((c) => c.poids));
			choix = cartes.filter((c) => c.poids === minVal);
			break;
		}
		default: {
			choix = cartes;
			break;
		}
	}
	const idx = Math.floor(Math.random() * choix.length);
	return cartes[idx];
}

export function getMeilleurChien(mesCartes: Carte[], atout: Sorte, pile: Carte[]) {
	let chiens = mesCartes.filter((c) => c.isChien(atout, true));

	let ratios: any = [];
	if (chiens.length > 0) {
		// Priorise les chiens qui ont le meilleur ratio chien/point
		for (let chien of chiens) {
			const pointsSorte = mesCartes.filter((c) => c.sorte === chien.sorte && c.points > 0);
			let totPoints = 0;
			for (let p of pointsSorte) {
				const maitre = isCarteMaitre(p, mesCartes, pile, atout);
				if (!maitre) totPoints += p.points;
			}
			const chiensSorte = chiens.filter((c) => c.sorte === chien.sorte);
			const ratio = totPoints / Number(chiensSorte.length);
			ratios.push(new ChienInfo(chien, ratio));
		}
		const minRatio = Math.min(...ratios.map((r: any) => r.ratio));
		const chiensMinRatio = ratios.filter((r: any) => r.ratio === minRatio);
		return piger(
			chiensMinRatio.map((c: any) => c.chien),
			"min"
		);
	}
	return null;
}

/**
 * Teste si la carte est maître
 * @param carte: carte à tester
 */
export function isCarteMaitre(carte: Carte, mesCartes: Carte[], pile: Carte[], atout: Sorte) {
	let cartesMeilleures = [];
	for (let i = carte.poids + 1; i <= 14; ++i) {
		const c = new Carte();
		c.setFromPoids(i, carte.sorte);
		cartesMeilleures.push(c);
	}
	if (carte.isAtout(atout)) {
		if (!carte.isBlanche()) {
			const c1 = new Carte();
			c1.setBlanche();
			cartesMeilleures.push(c1);
			if (!carte.isJoker()) {
				const c2 = new Carte();
				c2.setJoker();
				cartesMeilleures.push(c2);
			}
		}
	}
	for (let mCarte of cartesMeilleures) {
		const cPile = pile.find((c) => c.key === mCarte.key);
		const cMoi = mesCartes.find((c) => c.key === mCarte.key);
		if (cPile === undefined && cMoi === undefined) {
			return false;
		}
	}
	return true;
}

class AsInfo {
	constructor(public as: Carte) {}
	public beu: Carte | null = null;
	public nSorte: number = 0;
}

class ChienInfo {
	constructor(public chien: Carte, public ratio: any) {}
}

export function getMain1Carte1(mesCartes: Carte[], atout: Sorte, pile: Carte[]) {
	const cartesAs = mesCartes.filter((c) => c.symbole === Symbole.AS);
	const cartesBeu = mesCartes.filter((c) => c.symbole === Symbole.ROI);

	// Cherche une pair beu-as (pas d'atout)
	const asInfos = [];
	for (let as of cartesAs) {
		if (!as.isAtout(atout)) {
			const asInfo = new AsInfo(as);
			const beuMemeSorte = cartesBeu.find((c) => c.sorte === as.sorte);
			if (beuMemeSorte !== undefined) {
				asInfo.beu = beuMemeSorte;
			}
			asInfo.nSorte = mesCartes.filter((c) => c.sorte === as.sorte).length;
			asInfos.push(asInfo);
		}
	}
	if (asInfos.length > 0) {
		const avecBeu = asInfos.filter((as) => as.beu !== null);
		if (avecBeu.length > 0) {
			// Joue le beu accoté par un as qui a le plus faible nombre de cartes de cette sorte
			const nMin = Math.min(...avecBeu.map((as) => as.nSorte));
			const avecBeuMin = avecBeu.filter((as) => as.nSorte === nMin);
			const beus: Carte[] = [];
			for (let b of avecBeuMin) {
				if (b.beu) beus.push(b.beu);
			}
			return piger(beus);
		}
		// Joue l'as qui a le plus faible nombre de cartes de cette sorte
		const nMin = Math.min(...asInfos.map((as) => as.nSorte));
		const asMin = asInfos.filter((as) => as.nSorte === nMin);
		return piger(asMin.map((as) => as.as));
	}

	// Cherche une carte sèche (sauf atout)
	const cartesSeches = getCartesSeches(mesCartes, atout);
	const chienSec = getChienSec(cartesSeches, atout);
	if (chienSec !== null) {
		// Priorise chien
		return chienSec;
	}
	const pointSec = getPointSec(cartesSeches, 10);
	if (pointSec !== null) {
		// Priorise 10, ensuite beu
		return pointSec;
	}

	// Cherche un chien
	const chien = getMeilleurChien(mesCartes, atout, pile);
	if (chien !== null) {
		return chien;
	}

	// Joue un 10 qui n'est pas de l'atout
	const dix = mesCartes.filter((c) => c.poids === 10 && !c.isAtout(atout));
	if (dix.length > 0) {
		return piger(dix);
	}

	// À ce stade-ci, il ne reste que de l'atout, jouer la plus forte
	return mesCartes[mesCartes.length - 1];
}

export function getCartesSeches(mesCartes: Carte[], atout: Sorte) {
	return mesCartes.filter((c) => c.isSeche(mesCartes, atout) && !c.isAtout(atout));
}

export function getChienSec(cartesSeches: Carte[], atout: Sorte) {
	const chiensSecs = cartesSeches.filter((c) => c.isChien(atout, true));
	if (chiensSecs.length > 0) {
		// Priorise les chiens
		return piger(chiensSecs, "min");
	}
	return null;
}

export function getDixSec(cartesSeches: Carte[]) {
	const dixSecs = cartesSeches.filter((c) => c.poids === 10);
	if (dixSecs.length > 0) {
		// Priorise 10
		return piger(dixSecs);
	}
	return null;
}

export function getBeuSec(cartesSeches: Carte[]) {
	const beuxSecs = cartesSeches.filter((c) => c.symbole === Symbole.ROI);
	if (beuxSecs.length > 0) {
		// Priorise beu
		return piger(beuxSecs);
	}
	return null;
}

export function getPointSec(cartesSeches: Carte[], priorite: number) {
	const beuSec = getBeuSec(cartesSeches);
	const dixSec = getDixSec(cartesSeches);

	if (beuSec !== null && (priorite === 13 || dixSec === null)) {
		return beuSec;
	}

	if (dixSec !== null) {
		return dixSec;
	}
	return null;
}
