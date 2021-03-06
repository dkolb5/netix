window.addEventListener("DOMContentLoaded", (event) => {
  if (document.body.classList.contains('template-index')) {
    // Get the total number of items set the innerHTML
    let section_four = document.querySelectorAll('#home-section-four .row');
    let section_four_total = section_four.length - 1;
    
    section_four.forEach( row => {
      row.querySelector('.count .total').innerHTML = '0' + section_four_total;
		});
		
		play_hero_background_video();
		
	}
	
	function play_hero_background_video() {
		let homer_hero_video = document.querySelector('#home-section-one video');
		
		homer_hero_video.setAttribute('autoplay', true);
		homer_hero_video.play();
	}

  // Change header to be sticky
  document.addEventListener('scroll', sticky_navigation);

  function sticky_navigation(event) {
    let scroll = window.pageYOffset;
		let header = document.getElementById('shopify-section-header');
		let subpage_close = null;

		if (document.body.classList.contains('template-page') && ! document.body.classList.contains('page-about') && document.body.classList.contains('page-get-on-the-list')) {
			subpage_close = document.querySelector('a.back-button');

			if (scroll > 101) {
				header.classList.add('sticky');
				subpage_close.classList.add('subpage-close-sticky');
			} else if (scroll <= 100) {
				header.classList.remove('sticky');
				subpage_close.classList.remove('subpage-close-sticky');
			}
		} else {
			if (scroll > 101) {
				header.classList.add('sticky');
			} else if (scroll <= 100) {
				header.classList.remove('sticky');
			}
		}

    // if (scroll > 101) {
		// 	header.classList.add('sticky');
		// 	subpage_close.classList.add('subpage-close-sticky');
    // } else if (scroll <= 100) {
		// 	header.classList.remove('sticky');
		// 	subpage_close.classList.remove('subpage-close-sticky');
    // }
  }

  // Smooth Scroll Anchors
  let scroll_achor = document.querySelectorAll('.scroll-to');
  scroll_achor.forEach( (link) => {
    link.addEventListener('click', scroll_to_element);
  });

  function scroll_to_element(event) {
    event.preventDefault();

    let location_id = event.target.dataset.anchor;
    let destination = document.getElementById(location_id);
    
    let header = document.getElementById('shopify-section-header');
    header = header.getBoundingClientRect().height;

    destination = destination.offsetTop;
    destination = destination - header - 50;

    gsap.to(window, {duration: 0.4, scrollTo: destination, ease: "power0.ease"});
  }

	if (document.body.id != 'get-on-the-list') {
		// Open Modals
		let modal_buttons = document.querySelectorAll('.bws-button[data-modal]');
		modal_buttons.forEach( (button) => {
			button.addEventListener('click', open_modal);
		});

		function open_modal(event) {
			event.preventDefault();

			let video = null;
			let modal_id = event.target.dataset.modal;
			let modal = document.getElementById(modal_id);
			let modal_close = modal.querySelector('.close-modal')
			let content = modal.querySelector('.content');
			let tl = new TimelineMax();

			modal.classList.add('active');
			document.body.classList.add('no-overflow');

			tl.to(modal, {duration: 0.2, y: 0, opacity: 1, ease: "Quint.easeInOut", onComplete: play_video });
			tl.to(modal_close, {duration: 0.4, y: 0, opacity: 1, ease: "Quint.easeInOut"});
			// tl.to(content, {duration: 0.4, y: 0, opacity: 1, ease: "Quint.easeInOut", onComplete: play_video });
			tl.to(content, {duration: 0.4, y: 0, opacity: 1, ease: "Quint.easeInOut"});

			function play_video() {
				if (modal.classList.contains('video-modal')) {
					let iframe_wrapper = modal.querySelector('.iframe-wrapper');
					let iframe = document.createElement('iframe');
					iframe.setAttribute('src', iframe_wrapper.dataset.youtube);
					iframe_wrapper.appendChild(iframe);
					let current_src = iframe_wrapper.childNodes[1].getAttribute('src');
					
					gsap.to(iframe_wrapper, {delay: 0.4, opacity: 1, y: 0, duration: 0.4, ease: "Quint.easeInOut", 
						onComplete: () => {
							iframe_wrapper.childNodes[1].setAttribute('src', current_src + '?rel=0;&autoplay=1');
						}
					});
				}
			}
		}

		// Close modals
		let modal_close = document.querySelectorAll('.bws-modal .close-modal');
		modal_close.forEach( close => {
			close.addEventListener('click', close_modal);
		})

		function close_modal(event) {
			event.preventDefault();

			let current_modal = event.target.closest('.bws-modal');
			let video = null;
			let modal = document.getElementById(current_modal.id);
			let modal_close = modal.querySelector('.close-modal')
			let content = modal.querySelector('.content');

			modal.classList.remove('active');
			document.body.classList.remove('no-overflow');

			let tl = new TimelineMax();
			tl.to(content, {duration: 0.2, y: -50, opacity: 0, ease: "Quint.easeInOut", onComplete: pause_video, });
			tl.to(modal_close, {duration: 0.2, y: -50, opacity: 0, ease: "Quint.easeInOut"});
			tl.to(modal, {duration: 0.2, y: -50, opacity: 0, ease: "Quint.easeInOut"});
			
			function pause_video() {
				if (modal.classList.contains('video-modal')) {
					let iframe = modal.querySelector('.iframe-wrapper');
					iframe.removeChild(iframe.childNodes[1]);
				}
			}
		}
	}

  // Animate text when in view
  function content_inview() {
    const topViewport = window.pageYOffset;
    const midViewport = topViewport + ( window.innerHeight / 2);
    
    let sections = document.querySelectorAll('section');
    window.requestAnimationFrame(content_inview);
    let header = document.getElementById('shopify-section-header').getBoundingClientRect().height;
    let contentWrap = document.querySelector('#home-section-two').getBoundingClientRect().top;

    let text = Array.from(document.querySelectorAll('.js-animating-text'));
    // let first = Array.fromdocument.querySelector('#home-section-one .js-animating-text');
    let current = null;
    let full_item = null;

		let remove_first = text.shift();

    text.forEach( item => {
      if ((midViewport - topViewport) > (header + item.getBoundingClientRect().top)) {
        // cancelAnimationFrame(content_inview);
        full_item = item;
				current = '#' + item.id;

        if ( ! full_item.classList.contains('has-been-animated')) {
          var tl = gsap.timeline(), 
          mySplitText = new SplitText(current, {type:"words,chars"}), 
          chars = mySplitText.chars;

          item.style.opacity = 1;

          gsap.set(current, {perspective: 400});
          tl.from(chars, {duration: 0.8, opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:"back", stagger: 0.1}, "+=0");
          full_item.classList.add('has-been-animated');
        }
      }
    });
  }

  // Hide Animated Text
  let text = document.querySelectorAll('.js-animating-text');
  text.forEach( item => {
    item.style.opacity = 0;
  });
  
  // Bring in Hero Text - on load
  function hero_animated_text() {
    let item = document.querySelector('#home-section-one .js-animating-text');
    var tl = gsap.timeline(), 
    mySplitText = new SplitText(item, {type:"words,chars"}), 
    chars = mySplitText.chars;
    item.style.opacity = 1;

    gsap.set(item, {perspective: 400});
    tl.from(chars, {duration: 0.8, opacity:0, scale:0, y:80, rotationX:180, transformOrigin:"0% 50% -50",  ease:"back", stagger: 0.1}, "+=0");
    item.classList.add('has-been-animated');
	}
	
	if (document.body.classList.contains('template-index') && window.innerWidth >= 1025) {
		hero_animated_text();
	} 
	else if (document.body.classList.contains('template-index')) {
		let item = document.querySelector('#home-section-one .js-animating-text');
		item.style.opacity = 1;
	}

  function gasp_text(class_name) {
    var tl = gsap.timeline(), 
    mySplitText = new SplitText(class_name, {type:"words,chars"}), 
    chars = mySplitText.chars; //an array of all the divs that wrap each character

    gsap.set(class_name, {perspective: 400});
    tl.from(chars, {duration: 0.8, opacity:0, scale:0, y:80, rotationX:180,  transformOrigin:"0% 50% -50",  ease:"back", stagger: 0.1}, "+=0");
  }
	
	// Mailchimp submit - animation
	let submit = document.getElementById('mc-embedded-subscribe');

	submit.addEventListener('click', (event) => {
		let form = event.target.closest('form');
		let email = form.querySelector('input[type="Email"]');
		let responses = form.querySelector('.mc-form-reponses');
		
		setTimeout( () => {
			if (email.classList.contains('valid')) {
				let temp = Array.from(responses.childNodes);
				let response = temp.filter(item => { return item.classList != undefined; });
				let response_html = new Array();
				let form_bounding = form.parentElement.getBoundingClientRect();
				let inner = null;
				let body_classes = document.body.classList;
				let message = null;
				let message_wrapper = form.parentElement.querySelector('.form-response');
				message_wrapper.style.overflow = 'visible';
				
				for(let a = 0; a < response.length; a++) {
					if (response[a].innerHTML.length > 0) {
						response_html.push(response[a].innerHTML, response[a].id);
					}
				}

				if (response_html[1] == 'mce-success-response') {
					message = form.nextElementSibling.childNodes[1];
				} else if (response_html[1] == 'mce-error-response') {
					message = form.nextElementSibling.childNodes[3];
				}
		
				let tl = new TimelineMax();
				let message_copy = message.querySelector('.x-large');
				message_copy.innerHTML = response_html[0];
				let message_copy_height = document.querySelector('.' + message.classList[0] + ' p.x-large').getBoundingClientRect();

				tl.to(message_wrapper, {duration: 0.2, ease: "power0", y: (-form_bounding.height - 20) + 30, height: form_bounding.height + 40});

				if (body_classes.contains('page-get-on-the-list')) {
					tl.to(message, {duration: 0, height: message_copy_height + 40, y: (-form_bounding.height - 20) + 110, ease: "power0"});
					gsap.to(window, {duration: 0.2, scrollTo: 0, ease: "power0.ease"});
					tl.to(form.childNodes[1], {duration: 0.2, opacity: 0, y: -30, ease: "power0"});
					if (window.innerWidth > 768) {
						tl.to(message, {duration: 0.4, opacity: 1, y: 90, ease: "power0"});
					} else {
						tl.to(message, {duration: 0.4, opacity: 1, y: 0, ease: "power0"});
					}
					
				} else {
					tl.to(message, {duration: 0.2, height: message_copy_height + 40, ease: "power0"});

					tl.to(form.childNodes[1], {duration: 0.2, opacity: 0, y: -30, ease: "power0"});
					tl.to(message, {duration: 0, y: '30%', ease: "power0"}, -0.2);
					tl.to(message, {duration: 0.4, opacity: 1, y: 0, ease: "power0"});
				}
			}

			// Google Analytics
			ga('send', 'event', { eventCategory: 'email subscription', eventAction: 'submit', eventLabel: 'sign me up'});
		}, 500);
	});

	// Google Analytics

	// Nav Cta's
	let header_cta_links = document.querySelectorAll('header .cta-link');
	header_cta_links.forEach(link => {
		link.addEventListener('click', () => {
			ga('send', 'event', { eventCategory: 'conversion', eventAction: 'click', eventLabel: 'get the bag header'});
		})
	});

	// Home Buttons
	if (document.body.classList.contains('template-index')) {
		let temp = Array.from(document.querySelectorAll('main .regular-button'));
		let home_page_buttons = temp.filter(item => { return item.classList != undefined || ! item.classList.contain('video-button') });
		home_page_buttons.forEach(button => {
			button.addEventListener('click', () => {
				ga('send', 'event', { eventCategory: 'conversion', eventAction: 'click', eventLabel: 'get the bag main'});
			})
		})
	}

	// gsap.set(text_one, {perspective: 400});
	// // gsap.staggerFrom(mySplitText.chars, 0.8, {opacity: 0, sclae: 0, y: 80, rotationX: 180, transformOrigin: '0% 50% -50%', ease: Back.easeOut}, 0.01, allDone);
	// gsap.to(mySplitText.chars, {
	//   // duration: 1,
	//   // // y: -80,
	//   // opacity: 0,
	//   // scale: 0, 
	//   // y: 80, 
	//   // rotationX: 180, 
	//   // transformOrigin: '0% 50% -50%',
	//   // stagger: {
	//   //   amount: 0.4,
	//   //   from: "left",
	//   //   grid: "auto",
	//   //   onComplete:  allDone, //define callbacks inside the stagger to make them apply to each sub-tween
	//   // }
	//   x: "+=100",
	//   duration: 0.4,
	//   ease: "elastic.inOut",
	//   // y: -80,
	//   opacity: 0,
	//   scale: 0, 
	//   y: 80, 
	//   rotationX: 180, 
	//   transformOrigin: '0% 50% -50%',
	//   stagger: {
	//     amount: 0.2,
	//     from: "center",
	//     grid: "auto",
	//     // onComplete: myFunction //define callbacks inside the stagger to make them apply to each sub-tween
	//     onComplete: allDone,
	//   }
	// })

	// function allDone(current) {
	// 	current.revert();
	// }


	// Button Hovers
	// let video_buttons = document.querySelectorAll('.circle-button');
	// video_buttons.forEach(button => {
		
	// 	button.addEventListener('mousemove', (event) => {
	// 		let inner = event.target.querySelector('.inner-circle');
	// 		let inner_rect = inner.getBoundingClientRect();	
	// 		let moveX = event.clientX - (inner_rect.left) - (inner_rect.width / 2);
	// 		let moveY = (event.clientY - (inner_rect.top) - inner_rect.height / 2);
	// 		let skewX = event.movementX * 2.1;
	// 		let skewY = event.movementY * 2.1;

	// 		gsap.to(inner, {duration: 0.1, skewX: skewX, skewY: skewY, transformOrigin: "center", ease: "Quint.easeInOut", x: moveX, y: moveY});
	// 	});

	// 	button.addEventListener('mouseout', (event) => {
	// 		let inner = event.target.querySelector('.inner-circle');
	// 		let inner_rect = inner.getBoundingClientRect();
	// 		gsap.to(inner, {duration: 0.2, ease: "Quint.easeInOut", skewX: 0, skewY: 0, x: 0, y: 0});
	// 	});
	// })

	class bwsSingleSlider {
		constructor(settings) {
			this.section = document.getElementById(settings.section);
			this.id = document.getElementById(settings.id);
			this.prev_arrow = this.section.querySelector('.prev');
			this.next_arrow = this.section.querySelector('.next');
		}

		_init() {
			let slider= this.id;
			let get_slides = Array.from(this.id.childNodes);
			let slides = get_slides.filter( (item) => { return item.classList != undefined} );
			let current;
			
			slider.style.width = ((slides.length) * 100) + '%';
			slider.style.transform = `translate3d(0, 0, 0)`;

			slides.forEach( (slide, index) => {
				slide.setAttribute('data-slide', index);
				slide.style.width = '100%';

				if (slide.classList != undefined && slide.classList.contains('active')) {
					current = index;
				}

				if (index != 0) {
					gsap.to(slide, {duration: 0, x: '100%'});
				}
			});

			function current_slide(slider_id) {
				let slides = Array.from(document.querySelectorAll('#' + slider_id.id + ' li'));
				let active = null;

				for (let a = 0; a < slides.length; a++) {
					if (slides[a].classList.contains('active')) {
						active = a;
					}
				}
				return active;
			}

			function slide_info(slider_id) {
				let t = slider_id.style.transform;
				t = t.split(',');
				t = t[0].split('(');
				t = t[1].substring(0, t[1].length - 2);

				let slides = slider_id.querySelectorAll('li');

				let slide_width = slides[1].style.width;
				slide_width = slide_width.substring(0, slide_width.length - 1);

				let slide_margin_left = slides[1].style.marginLeft; 

				let return_array = new Array();
				return_array.push(slide_margin_left, slide_width, slides);
				return return_array;
			}

			this.next_arrow.addEventListener('click', (event) => {
				event.preventDefault();
				let current = current_slide(this.id);
				
				// Disable Arrow
				if (current == slides.length - 2) {
					event.target.classList.add('disabled-arrow');
				} else {
					event.target.classList.remove('disabled-arrow');
				}

				if (current >= 0) {
					this.prev_arrow.classList.remove('disabled-arrow');
				} else  {
					this.prev_arrow.classList.add('disabled-arrow');
				}

				if (current < slides.length - 1) {
					current += 1;

					let slide_information = slide_info(this.id);
					let slide_width = slide_information[1];
					let slide_margin_left = slide_information[0];
					let slides = slide_information[2];

					slides[current];
					let all_slides = document.querySelectorAll('#' + this.id.id + ' li');

					all_slides.forEach( (slide, index) => {
						slide.classList.remove('active');
					});

					for (let a = 0; a < all_slides.length; a++) {
						if (a == current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 1, x: '0%', ease: "Quint.easeInOut"});
						}

						if (a < current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 0, x: '-50%', ease: "Quint.easeInOut"});
						} 

						if (a > current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 0, x: '50%', ease: "Quint.easeInOut"});
						} 
					}
					slides[current].classList.add('active');

					let i = parseFloat((Number(slide_width)) / (slides.length) * current, 2);
					let slider_current = '#' + this.id.id;
					gsap.to(slider_current, {duration: 0.8, x: -i + '%', ease: "Quint.easeInOut"});
				} else {
					// event.target.classList.add('disabled-arrow');
				}
			});

			this.prev_arrow.addEventListener('click', (event) => {
				event.preventDefault();

				let current = current_slide(this.id);

				// Disable Arrow
				if (current <= slides.length - 1) {
					this.next_arrow.classList.remove('disabled-arrow');
				} else {
					this.next_arrow.classList.add('disabled-arrow');
				}

				if (current > 1) {
					this.prev_arrow.classList.remove('disabled-arrow');
				} else if (current == 1){
					this.prev_arrow.classList.add('disabled-arrow');
				}

				if (current >= 0 ) {
					if (current != 0) {
						current -= 1;
					}
					
					let slide_information = slide_info(this.id);
					let slide_width = slide_information[1];
					let slide_margin_left = slide_information[0];
					let slides = slide_information[2];
					slides[current];
					slides.forEach( (slide, index) => {
						slide.classList.remove('active');
					});
					slides[current].classList.add('active');

					let all_slides = document.querySelectorAll('#' + this.id.id + ' li');

					all_slides.forEach( (slide, index) => {
						slide.classList.remove('active');
					});
					slides[current].classList.add('active');

					for (let a = 0; a < all_slides.length; a++) {
						if (a == current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 1, x: 0, ease: "Quint.easeInOut"});
						}

						if (a > current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 0, x: '50%', ease: "Quint.easeInOut"});
						} 

						if (a < current) {
							gsap.to(all_slides[a], {duration: 0.8, opacity: 0, x: '-50%', ease: "Quint.easeInOut"});
						} 
					}

					let i = parseFloat((Number(slide_width)) / (slides.length) * current, 2);
					let slider_current = '#' + this.id.id;
					gsap.to(slider_current, {duration: 1, x: -i + '%', ease: "Quint.easeInOut"});
				} else {
					return;
				}
			});
		}
	}

	// Home Slider
	if (document.body.classList.contains('template-index')) {
		let slider_one = new bwsSingleSlider({
			'section': 'home-section-six',
			'id': 'slider-single',
		});
		slider_one._init();
	}
	
	if (document.body.classList.contains('page-lazy-load')) {
		function lazy_load() {
			const top_viewport = window.pageYOffset;
			// const mid_viewport = top_viewport + (window.innerHeight / 2);
			const mid_viewport = top_viewport + (window.innerHeight + 200);
			
			let images = Array.from(document.querySelectorAll('img.lazy-load'));
		
			images.forEach( (img) => {
				if ( (mid_viewport - top_viewport) > (img.getBoundingClientRect().top) ) {
					let full = img.dataset.full;
					img.setAttribute('src', full);
					img.classList.add('full-in');
					img.parentElement.classList.add('reveal');
				}
			});
		}
		
		document.addEventListener('scroll', lazy_load);
	}
	
});

$( document ).ready(function() {
	$('#contact_form').submit(function(event) {
		event.preventDefault();
			var $form = $(this);
			
			jQuery.ajax({
				type: 'POST',
				async: true,
				url: '/contact',
				data: $form.serialize(),
				beforeSend: function() {
					$form.addClass('sending');
				},
				error: function(t) {
					// console.log(t);
				},
				success: function(response) {
					success_message($form);
				// console.log('success blah');
				// console.log($form.target, event.target);
				}
			});
			event.preventDefault();
	})
})

function success_message(form_) {
	let form = form_[0];
	let form_bounding = form.getBoundingClientRect();
	let success = form.nextElementSibling;
	let inner = success.childNodes[1];
	let body_classes = document.body.classList;

	let tl = new TimelineMax();
	success.style.position = 'absolute';
	success.style.overflow = 'visible';
	tl.to(success, {duration: 0.2, scale: 1, ease: "power0", y: -form_bounding.height - 20});

	if (body_classes.contains('page-get-on-the-list')) {
		tl.to(success, {duration: 0.2, height: inner.clientHeight + 40, y: (-form_bounding.height - 20) + 90, ease: "power0"});
		gsap.to(window, {duration: 0.4, scrollTo: 0, ease: "power0.ease"});
	} else {
		tl.to(success, {duration: 0.2, height: inner.clientHeight + 40, ease: "power0"});
	}
	
	tl.to(form_, {duration: 0.2, opacity: 0, y: -30, ease: "power0"});
	tl.to(inner, {duration: 0, y: '30%', ease: "power0"}, -0.2);
	tl.to(inner, {duration: 0.4, opacity: 1, y: 0, ease: "power0"});
}
// ===========================================
// Greensock - SplitText / strings
// ===========================================
/*!
 * strings: 3.0.0
 * https://greensock.com
 *
 * Copyright 2008-2019, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */

let _trimExp = /(^\s+|\s+$)/g;

export const emojiExp = /([\uD800-\uDBFF][\uDC00-\uDFFF](?:[\u200D\uFE0F][\uD800-\uDBFF][\uDC00-\uDFFF]){2,}|\uD83D\uDC69(?:\u200D(?:(?:\uD83D\uDC69\u200D)?\uD83D\uDC67|(?:\uD83D\uDC69\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D(?:\uD83D\uDC69\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]\uFE0F|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC6F\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3C-\uDD3E\uDDD6-\uDDDF])\u200D[\u2640\u2642]\uFE0F|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uFE0F\u200D[\u2640\u2642]|(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642])\uFE0F|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC69\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708]))\uFE0F|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83D\uDC69\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69]))|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67)\uDB40\uDC7F|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66\u200D\uD83D\uDC66|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]))|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|\uD83D\uDC68(?:\u200D(?:(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC67|(?:(?:\uD83D[\uDC68\uDC69])\u200D)?\uD83D\uDC66)|\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDD1-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])?|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267B\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF8]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD4C\uDD50-\uDD6B\uDD80-\uDD97\uDDC0\uDDD0-\uDDE6])\uFE0F)/;

export function getText(e) {
	let type = e.nodeType,
		result = "";
	if (type === 1 || type === 9 || type === 11) {
		if (typeof(e.textContent) === "string") {
			return e.textContent;
		} else {
			for (e = e.firstChild; e; e = e.nextSibling ) {
				result += getText(e);
			}
		}
	} else if (type === 3 || type === 4) {
		return e.nodeValue;
	}
	return result;
}

/*
//smaller kb version that only handles the simpler emoji's, which is often perfectly adequate.

let _emoji = "[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D]|[\uD800-\uDBFF][\uDC00-\uDFFF]",
	_emojiExp = new RegExp(_emoji),
	_emojiAndCharsExp = new RegExp(_emoji + "|.", "g"),
	_emojiSafeSplit = (text, delimiter, trim) => {
		if (trim) {
			text = text.replace(_trimExp, "");
		}
		return ((delimiter === "" || !delimiter) && _emojiExp.test(text)) ? text.match(_emojiAndCharsExp) : text.split(delimiter || "");
	};
 */
export function emojiSafeSplit(text, delimiter, trim) {
	if (trim) {
		text = text.replace(_trimExp, "");
	}
	if (delimiter && delimiter !== "") {
		return text.split(delimiter);
	}
	let result = [],
		l = text.length,
		i = 0,
		j, character;
	for (; i < l; i++) {
		character = text.charAt(i);
		if ((character.charCodeAt(0) >= 0xD800 && character.charCodeAt(0) <= 0xDBFF) || (text.charCodeAt(i+1) >= 0xFE00 && text.charCodeAt(i+1) <= 0xFE0F)) { //special emoji characters use 2 or 4 unicode characters that we must keep together.
			j = ((text.substr(i, 12).split(emojiExp) || [])[1] || "").length || 2;
			character = text.substr(i, j);
			result.emoji = 1;
			i += j - 1;
		}
		result.push(character);
	}
	return result;
}


/*!
 * SplitText: 3.0.0
 * https://greensock.com
 *
 * @license Copyright 2008-2019, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
/* eslint-disable */
// import { emojiExp, getText } from "./utils/strings.js";

let _doc, _win, _coreInitted,
	_stripExp = /(?:\r|\n|\t\t)/g, //find carriage returns, new line feeds and double-tabs.
	_multipleSpacesExp = /(?:\s\s+)/g,
	_initCore = () => {
		_doc = document;
		_win = window;
		_coreInitted = 1;
	},
	_bonusValidated = 1, //<name>SplitText</name>
	_getComputedStyle = element => _win.getComputedStyle(element),
	_isArray = Array.isArray,
	_slice = [].slice,
	_toArray = (value, leaveStrings) => { //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
		let type;
		return _isArray(value) ? value : ((type = typeof value) === "string" && !leaveStrings && value) ? _slice.call(_doc.querySelectorAll(value), 0) : (value && type === "object" && "length" in value) ? _slice.call(value, 0) : value ? [value] : [];
	},
	_isAbsolute = vars => (vars.position === "absolute" || vars.absolute === true),
	//some characters are combining marks (think diacritics/accents in European languages) which involve 2 or 4 characters that combine in the browser to form a single character. Pass in the remaining text and an array of the special characters to search for and if the text starts with one of those special characters, it'll spit back the number of characters to retain (often 2 or 4). Used in the specialChars features that was introduced in 0.6.0.
	_findSpecialChars = (text, chars) => {
		let i = chars.length,
			s;
		while (--i > -1) {
			s = chars[i];
			if (text.substr(0, s.length) === s) {
				return s.length;
			}
		}
	},
	_divStart = " style='position:relative;display:inline-block;'",
	_cssClassFunc = (cssClass = "", tag) => {
		let iterate = ~cssClass.indexOf("++"),
			num = 1;
		if (iterate) {
			cssClass = cssClass.split("++").join("");
		}
		return () => "<" + tag + _divStart + (cssClass ? " class='" + cssClass + (iterate ? num++ : "") + "'>" : ">");
	},
	_swapText = (element, oldText, newText) => {
		let type = element.nodeType;
		if (type === 1 || type === 9 || type === 11) {
			for (element = element.firstChild; element; element = element.nextSibling) {
				_swapText(element, oldText, newText);
			}
		} else if (type === 3 || type === 4) {
			element.nodeValue = element.nodeValue.split(oldText).join(newText);
		}
	},
	_pushReversed = (a, merge) => {
		let i = merge.length;
		while (--i > -1) {
			a.push(merge[i]);
		}
	},
	_isBeforeWordDelimiter = (e, root, wordDelimiter) => {
		let next;
		while (e && e !== root) {
			next = e._next || e.nextSibling;
			if (next) {
				return next.textContent.charAt(0) === wordDelimiter;
			}
			e = e.parentNode || e._parent;
		}
	},
	_deWordify = e => {
		let children = _toArray(e.childNodes),
			l = children.length,
			i, child;
		for (i = 0; i < l; i++) {
			child = children[i];
			if (child._isSplit) {
				_deWordify(child);
			} else {
				if (i && child.previousSibling.nodeType === 3) {
					child.previousSibling.nodeValue += (child.nodeType === 3) ? child.nodeValue : child.firstChild.nodeValue;
				} else if (child.nodeType !== 3) {
					e.insertBefore(child.firstChild, child);
				}
				e.removeChild(child);
			}
		}
	},
	_getStyleAsNumber = (name, computedStyle) => parseFloat(computedStyle[name]) || 0,
	_setPositionsAfterSplit = (element, vars, allChars, allWords, allLines, origWidth, origHeight) => {
		let cs = _getComputedStyle(element),
			paddingLeft = _getStyleAsNumber("paddingLeft", cs),
			lineOffsetY = -999,
			borderTopAndBottom = _getStyleAsNumber("borderBottomWidth", cs) + _getStyleAsNumber("borderTopWidth", cs),
			borderLeftAndRight = _getStyleAsNumber("borderLeftWidth", cs) + _getStyleAsNumber("borderRightWidth", cs),
			padTopAndBottom = _getStyleAsNumber("paddingTop", cs) + _getStyleAsNumber("paddingBottom", cs),
			padLeftAndRight = _getStyleAsNumber("paddingLeft", cs) + _getStyleAsNumber("paddingRight", cs),
			lineThreshold = _getStyleAsNumber("fontSize", cs) * 0.2,
			textAlign = cs.textAlign,
			charArray = [],
			wordArray = [],
			lineArray = [],
			wordDelimiter = vars.wordDelimiter || " ",
			tag = vars.tag ? vars.tag : (vars.span ? "span" : "div"),
			types = vars.type || vars.split || "chars,words,lines",
			lines = (allLines && ~types.indexOf("lines")) ? [] : null,
			words = ~types.indexOf("words"),
			chars = ~types.indexOf("chars"),
			absolute = _isAbsolute(vars),
			linesClass = vars.linesClass,
			iterateLine = ~((linesClass || "").indexOf("++")),
			spaceNodesToRemove = [],
			i, j, l, node, nodes, isChild, curLine, addWordSpaces, style, lineNode, lineWidth, offset;
		if (iterateLine) {
			linesClass = linesClass.split("++").join("");
		}

		//copy all the descendant nodes into an array (we can't use a regular nodeList because it's live and we may need to renest things)
		j = element.getElementsByTagName("*");
		l = j.length;
		nodes = [];
		for (i = 0; i < l; i++) {
			nodes[i] = j[i];
		}

		//for absolute positioning, we need to record the x/y offsets and width/height for every <div>. And even if we're not positioning things absolutely, in order to accommodate lines, we must figure out where the y offset changes so that we can sense where the lines break, and we populate the lines array.
		if (lines || absolute) {
			for (i = 0; i < l; i++) {
				node = nodes[i];
				isChild = (node.parentNode === element);
				if (isChild || absolute || (chars && !words)) {
					offset = node.offsetTop;
					if (lines && isChild && Math.abs(offset - lineOffsetY) > lineThreshold && (node.nodeName !== "BR" || i === 0)) { //we found some rare occasions where a certain character like &#8209; could cause the offsetTop to be off by 1 pixel, so we build in a threshold.
						curLine = [];
						lines.push(curLine);
						lineOffsetY = offset;
					}
					if (absolute) { //record offset x and y, as well as width and height so that we can access them later for positioning. Grabbing them at once ensures we don't trigger a browser paint & we maximize performance.
						node._x = node.offsetLeft;
						node._y = offset;
						node._w = node.offsetWidth;
						node._h = node.offsetHeight;
					}
					if (lines) {
						if ((node._isSplit && isChild) || (!chars && isChild) || (words && isChild) || (!words && node.parentNode.parentNode === element && !node.parentNode._isSplit)) {
							curLine.push(node);
							node._x -= paddingLeft;
							if (_isBeforeWordDelimiter(node, element, wordDelimiter)) {
								node._wordEnd = true;
							}
						}
						if (node.nodeName === "BR" && ((node.nextSibling && node.nextSibling.nodeName === "BR") || i === 0)) { //two consecutive <br> tags signify a new [empty] line. Also, if the entire block of content STARTS with a <br>, add a line.
							lines.push([]);
						}
					}
				}
			}
		}

		for (i = 0; i < l; i++) {
			node = nodes[i];
			isChild = (node.parentNode === element);
			if (node.nodeName === "BR") {
				if (lines || absolute) {
					if (node.parentNode) {
						node.parentNode.removeChild(node);
					}
					nodes.splice(i--, 1);
					l--;
				} else if (!words) {
					element.appendChild(node);
				}
				continue;
			}

			if (absolute) {
				style = node.style;
				if (!words && !isChild) {
					node._x += node.parentNode._x;
					node._y += node.parentNode._y;
				}
				style.left = node._x + "px";
				style.top = node._y + "px";
				style.position = "absolute";
				style.display = "block";
				//if we don't set the width/height, things collapse in older versions of IE and the origin for transforms is thrown off in all browsers.
				style.width = (node._w + 1) + "px"; //IE is 1px short sometimes. Avoid wrapping
				style.height = node._h + "px";
			}

			if (!words && chars) {
				//we always start out wrapping words in their own <div> so that line breaks happen correctly, but here we'll remove those <div> tags if necessary and renest the characters directly into the element rather than inside the word <div>
				if (node._isSplit) {
					node._next = node.nextSibling;
					node.parentNode.appendChild(node); //put it at the end to keep the order correct.

				} else if (node.parentNode._isSplit) {
					node._parent = node.parentNode;
					if (!node.previousSibling && node.firstChild) {
						node.firstChild._isFirst = true;
					}
					if (node.nextSibling && node.nextSibling.textContent === " " && !node.nextSibling.nextSibling) { //if the last node inside a nested element is just a space (like T<span>nested </span>), remove it otherwise it'll get placed in the wrong order. Don't remove it right away, though, because we need to sense when words/characters are before a space like _isBeforeWordDelimiter(). Removing it now would make that a false negative.
						spaceNodesToRemove.push(node.nextSibling);
					}
					node._next = (node.nextSibling && node.nextSibling._isFirst) ? null : node.nextSibling;
					node.parentNode.removeChild(node);
					nodes.splice(i--, 1);
					l--;
				} else if (!isChild) {
					offset = (!node.nextSibling && _isBeforeWordDelimiter(node.parentNode, element, wordDelimiter)); //if this is the last letter in the word (and we're not breaking by lines and not positioning things absolutely), we need to add a space afterwards so that the characters don't just mash together
					if (node.parentNode._parent) {
						node.parentNode._parent.appendChild(node);
					}
					if (offset) {
						node.parentNode.appendChild(_doc.createTextNode(" "));
					}
					if (tag === "span") {
						node.style.display = "inline"; //so that word breaks are honored properly.
					}
					charArray.push(node);
				}
			} else if (node.parentNode._isSplit && !node._isSplit && node.innerHTML !== "") {
				wordArray.push(node);
			} else if (chars && !node._isSplit) {
				if (tag === "span") {
					node.style.display = "inline";
				}
				charArray.push(node);
			}
		}

		i = spaceNodesToRemove.length;
		while (--i > -1) {
			spaceNodesToRemove[i].parentNode.removeChild(spaceNodesToRemove[i]);
		}

		if (lines) {
			//the next 7 lines just give us the line width in the most reliable way and figure out the left offset (if position isn't relative or absolute). We must set the width along with text-align to ensure everything works properly for various alignments.
			if (absolute) {
				lineNode = _doc.createElement(tag);
				element.appendChild(lineNode);
				lineWidth = lineNode.offsetWidth + "px";
				offset = (lineNode.offsetParent === element) ? 0 : element.offsetLeft;
				element.removeChild(lineNode);
			}
			style = element.style.cssText;
			element.style.cssText = "display:none;"; //to improve performance, set display:none on the element so that the browser doesn't have to worry about reflowing or rendering while we're renesting things. We'll revert the cssText later.
			//we can't use element.innerHTML = "" because that causes IE to literally delete all the nodes and their content even though we've stored them in an array! So we must loop through the children and remove them.
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
			addWordSpaces = (wordDelimiter === " " && (!absolute || (!words && !chars)));
			for (i = 0; i < lines.length; i++) {
				curLine = lines[i];
				lineNode = _doc.createElement(tag);
				lineNode.style.cssText = "display:block;text-align:" + textAlign + ";position:" + (absolute ? "absolute;" : "relative;");
				if (linesClass) {
					lineNode.className = linesClass + (iterateLine ? i+1 : "");
				}
				lineArray.push(lineNode);
				l = curLine.length;
				for (j = 0; j < l; j++) {
					if (curLine[j].nodeName !== "BR") {
						node = curLine[j];
						lineNode.appendChild(node);
						if (addWordSpaces && node._wordEnd) {
							lineNode.appendChild(_doc.createTextNode(" "));
						}
						if (absolute) {
							if (j === 0) {
								lineNode.style.top = (node._y) + "px";
								lineNode.style.left = (paddingLeft + offset) + "px";
							}
							node.style.top = "0px";
							if (offset) {
								node.style.left = (node._x - offset) + "px";
							}
						}
					}
				}
				if (l === 0) { //if there are no nodes in the line (typically meaning there were two consecutive <br> tags, just add a non-breaking space so that things display properly.
					lineNode.innerHTML = "&nbsp;";
				} else if (!words && !chars) {
					_deWordify(lineNode);
					_swapText(lineNode, String.fromCharCode(160), " ");
				}
				if (absolute) {
					lineNode.style.width = lineWidth;
					lineNode.style.height = node._h + "px";
				}
				element.appendChild(lineNode);
			}
			element.style.cssText = style;
		}

		//if everything shifts to being position:absolute, the container can collapse in terms of height or width, so fix that here.
		if (absolute) {
			if (origHeight > element.clientHeight) {
				element.style.height = (origHeight - padTopAndBottom) + "px";
				if (element.clientHeight < origHeight) { //IE8 and earlier use a different box model - we must include padding and borders
					element.style.height = (origHeight + borderTopAndBottom)+ "px";
				}
			}
			if (origWidth > element.clientWidth) {
				element.style.width = (origWidth - padLeftAndRight) + "px";
				if (element.clientWidth < origWidth) { //IE8 and earlier use a different box model - we must include padding and borders
					element.style.width = (origWidth + borderLeftAndRight)+ "px";
				}
			}
		}
		_pushReversed(allChars, charArray);
		if (words) {
			_pushReversed(allWords, wordArray);
		}
		_pushReversed(allLines, lineArray);
	},
	_splitRawText = (element, vars, wordStart, charStart) => {
		let tag = vars.tag ? vars.tag : (vars.span ? "span" : "div"),
			types = vars.type || vars.split || "chars,words,lines",
			//words = (types.indexOf("words") !== -1),
			chars = ~types.indexOf("chars"),
			absolute = _isAbsolute(vars),
			wordDelimiter = vars.wordDelimiter || " ",
			space = wordDelimiter !== " " ? "" : (absolute ? "&#173; " : " "),
			wordEnd = "</" + tag + ">",
			wordIsOpen = 1,
			specialChars = vars.specialChars ? (typeof(vars.specialChars) === "function" ? vars.specialChars : _findSpecialChars) : null, //specialChars can be an array or a function. For performance reasons, we always set this local "specialChars" to a function to which we pass the remaining text and whatever the original vars.specialChars was so that if it's an array, it works with the _findSpecialChars() function.
			text, splitText, i, j, l, character, hasTagStart, testResult,
			container = _doc.createElement("div"),
			parent = element.parentNode;

		parent.insertBefore(container, element);
		container.textContent = element.nodeValue;
		parent.removeChild(element);
		element = container;
		text = getText(element);
		hasTagStart = text.indexOf("<") !== -1;

		if (vars.reduceWhiteSpace !== false) {
			text = text.replace(_multipleSpacesExp, " ").replace(_stripExp, "");
		}
		if (hasTagStart) {
			text = text.split("<").join("{{LT}}"); //we can't leave "<" in the string, or when we set the innerHTML, it can be interpreted as a node
		}
		l = text.length;
		splitText = ((text.charAt(0) === " ") ? space : "") + wordStart();
		for (i = 0; i < l; i++) {
			character = text.charAt(i);
			if (specialChars && (testResult = specialChars(text.substr(i), vars.specialChars))) { // look for any specialChars that were declared. Remember, they can be passed in like {specialChars:["मी", "पा", "है"]} or a function could be defined instead. Either way, the function should return the number of characters that should be grouped together for this "character".
				character = text.substr(i, testResult || 1);
				splitText += (chars && character !== " ") ? charStart() + character + "</" + tag + ">" : character;
				i += testResult - 1;
			} else if (character === wordDelimiter && text.charAt(i-1) !== wordDelimiter && i) {
				splitText += wordIsOpen ? wordEnd : "";
				wordIsOpen = 0;
				while (text.charAt(i + 1) === wordDelimiter) { //skip over empty spaces (to avoid making them words)
					splitText += space;
					i++;
				}
				if (i === l-1) {
					splitText += space;
				} else if (text.charAt(i + 1) !== ")") {
					splitText += space + wordStart();
					wordIsOpen = 1;
				}

			} else if (character === "{" && text.substr(i, 6) === "{{LT}}") {
				splitText += chars ? charStart() + "{{LT}}" + "</" + tag + ">" : "{{LT}}";
				i += 5;

			} else if ((character.charCodeAt(0) >= 0xD800 && character.charCodeAt(0) <= 0xDBFF) || (text.charCodeAt(i+1) >= 0xFE00 && text.charCodeAt(i+1) <= 0xFE0F)) { //special emoji characters use 2 or 4 unicode characters that we must keep together.
				j = ((text.substr(i, 12).split(emojiExp) || [])[1] || "").length || 2;
				splitText += (chars && character !== " ") ? charStart() + text.substr(i, j) + "</" + tag + ">" : text.substr(i, j);
				i += j - 1;
			} else {
				splitText += (chars && character !== " ") ? charStart() + character + "</" + tag + ">" : character;
			}
		}
		element.outerHTML = splitText + (wordIsOpen ? wordEnd : "");
		if (hasTagStart) {
			_swapText(parent, "{{LT}}", "<"); //note: don't perform this on "element" because that gets replaced with all new elements when we set element.outerHTML.
		}
	},
	_split = (element, vars, wordStart, charStart) => {
		let children = _toArray(element.childNodes),
			l = children.length,
			absolute = _isAbsolute(vars),
			i, child;
		if (element.nodeType !== 3 || l > 1) {
			vars.absolute = false;
			for (i = 0; i < l; i++) {
				child = children[i];
				if (child.nodeType !== 3 || /\S+/.test(child.nodeValue)) {
					if (absolute && child.nodeType !== 3 && _getComputedStyle(child).display === "inline") { //if there's a child node that's display:inline, switch it to inline-block so that absolute positioning works properly (most browsers don't report offsetTop/offsetLeft properly inside a <span> for example)
						child.style.display = "inline-block";
						child.style.position = "relative";
					}
					child._isSplit = true;
					_split(child, vars, wordStart, charStart); //don't split lines on child elements
				}
			}
			vars.absolute = absolute;
			element._isSplit = true;
			return;
		}
		_splitRawText(element, vars, wordStart, charStart);
	};

export class SplitText {

	constructor(element, vars) {
		if (!_coreInitted) {
			_initCore();
		}
		this.elements = _toArray(element);
		this.chars = [];
		this.words = [];
		this.lines = [];
		this._originals = [];
		this.vars = vars || {};
		if (_bonusValidated) {
			this.split(vars);
		}
	}

	split(vars) {
		if (this.isSplit) {
			this.revert();
		}
		this.vars = vars = vars || this.vars;
		this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;
		let i = this.elements.length,
			tag = vars.tag ? vars.tag : (vars.span ? "span" : "div"),
			wordStart = _cssClassFunc(vars.wordsClass, tag),
			charStart = _cssClassFunc(vars.charsClass, tag),
			origHeight, origWidth, e;
		//we split in reversed order so that if/when we position:absolute elements, they don't affect the position of the ones after them in the document flow (shifting them up as they're taken out of the document flow).
		while (--i > -1) {
			e = this.elements[i];
			this._originals[i] = e.innerHTML;
			origHeight = e.clientHeight;
			origWidth = e.clientWidth;
			_split(e, vars, wordStart, charStart);
			_setPositionsAfterSplit(e, vars, this.chars, this.words, this.lines, origWidth, origHeight);
		}
		this.chars.reverse();
		this.words.reverse();
		this.lines.reverse();
		this.isSplit = true;
		return this;
	}

	revert() {
		let originals = this._originals;
		if (!originals) {
			throw("revert() call wasn't scoped properly.");
		}
		this.elements.forEach((e, i) => e.innerHTML = originals[i]);
		this.chars = [];
		this.words = [];
		this.lines = [];
		this.isSplit = false;
		return this;
	}

	static create(element, vars) {
		return new SplitText(element, vars);
	}

}

SplitText.version = "3.0.0";

export { SplitText as default };
