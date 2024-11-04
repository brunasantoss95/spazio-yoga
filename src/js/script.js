// Menu
const header = document.querySelector('[data-element="header"]');

window.addEventListener("scroll", function () {
  header.classList.toggle("rolagem", window.scrollY > 0);
});

// Fechar modal
const modal = document.querySelector('[data-element="modal"]');
const cancelbtn = document.querySelectorAll('[data-element="close"]');

const closeModal = () => (modal.style.display = "none");

cancelbtn.forEach((btn) => {
  btn.addEventListener("click", () => closeModal());
});

// Quando o usuário clicar em qualquer lugar fora do modal, feche-o
window.onclick = function (event) {
  if (event.target == modal) closeModal();
};
