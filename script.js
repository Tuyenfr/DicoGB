/* MON PROGRAMME : donner la définition d'un mot anglais

1) Récupérer le mot saisi
2) Envoyer le mot à l'API (https://api.dictionaryapi.dev/api/v2/entries/en/<word>)
3) Récupérer le JSON (la donnée) en lien avec le mot
4) Afficher les informations du mot sur ma page HTML
5) Ajouter un lecteur pour écouter la prononciation du mot */

let wordToSearch = ""

//ETAPE 1 : RECUPERER MON MOT

const watchSubmit = () => {

const form = document.querySelector("#form") // définition de l'étape 1 mais on la lance en bas du programme

form.addEventListener("submit", (event) => {
  event.preventDefault() // annule le comportement par défaut à savoir rediriger la donnée du formulaire, du coup garde le mot sur la page au lieu de l'effacer
  const data = new FormData(form) // mettre name="search" et value="" dans l'input du fichier index.html
  const wordToSearch = data.get("search")
  apiCall(wordToSearch) // lancer le fetch de l'étape 2 définie après

})
}

// ETAPE 2 : Envoyer le mot à l'API (requête Fetch asynchrone avec then)

const apiCall = (word) => {
  console.log("wordToSearch :", word)
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) // Pour concaténer string + interpolation utiliser les ``)
    .then((Response) => Response.json())
    .then((data) => {

      // ETAPE 3 : récupérer la donnée
      console.log(data)
      const wordInformation = data[0]
      console.log("Mot : ", wordInformation.word)
    })
}


//LANCEMENT DU PROGRAMME
watchSubmit()