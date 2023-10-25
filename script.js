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
  
  const buttonOn = document.querySelector('.js-card-button-on')
  const buttonOff = document.querySelector('.js-card-button-off')
    buttonOn.classList.remove("display-none") // Ré-initialise le comportement par défaut au cas où un mot serait soumis sans rafraîchissement de la page
    buttonOff.classList.add("display-none") // Ré-initialise le comportement par défaut au cas où un mot serait soumis sans rafraîchissement de la page
  
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

      const card = document.querySelector(".js-card-hidden")
      card.classList.remove("card-hidden")

      renderToHTML(informationsNeeded)



    })
    .catch((error) => {
      const notFound = document.querySelector(".js-dialog")
      notFound.classList.remove("display-dialog")
      const buttonDialog = document.querySelector(".js-button-dialog")
      buttonDialog.addEventListener("click", () => {
        location.reload()
      })
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
  list.innerHTML = "" // PERMET DE NETTOYER LA LISTE DE LA REQUETE PRECEDENTE (PERMET DE TOUT VIDER avant d'AFFICHER LA NOUVELLE REQUETE)
  for(let i = 0; i < data.meanings.length; i++) {
    const meaning = data.meanings[i]
    const partOfSpeech = meaning.partOfSpeech
    const definition = meaning.definitions[0].definition
    
    /*1 - Avec un innerHTML : la lisibilité peut être mauvaise qd on a de gros blocs

    list.innerHTML += `
    <li class="flex">
      <p class="partOfSpeech">${partOfSpeech}</p>
      <p class="definition">${definition}</p>
    </li>`

      2- Avec la création d'éléments : voir ci-dessous
    */

      const li = document.createElement('li')
      li.classList.add("flex")
      const pPartOfSpeech = document.createElement('p')
      pPartOfSpeech.textContent = partOfSpeech
      pPartOfSpeech.classList.add("partOfSpeech")
      const pDefinition = document.createElement('p')
      pDefinition.textContent = definition
      pDefinition.classList.add("definition")

      li.appendChild(pPartOfSpeech)
      li.appendChild(pDefinition)
      list.appendChild(li)
  }

// ETAPE 5 : RAJOUT DE L'AUDIO

  const buttonOn = document.querySelector('.js-card-button-on')
  const buttonOff = document.querySelector('.js-card-button-off')

  let audio = new Audio(data.pronun)
  buttonOn.addEventListener('click', () => {
  buttonOn.classList.add("display-none")
  buttonOff.classList.remove("display-none")
    audio.play()

  })

  buttonOff.addEventListener("click", () => {
    buttonOn.classList.remove("display-none")
    buttonOff.classList.add("display-none")

    audio.addEventListener('ended', () => {
      audio = new Audio("")
      audio.play()
    })

    })

}

//LANCEMENT DU PROGRAMME
watchSubmit()


const refresh = document.querySelector(".js-refresh")
refresh.addEventListener("click", () => {
  location.reload()
})

