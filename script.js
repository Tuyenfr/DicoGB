/* MON PROGRAMME : donner la définition d'un mot anglais

1) Récupérer le mot saisi
2) Envoyer le mot à l'API (https://api.dictionaryapi.dev/api/v2/entries/en/<word>)
3) Récupérer le JSON (la donnée) en lien avec le mot
4) Afficher les informations du mot sur ma page HTML
5) Ajouter un lecteur pour écouter la prononciation du mot */

//ETAPE 1 : RECUPERER MON MOT

const form = document.querySelector("#form")
form.addEventListener("submit", (event) => {
  event.preventDefault() // annule le comportement par défaut à savoir rediriger la donnée du formulaire, du coup garde le mot sur la page au lieu de l'effacer
  const data = new FormData(form) // mettre name="search" et value="" dans l'input du fichier index.html
  const search = data.get("search")
  console.log(search)
})