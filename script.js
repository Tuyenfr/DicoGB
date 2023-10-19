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
  //console.log("wordToSearch :", word)
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) // Pour concaténer une string + une interpolation utiliser les ``)
    .then((Response) => Response.json())
    .then((data) => {

      // ETAPE 3 : récupérer la donnée
      
      //const wordInformations = data[0]
      //console.log(wordInformations)
      // console.log("Mot : ", wordInformation.word) // Attention : ce "word" est le premier élément renvoyé par l'API
      //console.log("Mot:", wordInformations) // // permet de voir dans la console les données du mot saisi

      const informationsNeeded = extractData(data[0])
      renderToHTML(informationsNeeded)

    })
    .catch((error) => {
      alert("Le mot demandé n'existe pas")
      console.error(error)
    })
}

const extractData = (data) => {

      //1. Mot
      const word = data.word
        
      //2. Ecriture phonétique
      const phonetic = findProp(data.phonetics, "text") // voir fonction findProp ci-dessous
      //console.log("phonetic trouvée:",phonetic)

      //3. Prononciation
      const pronun = findProp(data.phonetics, "audio") // voir fonction findProp ci-dessous
      //console.log("pronoun :", pronun)

      //4. Définitions
      const meanings = data.meanings
      //console.log("meaning :",meanings)

      return {
        word: word,
        phonetic: phonetic,
        pronun: pronun,
        meanings: meanings
      }

}

const findProp = (array, name) => {
  //La fonction parcourt un tableau d'objets et cherche si l'objet en cours contient une certaine propriété
  //alors elle renvoit cette propriété
  for (let i = 0; i < array.length; i++) {
    const currentObject = array[i]
    const hasProp = currentObject.hasOwnProperty(name)
    console.log("Value to return :", currentObject[name])
    //if (hasProp) console.log("props :", hasProp)
    if (hasProp) return currentObject[name]

  }
}

// ETAPE 4 : Afficher les informations sur la page HTML
const renderToHTML = (data) => {
  const title = document.querySelector(".js-card-title")
  title.textContent = data.word
  const phonetic = document.querySelector(".js-card-phonetic")
  phonetic.textContent = data.phonetic
  const list = document.querySelector(".js-card-list")
  for(let i = 0; i < data.meanings.length; i++) {
    const meaning = data.meanings[i]
    const partOfSpeech = meaning.partOfSpeech
    const definition = meaning.definitions[0].definition
    
    /* 
    1 - Avec un innerHTML
    list.innerHTML += `
    <li class="flex">
      <p class="partOfSpeech">${partOfSpeech}</p>
      <p class="definition">${definition}</p>
    </li>`

    2- Avec la création d'éléments
    */

  
    
  
  }
}

//LANCEMENT DU PROGRAMME
watchSubmit()