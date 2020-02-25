window.addEventListener("DOMContentLoaded", () => {
  if (document.body.classList.contains('template-index')) {
    let section_four = document.querySelectorAll('#home-section-four .row');
    let section_four_total = section_four.length - 1;
    
    section_four.forEach( row => {
      row.querySelector('.count .total').innerHTML = '0' + section_four_total;
    } )
  }
});