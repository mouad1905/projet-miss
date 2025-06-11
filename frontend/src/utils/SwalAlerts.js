import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'; // Importe les styles par défaut

// --- Configuration du Toast ---
// Nous créons une instance pré-configurée pour les notifications
// qui sont petites, apparaissent dans un coin et disparaissent toutes seules.
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end', // Position en haut à droite de l'écran
  showConfirmButton: false, // Pas de bouton "OK"
  timer: 3000, // Disparaît automatiquement après 3 secondes (3000 ms)
  timerProgressBar: true, // Affiche une petite barre de progression du temps
  didOpen: (toast) => {
    // Met en pause le timer si la souris est sur le toast
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

/**
 * Affiche une notification de succès de type "toast".
 * @param {string} title - Le message à afficher (ex: "Ajouté avec succès!").
 */
export const showSuccessToast = (title = 'Opération réussie!') => {
  Toast.fire({
    icon: 'success',
    title: title
  });
};

/**
 * Affiche une alerte d'erreur standard (une modale avec un bouton "OK").
 * @param {string} text - Le message d'erreur détaillé à afficher.
 * @param {string} title - Le titre de l'alerte (par défaut "Erreur!").
 */
export const showErrorAlert = (text = 'Une erreur est survenue.', title = 'Erreur!') => {
  Swal.fire({
    icon: 'error',
    title: title,
    text: text,
  });
};

/**
 * Affiche un dialogue de confirmation pour les actions sensibles (ex: suppression).
 * @param {object} options - Un objet contenant les options pour le dialogue.
 * @param {string} [options.title='Êtes-vous sûr?'] - Le titre de la confirmation.
 * @param {string} options.text - Le texte explicatif (ex: "Cette action est irréversible!").
 * @param {string} [options.confirmButtonText='Oui, continuer!'] - Le texte pour le bouton de confirmation.
 * @returns {Promise<import('sweetalert2').SweetAlertResult>} - Une promesse qui se résout avec le résultat du dialogue (l'utilisateur a-t-il cliqué sur "confirmer" ou "annuler"?).
 */
export const showConfirmDialog = ({ title = 'Êtes-vous sûr?', text, confirmButtonText = 'Oui, continuer!' }) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6', // Couleur bleue pour confirmer
    cancelButtonColor: '#d33',   // Couleur rouge pour annuler
    confirmButtonText: confirmButtonText,
    cancelButtonText: 'Annuler' // Texte du bouton d'annulation
  });
};
