/* Author:
chris guy Siteworx
Excerpts taken from reg mandarin site made by:
chaught, tshvueli Siteworx Inc.
*/

/*
* global vars
*/
var MIN_NON_MOBILE_SIZE = 720;
var MIN_NON_TABLET_SIZE = 967;
var facetedsearchObject;
/*
* setup for user agent use
*/
//share this code
var switchTo5x = true;
var __st_loadLate = true;

(function ($) {

    $(window).load(function () {
    	// add 'ipad' to the Modernizr object and relevant classname to the HTML element
        Modernizr.addTest('ipad', function () {
			return !!navigator.userAgent.match(/iPad/i);
        });

        $('body').opentextinit();
		resizeCustomerStoriesCarousel("carousel-content1");
        resizeCustStoriesVid();
        scrollTo();


        $(window).resize(function () {
            activeTab = $("ul#customer-story-tabs li.active").attr("data-rel");
            resizeCustomerStoriesCarousel(activeTab);
            checkShareThis();
            resizeCustStoriesVid();
			resetShareThisWidth();

        });

		function resetShareThisWidth() {
            var iconsSelector = '.breadcrumb-row .share-this-wrapper .share-this-icons';
            // if icons are not there, no need to reset width
            if ($(iconsSelector).length == 0) {
                return
            }

            // if icons are there, wait until share this processing has happened
            if ($(iconsSelector).children('span[st_processed]').length == 0 && window.shareTries++ < 10) {
                setTimeout(resetShareThisWidth, 500);
                return
            }

			$(iconsSelector).width(function() {
				var $t = $(this);
				var tw = 0;
				$t.children('span').each(function() { // collect and hardcode the width of each button...
					$(this).children('.stButton').width(function() { // ...it requires some diving
						return $(this).children('.stLarge').outerWidth(true);
					});
					$(this).width($(this).children('.stButton').outerWidth(true));
					tw += $(this).children('.stButton').outerWidth(true);
				});
				// and use that to calculate the wrapper width.
				tw = ($(window).width() >= MIN_NON_TABLET_SIZE) ? tw : Math.ceil(tw/2); // desktop has one row; mobile has two rows.
				return tw;
			});
		}

    }); // window.load

    /*
    * initialization
    * currently does the following
    * setup carousel, setup add this button, setup share button
    */
    function scrollTo() {
        if ($('body').find('.scroll-to').length > 0) {
            $('.scroll-to').click(function () {
                scrollToLink = $(this).attr('rel');
                $('html, body').animate({
                    scrollTop: $('#' + scrollToLink).offset().top
                }, 500);
                return false;
            });
        };
    };


    function resizeCustomerStoriesCarousel(tVal) { // Resize customer stories div to fill height of container
        //check who is bigger
        if($(window).width() >MIN_NON_MOBILE_SIZE){
            unifyHeights($("#" + tVal + " .customer-stories-component .content"));
        }else{
            $("#" + tVal + " .customer-stories-component .content").height("auto");
        }
    };

    function resizeCustStoriesVid() { // Resize customer stories div to fill height of container

        if ($(window).width() > MIN_NON_MOBILE_SIZE) {
            var height = $(".carousel-item").height();
            $('.carousel-container:not(.customer-video-carousel .carousel-container)').css('height', height + 'px');
        }
        else {
            var height = $(".carousel-item").height() + 60;
            $('.carousel-container:not(.customer-video-carousel .carousel-container)').css('height', (height) + 'px');

        }
    };

    function checkShareThis() { //function to avoid leaving share this active on browser expanding
        if ($(window).width() > 1150) {
            $('.campaigns .share-this-wrapper .share-this-icons').css('display', 'none');
        }
    };


    $('.right-rail .module').last().addClass('last');

    $.fn.opentextinit = function () {
        // copy utility-navigation to top nav for mobile
        $('div.utility-nav').clone().appendTo('nav.main-header-nav li.expandable.mobile-only');
            var userDisplayName = $.trim($('#otwww-portalUserDisplayName').text());
            if (userDisplayName != '') {
                $('.header-accountMenu > a').prepend(userDisplayName);
                $('.header-accountMenu li.mobile-nav-header > a').prepend(userDisplayName);
                $('.header-signIn').hide();
                $('.header-accountMenu').show();
            }else{
                $('.header-signIn').show();
                $('.header-accountMenu').hide();
            }

            if (isMobileView()) {
                $('.top-nav .mobile-hide').hide();
            }

        var $this = $(this);

        var home_speed = 1000,
    			home_timeout = 3000,
    			has_homecarousel = false,
                has_smallcarousel = false;

        // Homepage Carousel
		var carouselResizer = function() {
			$('#carousel-rotation li').width($('#carousel-rotation').width());
		}
        if ($this.find('#carousel-rotation').length > 0) {
            has_homecarousel = true;
            //little different for h1 version and p tag version
            $('.caption-title .black-bg').each(function(i){
                var textArray = $.trim($(this).text()).split(' '), newText = '';
                $(textArray).each(function(index, item){
                    newText += '<span>' + item + '</span>';
                });
                $(this).html(newText);
            });
            //don't need to do p tag

            if ($this.find('#carousel-rotation .carousel-item').length > 1) {
            //if ($this.find('#carousel-rotation div').length > 1) {
                $this.find('#carousel-rotation').cycle({
                    fx: 'scrollHorz',
                    speed: home_speed,
                     timeout: home_timeout,
					//timeout: 0, // for testing.
                    prev: '#carousel-prev',
                    next: '#carousel-next',
                    pager: '#pager',
                    slideResize: 0,
					width: '100%',
                    pause: 1,
					before: carouselResizer // we need to resize the slides OUR way.
                });
                $('#carousel-prev, #carousel-next, #pager-wrap-pos').show();

            }
            else {
                //showHomeCaption();
            }
            $('.pause-button').click(function() {
                var hiddenText = $(this).find('.hidden-text');
                if(hiddenText.text() == 'pause'){
                    $('#carousel-rotation').cycle('pause');
                    hiddenText.text('play');
                    $(this).addClass('paused');
                }else{
                    $('#carousel-rotation').cycle('resume'); 
                    hiddenText.text('pause');
                    $(this).removeClass('paused');
                }
            });
            
            // Pause rotation on PREV (Pat)
            if (window.location.hostname.split('.')[0] === 'wwwprodpreweb01') {
                $('#carousel-rotation').cycle('pause');
                $('#pager-wrap > .pause-button').addClass('paused').find('.hidden-text').text('play');
            }
        }

        function onAfter(curr, next, opts) {
            var caption = (opts.currSlide + 1) + ' of ' + opts.slideCount; $('#caption').html(caption);
            if ($(window).width() > MIN_NON_MOBILE_SIZE) {
                $('.customer-video-carousel .carousel-container').css('height', $(next).height());
            }
        }

        // Customer Stories Carousel
        if ($this.find('#customer-carousel-rotation').length > 0) {
            has_custcarousel = true;

            if ($this.find('#customer-carousel-rotation div').length > 1) {
                $this.find('#customer-carousel-rotation').cycle({
                    fx: 'fade',
                    speed: 'fast',
                    timeout: 0,
                    prev: '#customer-carousel-prev',
                    next: '#customer-carousel-next',
                    slideResize: false,
                    containerResize: false,
                    fit: 1,
                    after: onAfter
                });
            }
            else {
                //do nothing
            }
        }


        // initialize the Navigation's behavior.
        initNav();

        // initialize code to handle modals
        //if ($this.find('.contact-button').length > 0) {
            initModal();
        //}

        // initialize code to handle modals
        if ($this.find('.rating').length > 0) {
            initStarRating();
        }

        // initialize code to handle carousel swipes
        if ($this.find('#carousel-wrapper').length > 0) {
            initCarouselSwipe();
        }


        function carouselLogic() {
            // Hide/Show carousel items based on Tab Logic function
            $(".carousel-content").hide();
            $(".carousel-content:first").show();

            $("ul#mycarousel li").click(function () {

                $(".carousel-content").hide();
                var activeTab = $(this).attr("data-rel");
                $("#" + activeTab).fadeIn();
                $("#" + activeTab).addClass("active");

                $("ul#mycarousel li").removeClass("active");
                $(this).addClass("active");
                resizeCustomerStoriesCarousel(activeTab);
            });

        }

        function searchTabs() {
            // Hide/Show Search Results based on Tab Logic function
            $(".event").hide();
            $(".event:first").show();

            $(".events-search-tabs ul li").click(function () {

                $(".event").hide();
                var activeTab = $(this).attr("data-rel");
                $("#" + activeTab).fadeIn();
                $("#" + activeTab).addClass("active");

                $(".events-search-tabs ul li").removeClass("active");
                $(this).addClass("active");
            });

        }

        if ($this.find('.events').length > 1) {
            has_searchTabs = true;
            searchTabs();
        }
        else {
            //do nothing
        }

        // Customer Stories Carousel
        $this.find('.customer-stories-carousel').css('display', 'block');
        if ($this.find('.tabs3').length > 0) {
            tabLogic3();
        }

        if ($this.find('#tabs-accordian').length > 0) {
            tabLogic();
        }
        if ($this.find('.learn-more').length > 0) {
            tabLogic();
        }
        if ($this.find('.tabs2').length > 0) {
            tabLogic2();
        }

        //height fix for what we do page
        if ($this.find('.product-wrapper .product').length > 0) {
            unifyHeights($('.product.col-1-3 h3'));
            unifyHeights($('.product-wrapper .solution-suite'));
            unifyHeights($('.product-wrapper .detail-wrap'));
            $(window).resize(function () {
                if(this.resizeTOProduct) clearTimeout(this.resizeTOProduct);
                this.resizeTOProduct = setTimeout(function() {
                    unifyHeights($('.product.col-1-3 h3'));
                    unifyHeights($('.product-wrapper .solution-suite'));
                    unifyHeights($('.product-wrapper .detail-wrap'));
                }, 500);
            });
        }
        if ($this.find('.section-landing:not(.community) .product-wrapper').length > 0) {
            var nicesx = $('.product-wrapper').niceScroll({ touchbehavior: true });
        }

        //height fix for video landing page - featured playlists
        if ($this.find('.featured-playlists .playlist').length > 0) {
            unifyHeights($('.details'));
            $(window).resize(function () {
                if(this.resizeTOPlaylist) clearTimeout(this.resizeTOPlaylist);
                this.resizeTOPlaylist = setTimeout(function() {
                    unifyHeights($('.details'));
                }, 500);
            });
        }
        if ($this.find('.featured-playlists').length > 0) {
            var nicesx = $('.featured-playlists').niceScroll({ touchbehavior: true });
        }
        //height fix for what we do page
        if ($this.find('.columns').length > 0) {
            $this.find('.columns').each(function( index ) {
                unifyHeights($(this).find('h3'));
            });

            $(window).resize(function () {
                if(this.resizeColumnsH3) clearTimeout(this.resizeColumnsH3);
                this.resizeColumnsH3 = setTimeout(function() {
                    $this.find('.columns').each(function( index ) {
                        unifyHeights($(this).find('h3'));
                    });
                }, 500);
            });
        }
        //check if we are on a search results and pagination page
        if($this.find('.video-grid').length > 0 || $this.find('.customer-stories-search-results').length > 0 || $this.find('.js-faceted-results').length > 0){
            // send template and settings to facet maker
            facetedsearchObject = new $.FacetingItem();
            facetedsearchObject.facetelize(settings);
        }
        //check if upcoming events search is on page
        if($this.find('.upcoming .events-results-list').length > 0){
            // send template and settings to facet maker
            var upcomingEventsFacets = new $.FacetingItem();
            upcomingEventsFacets.facetelize(settingsUpcoming);
        }
        //check if recorded events search is on page
        if($this.find('.recorded .events-results-list').length > 0){
            // send template and settings to facet maker
            var recordedEventsFacets = new $.FacetingItem();
            recordedEventsFacets.facetelize(settingsRecorded);
        }

		// let's isolate our Internet Explorer hacks to minimize agony...
		if ($('.ie7').length>0) {
			// Customer Stories page et al.
			unifyHeights($('.ie7 .customer-video-carousel .col-1-3'));
			unifyHeights($('.ie7 .video-grid li>.context'));
		}
        // initialize search facet js if module is on page
        if ($this.find('.search-facets').length > 0) {
            initSearchFacets();
        }

        //check query params for tabs
        var tabsQueryValue = getParameterByName("tab");
        if(tabsQueryValue != null){
            //subtrack one as we are on a base 0 array
            tabsQueryValue -= 1;
            //find tabs and make sure the number asked for isn't larger than available
            //if larger than available do nothing
            var tabsSelector = $('.tabs, .tabs2, .tabs3, .events-search-tabs');
            var tabsLiSelector = $('.tabs li, .tabs2 li, .tabs3 li, .events-search-tabs li');
            if(tabsSelector.length == 1){
                if(tabsLiSelector.length >= tabsQueryValue){
                    tabsLiSelector[tabsQueryValue].click();
                }
            }
           
            if(tabsSelector.length > 1){
                if($(tabsSelector[0]).find('li').length >= tabsQueryValue){
                    $(tabsSelector[0]).find('li')[tabsQueryValue].click();
                }
            }
        }

        $('.js-showhidetext-trigger a').on('click', function(e){
            e.preventDefault();
            $(this).closest('li').find('.js-showhidetext-target').toggle();
        });
    }
    //get query parameter by name
    function getParameterByName(name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }
    /*
    *   rate a video js
    */

    function initStarRating() {
        $('.rating li a').click(function (e) {
            var starRatingClass = $(this).attr('class');
            if (starRatingClass.indexOf('-star') >= 0) {
                var starRatingNum = starRatingClass.match(/([0-9]+)-star/)[1];
                $.post('http://google.com', starRatingNum); //placeholder for sending data
            }
        });

        // on hover we add the active class to show the stars
        $('.rating li').hover(function () {
            var starRatingClass = $(this).find('a').attr('class');
            if (starRatingClass.indexOf('-star') >= 0) {
                var starRatingNum = starRatingClass.match(/([0-9]+)-star/)[1];
                for (; starRatingNum > 0; starRatingNum--) {
                    $('.' + starRatingNum + '-star').addClass('active');
                }
            }
            else {
                // couldn't find the proper class on the star rating element
                //console.log('Missing Class for Star Rating module.');
            }

        }, function (e) {
            $('.rating li').find('.active').removeClass('active');
        });
    }

    /*
    *   contact us modal js
    */

    function initModal() {
        
        $('.contact-button, .contact-link').click(function (e) {
            // if not in mobile, display our modal
            if ($(window).width() >= MIN_NON_TABLET_SIZE) {
                e.preventDefault();
                var width = $('.final-modal-contents').css('width');
                var height = $('.final-modal-contents').css('height');
                
                // grab the modal code and move it next to the overlay.
                $('.final-modal-contents').html($(this).parent().find('.modal-contents').html());
                
                $('.modal-overlay').show();
                $('.final-modal-contents').contents().hide();
                $('.final-modal-contents').css('height', '100px').css('width', '100px').show().animate({ height: height }, 400).animate({ width: width }, 400, function () {
                    $('.final-modal-contents').contents().fadeIn();
                    // we anchor the close functionality only once the contents are already there.
                    $('.close').click(function (event) {
                        event.preventDefault();
                        $('.final-modal-contents').hide();
                        $('.modal-overlay').hide();
                    });
                });
            }
        });
        
        $('.modal-overlay').click(function () {
            $('.final-modal-contents').hide();
            $('.modal-overlay').hide();
        });
        
        //modal popup from search results
        //for video and audio links
        $(document).on('click','.audioLightBox, .videoLightBox', function (e) {
            var jsLinkText = $(this).find(".hidden").text();
            e.preventDefault();
            var avWidth = 640;
            var avHeight = 360;
            var avRight = Math.round(($(window).width() - avWidth) * 0.5);
            //var width = ($(window).width()) * 0.5;
            //var height = ($(window).height()) * 0.5;
            
            $('.modal-overlay').show();
            
            // grab the modal code and move it next to the overlay.
            $('.final-modal-contents').html('<a class="close" href="#" style="display: block;">Close</a>');
            
            $('.modal-overlay').show();
            //$('.final-modal-contents').css('height', 'auto').css('width', 'auto').css('right', '28%').show();
            $('.final-modal-contents').css('height', avHeight + 'px').css('width', avWidth + 'px').css('right', avRight + 'px').show();
            // we anchor the close functionality only once the contents are already there.
            $('.close').click(function (event) {
                event.preventDefault();
                $('.final-modal-contents').hide();
                $('.modal-overlay').hide();
            });
            $.getScript( jsLinkText, function( data, textStatus, jqxhr ) {
//                  console.log( data ); // Data returned
//                  console.log( textStatus ); // Success
//                  console.log( jqxhr.status ); // 200
//                  console.log( "Load was performed." );
                $('.final-modal-contents').append(objectStart + param1 + param2 + param3 + embed + objectEnd);
            });
        });
        
    }


    /*
    *   Search Facets js
    */

    function initSearchFacets() {

        // detect click and add or remove the active class with some fancy animations
        $('.vlist h3').click(function () {

            var activeElement = $(this).parent();
            var iconElement = $(this).children("span");
            var h3element = $(this);

            // clicked on a +, hide the sub ul
            if (activeElement.hasClass('active')) {
                iconElement.toggleClass('icon-minus icon-plus');
                activeElement.find('.facets').slideUp(function () {
                    activeElement.removeClass('active');
                });
            }
            else {
                activeElement.find('.facets').hide();
                iconElement.toggleClass('icon-plus icon-minus');
                activeElement.addClass('active').find('.facets').slideDown();

            }
        });
        if($(window).width() <= MIN_NON_TABLET_SIZE){
            $('.vlist h3').click();
         }
    }

    /*
    *   Customer Stories Landing expand colapse on mobile
    */

    function hideshow () {
        $('.customer-stories-chart h2').click(function () {
            var activeElement = $(this).parent();
            var iconElement = $(this).children("span");
            var h2element = $(this);

            if(activeElement.hasClass('active')) {
                iconElement.toggleClass('icon-minus icon-plus');
                activeElement.find('div').slideUp(function() {
                    activeElement.removeClass('active');
                });
            }
            else {
                activeElement.find('div').hide();
                iconElement.toggleClass('icon-plus icon-minus');
                activeElement.addClass('active').find('div').slideDown();
            }
        });
    }

    if($(window).width() <= MIN_NON_TABLET_SIZE) {
            hideshow();
    }

    /*
    *   Navigation js
    */

    function initNav() {

        //activate mobile nav open button
        $('.mobile-nav-button').on('click', function () {
            var link = $(this);
            if (link.hasClass("active")) {
                //check if in table size mode
                if (($(window).width() >= MIN_NON_MOBILE_SIZE && $(window).width() <= MIN_NON_TABLET_SIZE) || Modernizr.ipad) {
                    $('.main-header-nav').animate({ right: '-40%' }, 500, function () {
                        link.removeClass("active").parent().parent().find('.main-header-nav > ul').css('left', '0px').find('.active').removeClass('active');
                        // fix the css (right: 0) so it's not broken for other breakpoints (leave it the way you found it basically)
                        $('.main-header-nav').css('right', 'inherit').hide().css('height', 'inherit');
                    });
                }
                else {
                    $('.main-header-nav').hide();
                    link.removeClass("active").parent().parent().find('.main-header-nav > ul').css('left', '0px').find('.active').removeClass('active');
                }

            }
            else {
                $('.search').removeClass('active');
                $('.mobile-search-button').removeClass('active');
                //check for tablet size
                if (($(window).width() >= MIN_NON_MOBILE_SIZE && $(window).width() <= MIN_NON_TABLET_SIZE) || Modernizr.ipad) {
                    $('.main-header-nav').css('right', '-400px').css('height', $(document).height()).show().animate({ right: '0' }, 500, function(){
                        $('.main-header-nav').css('right', '0');
                    });
                }
                else {
                    $('.main-header-nav').show();

                }
                link.addClass("active");
            }
        });
        //check on resize to show nav
        $(window).resize(function () {
            if(Modernizr.ipad) {
                e.preventDefault();
            }
            //if(this.resizeTO) clearTimeout(this.resizeTO);
            //this.resizeTO = setTimeout(function() {
                showNav();
            //}, 500);
        });
        // register the click event, but only operate on it for certain conditions
       $('li.expandable a').on('click', function (e) {
            if ($(window).width() <= MIN_NON_TABLET_SIZE || Modernizr.ipad) {
                if ($(this).parent().hasClass('expandable')) {
                    e.preventDefault();
                    // since the absolute positioning is integral to the mobile view, we use it to detect mobile.
                    var li_element_clicked = $(e.target).parent();
                    if ($('.main-header-nav').css('position') == 'absolute' && li_element_clicked.hasClass('expandable')) {

                        // first add the active class
                        li_element_clicked.addClass('active').siblings('.active').removeClass('active').find('.active').removeClass('active');

                        // animate transition when drilling deeper
                        var newLeft = $('.main-header-nav > ul').css('left').replace(/[^-\d\.]/g, '') - li_element_clicked.outerWidth();
                        $('.main-header-nav > ul').animate({ left: newLeft + 'px' }, 500);
                        return false;
                    }
                }else{

                }
            }
        });

        // register the hover event for desktop
		var navDelayTime = 120; // milliseconds
		var fadeTime = 80; // milliseconds
		// parent element
		$('.main-header-nav>ul>li').hoverIntent({
			over:hoverOverMain,
			out: hoverOutMain,
			timeout: navDelayTime,
			interval: 80 // slightly speed up the polling to reduce flickering
		});
        function hoverOverMain(){
            if ($(window).width() >= MIN_NON_TABLET_SIZE || (($(window).width() >= MIN_NON_MOBILE_SIZE) && ($('header.campaign').length > 0))){
            // if you don't want the fade effect, uncomment the following line...
			//$(this).addClass('active');
			// and remove the following two lines.
			    var $t = $(this);
			    $(this).find('.nav-wrapper,.nav-wrapper>ul.four-col,.nav-wrapper>ul.two-col').fadeIn(80,function(){
				    $t.addClass('active');
			    });
			    // can't use the 'first' stateholder trick that the subnav uses
			    // because then we can't tell when to hide the last-viewed menu.
            }
        }
        function hoverOutMain(){
            if ($(window).width() >= MIN_NON_TABLET_SIZE || (($(window).width() >= MIN_NON_MOBILE_SIZE) && ($('header.campaign').length > 0))){
                // if you don't want the fade effect, uncomment the following line...
			    //$(this).removeClass('active');
			    // and remove the following two lines.
			    var $t = $(this);
			    $(this).find('.nav-wrapper,.nav-wrapper>ul.four-col,.nav-wrapper>ul.two-col').fadeOut(80,function(){
				    $t.removeClass('active');
			    });
			    if ($(this).hasClass('has-subnav')) {
				    // reset the 'first' pointer back to the first element.
				    $(this).find('.nav-wrapper>ul>li.expandable').removeClass('first').eq(0).addClass('first');
			    }
            }

        }
        $('.main-header-nav>ul>li').on('focusin',hoverOverMain);
        $('.main-header-nav>ul>li').on('focusout',hoverOutMain);
		// subnav element
		$('.main-header-nav>ul>li.has-subnav>.nav-wrapper>ul>li.expandable').hoverIntent({
			over: hoverOverSub,
			out: hoverOutSub,
			timeout: navDelayTime
		});
        function hoverOverSub(){
            if ($(window).width() >= MIN_NON_TABLET_SIZE || (($(window).width() >= MIN_NON_MOBILE_SIZE) && ($('header.campaign').length > 0))){
                // to keep the pointer and the menu from flicking back to
			    // the first item in the list every time the mouse moves,
			    // we'll use the 'first' classname as a state holder.
			    $(this).siblings('li.expandable').removeClass('first'); // ugh
			    $(this).addClass('active first');
			    $(this).find('.nav-wrapper,.nav-wrapper .expandable').addClass('active');
            }
        }
        function hoverOutSub(){
            if ($(window).width() >= MIN_NON_TABLET_SIZE || (($(window).width() >= MIN_NON_MOBILE_SIZE) && ($('header.campaign').length > 0))){
                $(this).removeClass('active');
			    $(this).find('.nav-wrapper,.nav-wrapper .expandable').removeClass('active');
            }
        }
        $('.main-header-nav>ul>li.has-subnav>.nav-wrapper>ul>li.expandable').on('focusin',hoverOverSub);
        $('.main-header-nav>ul>li.has-subnav>.nav-wrapper>ul>li.expandable').on('focusout',hoverOutSub);
        // handle a click of the "back" button
        $('.mobile-nav-header > a').click(function () {
            // double check that we're in mobile.
            if ($('.main-header-nav').css('position') == 'absolute') {

                //animate transition out
                var newLeft = parseInt($('.main-header-nav > ul').css('left').replace(/[^-\d\.]/g, '')) + parseInt($(this).closest('.active').outerWidth());
                var eventCreator = $(this);

                $('.main-header-nav > ul').animate({ left: newLeft + 'px' }, 500, function () {
                    //animation is complete, remove the active classes after the animation
                    eventCreator.closest('li.active').removeClass('active').find('.active').removeClass('active');
                });
            }

        });

        // on click toggle utility nav
        $('.utility-nav > ul li:not(.utility-nav > ul li li)').click(function (e) {
            if ($('.main-header-nav').css('position') != 'absolute') {
                if ($(e.target).closest('.expandable').hasClass('active')) {
                    $(e.target).closest('.expandable').removeClass('active');
                }
                else {
                    $('.utility-nav').find('.active').removeClass('active');
                    $(e.target).closest('.expandable').addClass('active');
                }
            }
        });
        // on mouseout also hide the utility nav
        $('.utility-nav > ul > li ul').mouseleave(function (e) {
            if ($('.main-header-nav').css('position') != 'absolute') {
                $('.utility-nav').find('.active').removeClass('active');
            }
        });


        // on click of search icon make menu appear
        $('.search-icon').click(function () {
            if ($('.search').hasClass('active')) {
                //check for table mode
                if (($(window).width() >= MIN_NON_MOBILE_SIZE && $(window).width() <= MIN_NON_TABLET_SIZE) || Modernizr.ipad) {
                    $('.search').css('right', '0%').animate({ right: '-40%' }, 500, function () {
                        $('.search').removeClass('active').css('right', 'inherit');
                    });

                }
                else {
                    $('.search').removeClass('active')
                }
                $('.mobile-search-button').removeClass('active');
            }
            else {
                if (($(window).width() >= MIN_NON_MOBILE_SIZE && $(window).width() <= MIN_NON_TABLET_SIZE) || Modernizr.ipad) {
                    $('.search').css('right', '-40%').addClass('active').animate({ right: '0%' }, 500, function () {
                        $('.search').css('right', '0px'); //leave it like you found it
                    });
                }
                else {
                    $('.search').addClass('active');
                }

                $('.mobile-search-button').addClass('active');
                $('.mobile-nav-button').removeClass('active');
                if ($('.main-header-nav').css('position') == 'absolute') {
                    $('.main-header-nav').hide();
                }
            }
        });

        // make dropdown slide in or out for the search
        $('.utility-nav a.dropdown').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.utility-nav .hidden-list').slideUp(500, function () {
                    $('.utility-nav .hidden-list').addClass('active');
                });
            }
            else {
                $(this).addClass('active');
                $('.utility-nav .hidden-list').slideDown(500, function () {
                    $('.utility-nav .hidden-list').removeClass('active');
                });
            }
        });
        // make dropdown slide in or out for the search
        $('.left-nav a.dropdown').click(function () {
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
                $('.left-nav .hidden-list').slideUp(500, function () {
                    $('.left-nav .hidden-list').addClass('active');
                });
            }
            else {
                $(this).addClass('active');
                $('.left-nav .hidden-list').slideDown(500, function () {
                    $('.left-nav .hidden-list').removeClass('active');
                });
            }
        });
        //set nav to proper color
        var activeItem = $(".sub-nav .active");
        activeItem.parent().parent().css("background-color", activeItem.css("background-color"));
        if($('.left-nav').length > 0){
        //make sure left nav continues to show up on desktop
            $(window).resize(function () {
                if(this.leftNavDisplay) clearTimeout(this.leftNavDisplay);
                this.leftNavDisplay = setTimeout(function() {
                    if($(window).width() > MIN_NON_TABLET_SIZE){
                        $('.left-nav .hidden-list').show();
                    }
                }, 500);
            });
        }

        // close search box
        $('.close-icon').click(function () {
            $('.search').removeClass('active');
        });
    }


    /*
    *   Carousel Swipe js
    */

    function initCarouselSwipe() {
        $("#carousel-wrapper").touchwipe({
            wipeLeft: function () {
                $('#carousel-rotation').cycle('next');
            },
            wipeRight: function () {
                $('#carousel-rotation').cycle('prev');
            },
            min_move_x: 20,
            preventDefaultEvents: true
        });
    }
    
})(jQuery);             // End (document).ready

/*
* functions to call to make sure jquery is ready before running
*/
function checkJquery() {
    if (window.jQuery) {
        if ($('.share-link-1').length > 0) {
            loadCustomShares();
        }
    } else {
        window.setTimeout(checkJquery, 100);
    }
}
checkJquery();
/*
* this function is a delay so you don't call the same function a bunch of times in a row
* an example use is to delay a call from resize of a page
*/
var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();
/*
* is the function to call for the what we do page and making the columns near the top the same height
*/
function unifyHeights(item) {
    var maxHeight = 0;
    item.css('height', 'auto');
    item.each(function () {
        var height = $(this).outerHeight();
        if (height > maxHeight) {
            maxHeight = height;
        }
    });
    item.css('height', maxHeight);
}

/*
* see if we are now out of mobile mode and need to show nav in case it is hidden
*/
function showNav() {
    $('.mobile-nav-button').removeClass('active');
    $('.mobile-search-button').removeClass('active');
    //if (($(window).width() >= MIN_NON_TABLET_SIZE && !Modernizr.ipad) || ($(window).width()<MIN_NON_TABLET_SIZE && $('header.ot, header.campaign').length==0)) {
    //if ($(window).width() > MIN_NON_TABLET_SIZE && !Modernizr.ipad) {
    if ($(window).width() > MIN_NON_MOBILE_SIZE) {
        $('.main-header-nav').show().css({'height':'', 'right':''});
    }
    else {
        $('.main-header-nav').hide().find('.active').removeClass('active');
        $('.main-header-nav > ul').css('left', '0px');
    }
    showDisplayName();
}
/*
*show display name?
*/
function showDisplayName(){
    var userDisplayName = $.trim($('#otwww-portalUserDisplayName').text());
    if (userDisplayName != '') {
        $('.header-signIn').hide();
        $('.header-accountMenu').show();
    }else{
        $('.header-signIn').show();
        $('.header-accountMenu').hide();
    }
     if(isMobileView()){
        $('.top-nav .mobile-hide').hide();
     } else {
        $('.top-nav .show-cookie-settings').show();
     }
}
/*
*   is the hide unhide logic for the tabs and when they turn into accordians in mobile
*	lightly refactored oct 2013 to support multiple tabsets on a single page without changing existing markup.
*	every tab will still have to have a unique ID because that's how the DOM works...
*	...but this should make for a little less hoops-jumping.
*/
function tabLogic() {
	// tabbed content
	// http://www.entheosweb.com/tutorials/css/tabs.asp
	$('.tab-container').each( function() {
		var $t = $(this); // the wrapper of all the tabbed content
		var $tabset = $t.find('.tab-content'); // the set of chunks of tabbed content
		var $tablinkset = $t.siblings('ul.tabs').find('li'); // the set of buttons to hide/reveal
		var $tabdrawerset = $t.find('.tab-drawer-heading'); // the set of buttons to fold/unfold
		$tabset.hide();
		if (!$t.find('.tab-drawer-heading').is(':visible')) {
			$tabset.eq(0).show();
		}
		// when in tab (desktop) mode
		$tablinkset.click( function() {
			$tabset.hide().removeClass('active');
			$tablinkset.removeClass('active');
			$(this).addClass('active');
			var activeTab = $(this).attr('data-rel');
			$("#" + activeTab).fadeIn().addClass('active');
			$t.find(".tab-drawer-heading").removeClass("d-active");
			$t.find(".tab-drawer-heading[data-rel^='" + activeTab + "']").addClass("d-active");
		});
		// when in drawer (mobile) mode
		$tabdrawerset.click( function() {
			$tabset.hide().removeClass('active');
			if ($(this).hasClass('d-active')) {
				$tabdrawerset.removeClass("d-active").find('span.icon-minus').removeClass('icon-minus').addClass('icon-plus');
				$("ul.tabs li").removeClass("active")
				$tablinkset.removeClass('active');
			} else {
				var d_activeTab = $(this).attr("data-rel");
				$("#" + d_activeTab).fadeIn();
				$tabdrawerset.removeClass("d-active").find('span.icon-minus').removeClass('icon-minus').addClass('icon-plus');
				$(this).addClass("d-active").find('span.icon-plus').removeClass('icon-plus').addClass('icon-minus');
				$tablinkset.removeClass("active");
				$tablinkset.filter("[data-rel^='" + d_activeTab + "']").addClass("active");
				// animate scrolling to the section we just opened
				$('html, body').animate({
					scrollTop: $("#" + d_activeTab).offset().top - $tabdrawerset.outerHeight()
				}, 750);
			}
		});
		// Extra class "tab-last" to add border to right side of last tab
		$tablinkset.last().addClass("tab-last");
	});
}
/*
*   tabs2 logic for pages like product details page that uses 2col or 3col layout
*   eventually this will contain more complex functionality for more tabs that can be displayed in it's width
*/
function tabLogic2() {
    $(".tabs2-content").hide();
    $(".tabs2-content:first").show();

    /* if in tab mode */
    $("ul.tabs2 li:not('.controls')").click(function () {
        // console.log("clickity");
        $(".tabs2-content").hide();
        var activeTab = $(this).attr("data-rel");
        //console.log(activeTab);
        $("#" + activeTab).fadeIn();

        $("ul.tabs2 li").removeClass("active");
        $(this).addClass("active");
    });

}
/*
* tabs3 is for customer carousel (no longer carousel) section
*/
function tabLogic3() {
    $(".carousel-content").hide();
    $(".carousel-content:first").show();
    $("ul.tabs3 li:first").addClass("active");

    /* if in tab mode */
    $("ul.tabs3 li").click(function () {
        // console.log("clickity");
        $(".carousel-content").hide();
        var activeTab = $(this).attr("data-rel");
        //console.log(activeTab);
        $("#" + activeTab).fadeIn();

        $("ul.tabs3 li").removeClass("active");
        $(this).addClass("active");
    });

}

//function resizeTabs2(){
//    var availableWidth = $('.main-content').width();
//    var calcCurrentWidth = 0;
//    var activeItem = $("ul.tabs2 li.active");
//    var firstViewable = $("ul.tabs2 li:visible:not('.controls')").first();
//    var firstNumber = parseInt(firstViewable.attr("data-rel").replace('tab',''));
//    var viewableArray = $("ul.tabs2 li:visible:not('.controls')");
//    var lastItem = $("ul.tabs2 li:not('.controls')").last();
//    var lastNumber = parseInt($("ul.tabs2 li:not('.controls')").last().attr("data-rel").replace('tab',''));

//
//    viewableArray.each(function(i){
//        calcCurrentWidth += $(this).width();
//        if($(this).hasClass('active')){
//            activeItem = $(this);
//        }
//    });
//    //console.log(calcCurrentWidth);
//    debugger;
//    if(availableWidth >= calcCurrentWidth){
//        //do nothing all is well
//        $("ul.tabs2 .controls").hide();
//    }else{
//        if(firstNumber > 1){
//            //need to show left
//            $("ul.tabs2 .controls.left").show();
//            //check if last is in viewable
//            if($.inArray(lastItem, viewableArray)){
//                //don't need to show right
//                $("ul.tabs2 .controls.right").hide();
//            }else{
//                //need to show right;
//                $("ul.tabs2 .controls.right").show();
//            }
//        }else{
//            //don't show left
//            $("ul.tabs2 .controls.left").hide();
//        }
//    }
////    if(activeItem != null){
////        if(firstNumber > 1){
////            $("ul.tabs2 .controls)").show();
////        }
////    }
//}
// Grayscale w canvas method
function grayscale(src) {
    if (Modernizr.canvas) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var imgObj = new Image();
        imgObj.src = src;
        canvas.width = imgObj.width;
        canvas.height = imgObj.height;
        ctx.drawImage(imgObj, 0, 0);
        var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var y = 0; y < imgPixels.height; y++) {
            for (var x = 0; x < imgPixels.width; x++) {
                var i = (y * 4) * imgPixels.width + x * 4;
                var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
                imgPixels.data[i] = avg;
                imgPixels.data[i + 1] = avg;
                imgPixels.data[i + 2] = avg;
            }
        }
        ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
        return canvas.toDataURL();
    }
}
/*
* change timezone code
*/
var tz = {
    "ACDT": { "fullname": "Australian Central Daylight Time", "offset": "+10:30" },
    "ACST": { "fullname": "Australian Central Standard Time", "offset": "+9:30" },
    "ADT": { "fullname": "Atlantic Daylight Time", "offset": "-3:00" },
    "AEDT": { "fullname": "Australian Eastern Daylight Time", "offset": "+11:00" },
    "AEST": { "fullname": "Australian Eastern Standard Time", "offset": "+10:00" },
    "AKDT": { "fullname": "Alaska Daylight Time", "offset": "-8:00" },
    "AKST": { "fullname": "Alaska Standard Time", "offset": "-9:00" },
    "AST": { "fullname": "Atlantic Standard Time", "offset": "-4:00" },
    "AWDT": { "fullname": "Australian Western Daylight Time", "offset": "+9:00" },
    "AWST": { "fullname": "Australian Western Standard Time", "offset": "+8:00" },
    "BST": { "fullname": "British Summer Time", "offset": "+1:00" },
    "CAT": { "fullname": "Central Africa Time", "offset": "+2:00" },
    "CDT": { "fullname": "Central Daylight Time", "offset": "-5:00" },
    "CEDT": { "fullname": "Central European Daylight Time", "offset": "+2:00" },
    "CEST": { "fullname": "Central European Summer Time", "offset": "+2:00" },
    "CET": { "fullname": "Central European Time", "offset": "+1:00" },
    "CST": { "fullname": "Central Summer(Daylight) Time", "offset": "+10:30" },
    "CST": { "fullname": "Central Standard Time", "offset": "+9:30" },
    "CST": { "fullname": "Central Standard Time", "offset": "-6:00" },
    "CXT": { "fullname": "Christmas Island Time", "offset": "+7:00" },
    "EDT": { "fullname": "Eastern Daylight Time", "offset": "-4:00" },
    "EEDT": { "fullname": "Eastern European Daylight Time", "offset": "+3:00" },
    "EEST": { "fullname": "Eastern European Summer Time", "offset": "+3:00" },
    "EET": { "fullname": "Eastern European Time", "offset": "+2:00" },
    "EST": { "fullname": "Eastern Summer(Daylight) Time", "offset": "+11:00" },
    "EST": { "fullname": "Eastern Standard Time", "offset": "+10:00" },
    "EST": { "fullname": "Eastern Standard Time", "offset": "-5:00" },
    "GMT": { "fullname": "Greenwich Mean Time", "offset": "+0:00" },
    "HAA": { "fullname": "Heure Avance de l'Atlantique", "offset": "-3:00" },
    "HAC": { "fullname": "Heure Avance du Centre", "offset": "-5:00" },
    "HADT": { "fullname": "Hawaii-Aleutian Daylight Time", "offset": "-9:00" },
    "HAE": { "fullname": "Heure Avance de l'Est", "offset": "-4:00" },
    "HAP": { "fullname": "Heure Avance du Pacifique", "offset": "-7:00" },
    "HAR": { "fullname": "Heure Avance des Rocheuses", "offset": "-6:00" },
    "HAST": { "fullname": "Hawaii-Aleutian Standard Time", "offset": "-10:00" },
    "HAT": { "fullname": "Heure Avance de Terre-Neuve", "offset": "-2:30" },
    "HAY": { "fullname": "Heure Avance du Yukon", "offset": "-8:00" },
    "HNA": { "fullname": "Heure Normale de l'Atlantique", "offset": "-4:00" },
    "HNC": { "fullname": "Heure Normale du Centre", "offset": "-6:00" },
    "HNE": { "fullname": "Heure Normale de l'Est", "offset": "-5:00" },
    "HNP": { "fullname": "Heure Normale du Pacifique", "offset": "-8:00" },
    "HNR": { "fullname": "Heure Normale des Rocheuses", "offset": "-7:00" },
    "HNT": { "fullname": "Heure Normale de Terre-Neuve", "offset": "-3:30" },
    "HNY": { "fullname": "Heure Normale du Yukon", "offset": "-9:00" },
    "IST": { "fullname": "Irish Summer Time", "offset": "+1:00" },
    "MDT": { "fullname": "Mountain Daylight Time", "offset": "-6:00" },
    "MESZ": { "fullname": "Mitteleuropische Sommerzeit", "offset": "+2:00" },
    "MEZ": { "fullname": "Mitteleuropische Zeit", "offset": "+1:00" },
    "MST": { "fullname": "Mountain Standard Time", "offset": "-7:00" },
    "NDT": { "fullname": "Newfoundland Daylight Time", "offset": "-2:30" },
    "NFT": { "fullname": "Norfolk (Island) Time", "offset": "+11:30" },
    "NST": { "fullname": "Newfoundland Standard Time", "offset": "-3:30" },
    "PDT": { "fullname": "Pacific Daylight Time", "offset": "-7:00" },
    "PST": { "fullname": "Pacific Standard Time", "offset": "-8:00" },
    "UTC": { "fullname": "Coordinated Universal Time", "offset": "+0:00" },
    "WEDT": { "fullname": "Western European Daylight Time", "offset": "+1:00" },
    "WEST": { "fullname": "Western European Summer Time", "offset": "+1:00" },
    "WET": { "fullname": "Western European Time", "offset": "+0:00" },
    "WST": { "fullname": "Western Summer(Daylight) Time", "offset": "+9:00" },
    "WST": { "fullname": "Western Standard Time", "offset": "+8:00" }
}

function getEventDate(formDateField) {
    // I'm aware of Date.parse; my notes suggest that the Date object
    // cannot be trusted, so i'm parsing it myself.

    // Expected format: YYYY-MM-DDThh:mm:ss.zzz
    year = formDateField.substring(0, 4);
    month = formDateField.substring(5, 7) - 1; // Date objects assume January's the 0th month :-P
    day = formDateField.substring(8, 10);
    hours = formDateField.substring(11, 13);
    minutes = formDateField.substring(14, 16);
    seconds = formDateField.substring(17, 19);

    return new Date(year, month, day, hours, minutes, seconds);
}

function getTimeDifference(myTZ, eventTZ) {
    return tzOffsetToMsec(myTZ) - tzOffsetToMsec(eventTZ);
}

function tzOffsetToMsec(tz) {
    var offset_dir = (tz.charAt(0) == "-") ? -1 : 1;
    var time = tz.substring(1, 6).split(/:/)

    var hour = time[0];
    var min = time[1];

    var mins_in_hour = 60;
    var secs_in_min = 60;
    var ms_in_sec = 1000;

    return ((hour * mins_in_hour * secs_in_min * ms_in_sec) + (min * secs_in_min * ms_in_sec)) * offset_dir; // in msec
}

function adjustTime(startDate, endDate, myTZ, eventTZ, elementOnPage) {
    
    if (myTZ === 'All') {
        $('#' + elementOnPage).empty().removeClass('active');
        return;
    }
    
    startDate = getEventDate(startDate).getTime(); // convert to msec
    endDate = getEventDate(endDate).getTime(); // convert to msec
    timeDifference = getTimeDifference(myTZ, tz[eventTZ].offset);
    adjustedStartEventDate = new Date(startDate + timeDifference);
    adjustedEndEventDate = new Date(endDate + timeDifference);
    
    //$(elementOnPage).innerHTML = formatDate( adjustedStartEventDate, adjustedEndEventDate );
    //Element.show(elementOnPage);
    $('#' + elementOnPage).show().html(formatDate(adjustedStartEventDate, adjustedEndEventDate));
    $('#' + elementOnPage).addClass('active');
}

function formatDate(startDateObj, endDateObj) {
    var month = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    if (startDateObj.getFullYear() == endDateObj.getFullYear() && startDateObj.getMonth() == endDateObj.getMonth() && startDateObj.getDate() == endDateObj.getDate()) {
        return new Array(month[startDateObj.getMonth()], " ", startDateObj.getDate(), ", ", startDateObj.getFullYear(), "<br />", sanitizeTime(startDateObj), " through ", sanitizeTime(endDateObj)).join('');
    } else {
        return new Array(month[startDateObj.getMonth()], " ", startDateObj.getDate(), ", ", startDateObj.getFullYear(), " at ", sanitizeTime(startDateObj), " through ", month[endDateObj.getMonth()], " ", endDateObj.getDate(), ", ", endDateObj.getFullYear(), " at ", sanitizeTime(endDateObj)).join('');
    }
}

function sanitizeTime(dateObj) {
    ampm = "AM"
    h = dateObj.getHours();
    m = dateObj.getMinutes();

    if (h == 0) {
        h = 12;
    } else if (h == 12) {
        ampm = "PM";
    } else if (h > 12) {
        ampm = "PM";
        h = h - 12;
    }

    if (m < 10) {
        m = "0" + m;
    }

    return h + ":" + m + " " + ampm;
}
/*
*   end timezone code
*/






/* ----------------------------------------------------------------- */


// Global
window.OT_API = window.OT_API || {};

// Path to script files
window.OT_API.fileSource = window.OT_API.fileSource || '/file_source/OpenText/Scripts/';

// Google Tracking
window.OT_API.gaqTracking = function($obj) {
    var gaqType   = $obj.attr('data-gaq-type'),
        gaqName   = $obj.attr('data-gaq-name'),
        gaqAction = $obj.attr('data-gaq-action') || 'clicked';
        
    if (typeof _gaq !== 'undefined' && (gaqType !== undefined && gaqName !== undefined)) {
        _gaq.push(['_trackEvent', gaqType, gaqAction, gaqName]);
    }
};


// Add boxsizing test to Modernizr
Modernizr.addTest('boxsizing', function() {
    return Modernizr.testAllProps('boxSizing') && (document.documentMode === undefined || document.documentMode > 7);
});


jQuery(function($) {
    
    // Primary object to contain functionality
    var ot = {};
    
    
    // IE 7 fix to use fixed widths when applying box-sizing
    if (!Modernizr.boxsizing) {
        window.setTimeout(function() { // wait for respond.js
            $('.grid-item').each(function() {
                var $this = $(this),
                    fullW = $this.outerWidth(),
                    actualW = $this.width(),
                    wDiff = fullW - actualW,
                    newW = actualW - wDiff - 1;
                    
                $this.css('width', newW);
            });
        }, 1500);
    }
    
    
    // Add spans around each word in a string of text
    $('.js-add-spans').each(function() {
        
        var brArray = $.trim($(this).html()).split('<br>'),
            brArrayLength = brArray.length - 1,
            spanText = '',
            textArray;
            
        $(brArray).each(function(index, item) {
            
            item = item.replace(/\s\s+/g, ' ');
            textArray = $.trim(item).split(' ');
            
            $(textArray).each(function(index, item) {
                spanText += '<span>' + item + '</span>';
            });
            
            if (index < brArrayLength) {
                spanText += '<br>';
            }
            
        });
        
        $(this).html(spanText);
        
    });
    
    
    // Inject LiveChat widget
    if ($('.js-livechat').length) {
        $.getScript(window.OT_API.fileSource + 'livechat.js');
    }
    
    
    // Register click with GA
    $('.js-track').on('click', function() {
        window.OT_API.gaqTracking($(this));
    });
    
    
    // Slide content
    (function() {
        
        var api = ot.Slide = {},
            s; // api settings
            
        api.settings = {
            $container   : $('#main, .final-modal-contents'),
            slideSpeed   : 'fast',
            slideParent  : '.js-slide-parent',
            slideTrigger : '.js-slide-trigger',
            slideTarget  : '.js-slide-target',
            activeClass  : 'is-active',
            iconClass    : '[class^="icon-"], [class*=" icon-"]',
            iconPlus     : 'icon-plus',
            iconMinus    : 'icon-minus'
        };
        
        api.init = function() {
            s = api.settings;
            api.bindUIActions();
        };
        
        api.bindUIActions = function() {
            s.$container.on('click', s.slideTrigger, function(e) {
                e.preventDefault();
                api.slideContent($(this));
            });
        };
        
        api.slideContent = function($trigger) {
            var icon = $trigger.children(s.iconClass),
                target = $trigger.closest(s.slideParent).find(s.slideTarget);
                
            if (target.hasClass(s.activeClass)) {
                icon.toggleClass(s.iconPlus + ' ' + s.iconMinus);
                target.slideUp(s.slideSpeed, function() {
                    target.removeClass(s.activeClass).css('display', '');
                });
            }
            else {
                icon.toggleClass(s.iconMinus + ' ' + s.iconPlus);
                target.hide().addClass(s.activeClass).slideDown(s.slideSpeed);
            }
        };
        
    }());
    
    
    // Show modal
    (function() {
        
        var api = ot.Modal = {},
            s; // api settings
            
        api.settings = {
            $trigger          : $('.js-show-modal'),
            $modal            : $('.final-modal-contents'),
            $modalOverlay     : $('.modal-overlay'),
            modalContents     : '.js-modal-contents',
            modalScroll       : '.modal-scroll',
            modalDataMaxWidth : 'data-modal-maxwidth',
            modalDataWidth    : 'data-modal-width',
            modalDataHeight   : 'data-modal-height',
            modalClose        : '<a class="close" href="#">Close</a>',
            modalIsOpen       : 'modal-open',
            modalSpeed        : 400,
            videoAutoPlay     : '.js-autoplay'
        };
        
        api.init = function() {
            s = api.settings;
            api.bindUIActions();
        };
        
        api.bindUIActions = function() {
            s.$trigger.on('click', function(e) {
                if ($(window).width() >= MIN_NON_MOBILE_SIZE) {
                    e.preventDefault();
                    api.showModal($(this).parent().find(s.modalContents).clone());
                }
            });
            
            s.$modalOverlay.on('click', function () {
                api.hideModal();
            });
        };
        
        api.showModal = function($target) {
            var modalDataWidth    = $target.attr(s.modalDataWidth),
                modalDataMaxWidth = $target.attr(s.modalDataMaxWidth),
                modalDataHeight   = $target.attr(s.modalDataHeight),
                modalWidth        = api.getModalWidth(modalDataWidth, modalDataMaxWidth),
                modalHeight       = api.getModalHeight(modalDataHeight),
                modalTop          = api.getModalTop(modalHeight),
                modalRight        = api.getModalRight(modalWidth);
                
            // Fix to allow scrolling within modal
            $('body').addClass(s.modalIsOpen);
            
            // Add YouTube autoplay param if set
            $target = api.addAutoplay($target);
            
            // Show modal overlay
            s.$modalOverlay.show();
            
            // Show modal
            s.$modal
                .html($target.html())
                .append(s.modalClose)
                .contents()
                .hide()
                .end()
                .css({ 'height':'100px', 'width':'100px', 'top':modalTop, 'right':modalRight })
                .show()
                .animate({ height:modalHeight }, s.modalSpeed)
                .animate({ width:modalWidth }, s.modalSpeed, function() {
                    
                    $(this)
                        .contents()
                        .fadeIn()
                        .end()
                        .find('.close').on('click', function(e) {
                            e.preventDefault();
                            api.hideModal();
                        });
                        
                });
        };
        
        api.hideModal = function() {
            $('body').removeClass(s.modalIsOpen);
            
            s.$modal
                .empty()
                .add(s.$modalOverlay)
                .removeAttr('style');
        };
        
        api.getModalMaxWidth = function(customMaxWidth) {
            var maxWidth = 0;
            
            if (customMaxWidth && customMaxWidth !== 'undefined') {
                maxWidth = parseInt(customMaxWidth);
            }
            
            return maxWidth;
        };
        
        api.getModalWidth = function(customWidth, customMaxWidth) {
            var width = s.$modal.css('width'),
                maxWidth = api.getModalMaxWidth(customMaxWidth);
                
            if (customWidth && customWidth !== 'undefined') {
                width = customWidth;
            }
            
            if (width.match(/%$/) !== null) {
                if (maxWidth && maxWidth > 0) {
                    if (($(window).width() * (parseInt(width) * 0.01)) > maxWidth) {
                        width = maxWidth;
                    }
                }
            }
            
            return width;
        };
        
        api.getModalHeight = function(customHeight) {
            var height = s.$modal.css('height');
            
            if (customHeight && customHeight !== 'undefined') {
                height = customHeight;
            }
            
            return height;
        };
        
        api.getModalTop = function (height) {
            var top;
            
            if (height.toString().match(/%$/) !== null) {
                top = Math.round((100 - parseInt(height)) * 0.5) + '%';
            }
            else {
                top = Math.round(($(window).height() - parseInt(height)) * 0.5);
            }
            
            return top;
        };
        
        api.getModalRight = function (width) {
            var right;
            
            if (width.toString().match(/%$/) !== null) {
                right = Math.round((100 - parseInt(width)) * 0.5) + '%';
            }
            else {
                right = Math.round(($(window).width() - parseInt(width)) * 0.5);
            }
            
            return right;
        };
        
        api.addAutoplay = function($target) {
            var src, separator,
                $youtube = $target.find(s.videoAutoPlay + ' iframe');
                
            if ($youtube.length > 0) {
                src = $youtube.attr('src');
                separator = (src.split('?')[1] !== 'undefined') ? '&' : '?';
                $youtube.attr('src', src + separator + 'autoplay=1');
            }
            
            return $target;
        };
        
    }());
    
    
    // Set/save facets from/to URL
    (function() {
        
        var api = ot.Facet = {},
            s; // api settings
            
        api.settings = {
            paramName  : 'state',
            urlParams  : {},
            fsObject   : 'facetedsearchObject',
            fsSettings : window.settings
        };
        
        api.init = function() {
            // Check if fs object/settings defined before proceeding
            if (typeof api.settings.fsSettings === 'undefined') {
                return;
            }
            
            s = api.settings;
            api.getUrlParams();
            api.setState();
            api.bindUIActions();
        };
        
        // Get params from URL
        api.getUrlParams = function() {
            if (window.location.search) {
                var i, len, tmp,
                    params = window.location.search.slice(1).split('&');
                    
                for (i = 0, len = params.length; i < len; i++) {
                  tmp = params[i].split('=');
                  s.urlParams[decodeURIComponent(tmp[0])] = (tmp.length > 1) ? decodeURIComponent(tmp[1]) : '';
                }
            }
        };
        
        // Update settings and set history state
        api.setState = function() {
            // Update settings if param found in URL
            if (s.urlParams[s.paramName]) {
                s.fsSettings.state = JSON.parse(s.urlParams[s.paramName]);
            }
            
            // Set initial settings in history
            if (typeof history.replaceState !== 'undefined') {
                history.replaceState(s.fsSettings.state, null, null);
            }
            
            // Select orderBy option if set
            $(s.fsSettings.facetSelector).bind('facetuicreated', function() {
                if (typeof s.fsSettings.state.orderBy !== 'undefined') {
                    $('#orderby_' + s.fsSettings.state.orderBy).prop('selected', true);
                }
            });
        };
        
        // Update settings based on UI actions
        api.bindUIActions = function() {
            // Update when facet clicked
            $(s.fsSettings.facetSelector).bind('facetedsearchfacetclick', function() {
                api.updateUrl();
            });
            
            // Update when orderby chosen
            $(s.fsSettings.facetSelector).bind('facetedsearchorderby', function() {
                api.updateUrl();
            });
            
            // Update when all filters are removed
            $('.deselectstartover').on('click', function() {
                api.updateUrl();
            });
            
            // Update when used filters are removed
            $('.usedFilters').on('click', function(event) {
                if ($(event.target).hasClass('uselistitem')) {
                    api.updateUrl();
                }
            });
            
            // Update when browser's back/forward buttons clicked
            window.onpopstate = function(event) {
                // Check if not initial history state before proceeding
                if (event.state === null) {
                    return;
                }
                
                // Update settings with history state
                s.fsSettings.state = event.state;
                
                // Update faceted search UI with new settings
                window[s.fsObject].facetelize(s.fsSettings);
                
                // Set orderBy option to selected
                $('#orderby_' + s.fsSettings.state.orderBy).prop('selected', true);
            };
        };
        
        // Update URL without refreshing the page
        api.updateUrl = function() {
            var state  = s.fsSettings.state,
                title  = window.document.title,
                hash   = window.location.hash,
                newUrl = window.location.pathname;
                
            // Convert settings to string and assign object
            s.urlParams[s.paramName] = JSON.stringify(s.fsSettings.state);
            
            // Construct new location string
            newUrl += '?';
            newUrl += Object.keys(s.urlParams).map(function(key) {
                return encodeURIComponent(key) + '=' + encodeURIComponent(s.urlParams[key]);
            }).join('&');
            newUrl += hash;
            
            // Update URL
            if (typeof history.pushState !== 'undefined') {
                history.pushState(state, title, newUrl);
            }
        };
        
    }());
    
    
    // Initializations
    ot.Slide.init();
    ot.Modal.init();
    ot.Facet.init();
    
});

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function isMobileView() {
    return $(window).width() <= MIN_NON_TABLET_SIZE || Modernizr.ipad;
}