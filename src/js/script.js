// Menu
const header = document.querySelector('[data-element="header"]');

window.addEventListener("scroll", function () {
  header.classList.toggle("rolagem", window.scrollY > 0);
});

// Close modal
const modal = document.querySelector('[data-element="modal"]');
const cancelbtn = document.querySelectorAll('[data-element="close"]');

const closeModal = () => (modal.style.display = "none");

cancelbtn.forEach((btn) => {
  btn.addEventListener("click", () => closeModal());
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) closeModal();
};

/*slides
  let slideIndex = 0;
  showSlides();
  
  function showSlides() {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}
    slides[slideIndex-1].style.display = "block";
    setTimeout(showSlides, 4000); // Change image every 2 seconds
  }*/
