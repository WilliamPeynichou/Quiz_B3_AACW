//import le css associé à la page
import "./RankingPage.css";
import { useMemo, useState } from "react";

export function RankingPage() {
  return <main><h1>Classement</h1></main>
}

// Données d'exemple : remplacez-les par vos propres données (API, props, etc.)
const DONNEES = {
  semaine: [
    { id: 1, nom: "Camille Durand", score: 1280, evolution: 2 },
    { id: 2, nom: "Lucas Martin", score: 1195, evolution: -1 },
    { id: 3, nom: "Inès Bernard", score: 1195, evolution: 0 },
    { id: 4, nom: "Hugo Petit", score: 980, evolution: 3 },
    { id: 5, nom: "Léa Moreau", score: 940, evolution: -2 },
    { id: 6, nom: "Nathan Roux", score: 815, evolution: 1 },
    { id: 7, nom: "Manon Girard", score: 760, evolution: 0 },
    { id: 8, nom: "Tom Lambert", score: 590, evolution: -3 },
  ],
  mois: [
    { id: 1, nom: "Lucas Martin", score: 5120, evolution: 1 },
    { id: 2, nom: "Camille Durand", score: 4980, evolution: -1 },
    { id: 3, nom: "Léa Moreau", score: 4310, evolution: 2 },
    { id: 4, nom: "Inès Bernard", score: 4105, evolution: 0 },
    { id: 5, nom: "Hugo Petit", score: 3720, evolution: -1 },
    { id: 6, nom: "Manon Girard", score: 3400, evolution: 4 },
    { id: 7, nom: "Nathan Roux", score: 2990, evolution: -2 },
    { id: 8, nom: "Tom Lambert", score: 2450, evolution: 0 },
  ],
};

const PERIODES = [
  { cle: "semaine", libelle: "Cette semaine" },
  { cle: "mois", libelle: "Ce mois-ci" },
];

const MEDAILLES = {
  1: { fond: "#F2C94C", texte: "#4A3A00" },
  2: { fond: "#C9D1DB", texte: "#2C3744" },
  3: { fond: "#D99B6C", texte: "#4A2A10" },
};

const initiales = (nom) =>
  nom
    .split(" ")
    .map((m) => m[0])
    .join("")
    .slice(0, 2);

function Evolution({ valeur }) {
  if (valeur === 0)
    return <span className="evo evo-stable" aria-label="Stable">–</span>;
  const monte = valeur > 0;
  return (
    <span
      className={`evo ${monte ? "evo-up" : "evo-down"}`}
      aria-label={`${monte ? "Monte" : "Descend"} de ${Math.abs(valeur)} place(s)`}
    >
      {monte ? "▲" : "▼"} {Math.abs(valeur)}
    </span>
  );
}

export default function Classement({ donnees = DONNEES }) {
  const [periode, setPeriode] = useState("semaine");
  const [recherche, setRecherche] = useState("");

  // Tri par score + calcul du rang (les ex æquo partagent le même rang)
  const classement = useMemo(() => {
    const tries = [...donnees[periode]].sort((a, b) => b.score - a.score);
    let rangPrecedent = 0;
    return tries.map((joueur, i) => {
      const rang =
        i > 0 && joueur.score === tries[i - 1].score ? rangPrecedent : i + 1;
      rangPrecedent = rang;
      return { ...joueur, rang };
    });
  }, [donnees, periode]);

  const scoreMax = classement[0]?.score || 1;

  const affiches = classement.filter((j) =>
    j.nom.toLowerCase().includes(recherche.trim().toLowerCase())
  );

  return (
    <div className="cl">
      <style>{CSS}</style>

      <header className="cl-entete">
        <h1>Classement</h1>
        <div className="cl-onglets" role="tablist">
          {PERIODES.map((p) => (
            <button
              key={p.cle}
              role="tab"
              aria-selected={periode === p.cle}
              className={periode === p.cle ? "actif" : ""}
              onClick={() => setPeriode(p.cle)}
            >
              {p.libelle}
            </button>
          ))}
        </div>
      </header>

      <input
        className="cl-recherche"
        type="search"
        placeholder="Rechercher un joueur"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        aria-label="Rechercher un joueur"
      />

      {affiches.length === 0 ? (
        <p className="cl-vide">Aucun joueur ne correspond à « {recherche} ».</p>
      ) : (
        <ol className="cl-liste">
          {affiches.map((j) => {
            const medaille = MEDAILLES[j.rang];
            return (
              <li key={j.id} className={`cl-ligne ${medaille ? "podium" : ""}`}>
                <span
                  className="cl-rang"
                  style={
                    medaille
                      ? { background: medaille.fond, color: medaille.texte }
                      : undefined
                  }
                >
                  {j.rang}
                </span>

                <span className="cl-avatar" aria-hidden="true">
                  {initiales(j.nom)}
                </span>

                <div className="cl-centre">
                  <span className="cl-nom">{j.nom}</span>
                  <span className="cl-barre">
                    <span
                      style={{ width: `${(j.score / scoreMax) * 100}%` }}
                    />
                  </span>
                </div>

                <span className="cl-score">
                  {j.score.toLocaleString("fr-FR")}
                  <small> pts</small>
                </span>
                <Evolution valeur={j.evolution} />
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
;
