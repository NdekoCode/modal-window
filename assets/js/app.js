/**
  * Permettra de savoir quelle est la boite modal qui est actuellement ouverte
  * @type {HTMLElement} modal 
  */
let modal = null;

/** @type {String} Contient tous les elements HTML qui peuvent etre cibler par la Tabulation  */
const focusableSelector ="a, input, button, textarea , select, iframe, *[tabindex]";

/** @type {Array<HTMLElement>} Va contenir les element Pouvant etre cibler par la tabulation lors de l'appel de la fonction focusInModal*/
let focusables = [];


/**
 *Permet d'ouvrir une boite modal au click sur le lien d'ouverture
 * @param {PointerEvent} evt
 */
const openModal = function (evt) {
  console.log(evt);
  evt.preventDefault();
  // On recupère aussi l'ancre à fin de trouver l'element qui est cible comme Modal
  const modal = document.querySelector(evt.target.getAttribute('href'));
  modal.style.display= null;
  modal.removeAttribute('aria-hidden');
  modal.setAttribute('aria-modal',true);

  // On sauvegarde la boite modal qu'on vient d'ouvrir
  modal = target;
  modal.addEventListener('click',closeModal);
  modal.querySelector('.js-modal-close').addEventListener('click', function (evt) {
    evt.preventDefault();
    closeModal(evt); 
  })
  modal.querySelector('.js-modal-stop').addEventListener('click',stopPropagation);
}

/**
 * Permet de fermer une boite modal
 *
 * @param {PointerEvent} evt
 */
const closeModal = function (evt) {
  evt.preventDefault();
  if (modal === null) return
  modal.style.display ='none';
  modal.setAttribute('aria-hidden','true');
  modal.removeAttribute('aria-modal');
  modal.removeEventListener('click', closeModal);
  modal.querySelector('.js-modal-close').removeEventListener('click',closeModal);
  modal.querySelector('.js-modal-stop').removeEventListener('click',stopPropagation);
  modal = null;

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
  // Quand j'ouvre la boite modal je veux trouver tous les elements qui sont focusable à l'interieur de la boite modal et les sauvegarder

}
// On cible tous les liens pouvant ouvrir une boite modal et on y rattache un evenement au click
document.querySelectorAll('.js-modal').forEach(link => {
 link.addEventListener('click', openModal) 
})

window.addEventListener('keydown', function (evt) {
  if(evt.key ==='Escape' || evt.key === "Esc") {
    closeModal(evt);
  }
  
  if (evt.key === 'Tab' && modal !== null) {
    focusInModal(evt);
  }
})
