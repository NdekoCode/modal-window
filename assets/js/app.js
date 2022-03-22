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
 *Permet d'ouvrir une boite modal au click sur le lien d'ouverture
 * @param {PointerEvent} evt
 */
const openModal = function (evt) {
  evt.preventDefault();
  // On recupère aussi l'ancre à fin de trouver l'element qui est cible comme Modal
  // On sauvegarde la boite modal qu'on vient d'ouvrir
  modal = document.querySelector(evt.target.getAttribute('href'));
  // On recupere dans le DOM l'element qui a le focus de la tabulation avant l'ouverture de la fenetre modal
  previouslyFocusedElement = document.querySelector(':focus');
  // On les recupère sous forme des tableaux
  focusElements = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  // On met les focus apres le display car le display:none n'accepte pas le focus
  focusElements[0].focus();
  console.log(focusElements[0].focus());
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal', true);

  modal.addEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(evt);
  })
  modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
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
  if (previouslyFocusedElement !== null) {
    previouslyFocusedElement.focus();
  }
  window.setTimeout(function () {

    modal.style.display = 'none';
    modal = null;

  }, 400);
  modal.setAttribute('aria-hidden', 'true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

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
