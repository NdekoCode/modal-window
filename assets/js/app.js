/**
 * Permettra de savoir quelle est la boite modal qui est actuellement ouverte
 * @type {HTMLElement} modal 
 */
let modal = null;

/** @type {String} Contient tous les elements HTML qui peuvent etre cibler par la Tabulation  */
const focusableSelector = "a, input, button, textarea , select, iframe, *[tabindex]";

/** @type {Array<HTMLElement>} Va contenir les element Pouvant etre cibler par la tabulation lors de l'appel des fonction openModal, focusInModal*/
let focusElements = [];

/**
 * Va etre l'element qui a le focus au avant qu'on ouvre la fenetre Modale
 */
let previouslyFocusedElement = null;


/**
 * @description Permet d'ouvrir une boite modal au click sur le lien d'ouverture
 * @author NdekoCode
 * @param {PointerEvent} evt
 */
const openModal = async function (evt) {
  evt.preventDefault();
  // On recupère aussi l'ancre à fin de trouver l'element qui est cible comme Modal
  // On sauvegarde la boite modal qu'on vient d'ouvrir
  const target = evt.target.getAttribute('href');
  if(target.startsWith('#')) {
    modal = document.querySelector(target);
  }else {
    // On attend le chargement de la modal avant de continuer
    modal = await loadModal(target);
  }
  // On recupere dans le DOM l'element qui a le focus de la tabulation avant l'ouverture de la fenetre modal
  previouslyFocusedElement = document.querySelector(':focus');
  // On recupère tous les elements focussable à la tabulation sous forme des tableaux
  focusElements = Array.from(modal.querySelectorAll(focusableSelector));
  // On met le display du modal à visible
  modal.style.display = null;
  // On met les focus apres le display car le display:none n'accepte pas le focus
  focusElements[0].focus();
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', true);

  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(evt);
  })
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
  modal.removeEventListener('animationend',hiddenModal)
}



/**
 * Permet de fermer une boite modal
 *
 * @param {PointerEvent} evt
 */
const closeModal = function (evt) {
  evt.preventDefault();
  if (modal === null) return
  // On verifie si le previouslyFocusedElement n'est pas vide si il n'est pas vide on lui redonne le focus
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  /** Animation-reverse
  // On demande au navigateur de redessinner pendant un petit moment pour que l'on puisse jouer l'animation `animation-reversse` dans le modal de nouveau
  modal.style.display='none';
  // On demande au navigateur de faire un repaint
  modal.offsetWidth;
  modal.style.display = null; //Ainsi on utilise la meme animation pour l'ouverture et la fermeture du Modal et on economise ainsi du code CSS
    */
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
  // Et à la fin de l'animation on lui demande encore de remettre les display 'none' et le modal à null
  console.log("BUm");
  // Pour eviter le risque d'accumuler le meme evenement plein de fois, la meilleur astuce est de creer une fonction qui fait ceux dont on a besoin
  // Ainsi on l'appel au fermeture mais on le supprime à l'ouverture
  modal.addEventListener('animationend', hiddenModal);

}

/**
 * Permet de cacher la fenetre modal et ainsi eviter que l'evenement `animationend` ne puisse se repeter
 */
const hiddenModal = function () {
  modal.style.display = 'none';
  modal = null;
}

/**
 * @description  Permettra de charger une fenetre modal en AJAX
 * @author NdekoCode
 * @param {String} url L'URL que je souhaite charger
 */
const loadModal = async function (url) {
  // TODO : Ajouter Un loader en Attendant que le contenus se charger
  const target = `#${url.split('#')[1]}`;
  const existingModal = document.querySelector(target);
  console.log(existingModal);
  // On verifie si on a pas déjà de Modal dans le DOM si on l'a deja on le charge sinon on en part charger un nouveau
  if(existingModal !== null) return existingModal;
  console.log(existingModal);
  // On attend que le fetch aie été resolus et on va recuperer que du Texte sous forme HTML mais sans fondement HTML
  const html = await fetch(url).then(res => res.text());
  // On convertis ce texte sans fondement en un Texte fragmenter en vrais HTMTL ce qui va nous donner une sorte de nouveau DOM bidon
  const element = document.createRange().createContextualFragment(html);
  // On fait querySelector sur ce nouveau document pour obtenir notre modal en question
  const modal = element.querySelector(target);
  // Si l'element n'est pas trouver on emmet une exception
  if(modal === null || modal == undefined) throw new Error(`L'element ${target} n'est pas trouver dans la page ${url}`)
  // On ajoute à notre body le modal recuperer en AJAX
  document.body.append(modal);

  return modal;
}

/**
 * Permet d'empecher la propagation des evenement vers les parents
 *
 * @param {Event} evt
 */
const stopPropagation = function (evt) {
  evt.stopPropagation();
}

/**
 * Permet d'enfermer le focus de la tabulation dans la fenetre modal
 *
 * @param {Event} evt
 */
const focusInModal = function (evt) {
  evt.preventDefault();
  // Quand j'ouvre la boite modal je veux trouver tous les elements qui sont focusable à l'interieur de la boite modal et les sauvegarder
  // On recupère l'index de l'element qui est focusable
  let index = focusElements.findIndex((f) => f == modal.querySelector(':focus'));
  if (evt.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index < 0) {
    index = focusElements.length - 1;
  }

  // On verifie si l'index est superieur à la taille des elements focusable
  if (index >= focusElements.length) {
    // Si on est dans le dernier element il va falloir revenir à zero
    index = 0;

  }
  // On met le focus sur l'element correspond à l'index de la tabulation
  focusElements[index].focus();

}
// On cible tous les liens pouvant ouvrir une boite modal et on y rattache un evenement au click
document.querySelectorAll('.js-modal').forEach(link => {
  link.addEventListener('click', openModal)
})

window.addEventListener('keydown', function (evt) {
  if (evt.key === 'Escape' || evt.key === "Esc") {
    closeModal(evt);
  }
  if (evt.key === 'Tab' && modal !== null) {
    focusInModal(evt);
  }
})
