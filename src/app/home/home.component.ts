import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService} from '../core/services/user.service';
import { Router} from '@angular/router';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private userSvc: UserService, private router: Router) { }

  ngOnInit() {
  }

  logOut(event: Event) {
        event.preventDefault();

        FB.getLoginStatus((response) => {
          if (response.status === 'connected') {
            FB.logout((r) => {
              this.userSvc.removeUser();
              this.router.navigate(['/account/login']);
            });
          } else {
              this.userSvc.removeUser();
              this.router.navigate(['/account/login']);
          }
        });
    }

    ngAfterViewInit(): void {
        $('html, body').width('100%').height('100%');
        $('body').css('font-family', '"Merriweather", "Helvetica Neue", Arial, sans-serif')
                 .css('webkit-tap-highlight-color', '#222222;')
                 .css('overflow', 'auto');

        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $('a.page-scroll').bind('click', function (event) {
            const $anchor = $(this);
            const offset = $($anchor.attr('href')).offset();
            if (offset) {
              $('html, body').stop().animate({
                scrollTop: (offset.top - 50)
              }, 1250, 'easeInOutExpo');
            }
            event.preventDefault();
        });

        // Highlight the top nav as scrolling occurs
        $('body').scrollspy({
            target: '.navbar-fixed-top',
            offset: 51
        });

        // Closes the Responsive Menu on Menu Item Click
        $('.navbar-collapse ul li a').click(() => {
            $('.navbar-toggle:visible').click();
        });

        // Offset for Main Navigation
        $('#mainNav').affix({
                offset: {
                    top: 100
                }
            });

        // Initialize and Configure Scroll Reveal Animation
        window['sr'] = ScrollReveal();
        window['sr'].reveal('.sr-icons', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 200);
        window['sr'].reveal('.sr-button', {
            duration: 1000,
            delay: 200
        });
        window['sr'].reveal('.sr-contact', {
            duration: 600,
            scale: 0.3,
            distance: '0px'
        }, 300);

        // Initialize and Configure Magnific Popup Lightbox Plugin
        // $('.popup-gallery').magnificPopup({
        //    delegate: 'a',
        //    type: 'image',
        //    tLoading: 'Loading image #%curr%...',
        //    mainClass: 'mfp-img-mobile',
        //    gallery: {
        //        enabled: true,
        //        navigateByImgClick: true,
        //        preload: [0, 1] // Will preload 0 - before current, and 1 after the current image
        //    },
        //    image: {
        //        tError: '<a href="%url%">The image #%curr%</a> could not be loaded.'
        //    }
        // });
    }

    goToSearchEvents(event: Event) {
        event.preventDefault();
    }
}
