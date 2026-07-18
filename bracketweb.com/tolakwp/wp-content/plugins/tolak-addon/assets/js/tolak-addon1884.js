(function ($) {
  "use strict";



  var WidgetDefaultHandler = function ($scope) {

    /*-- Typing Animation --*/
    var TxtType = function (el, toRotate, period) {
      this.toRotate = toRotate;
      this.el = el;
      this.loopNum = 0;
      this.period = parseInt(period, 10) || 2000;
      this.txt = '';
      this.tick();
      this.isDeleting = false;
    };
    TxtType.prototype.tick = function () {
      var i = this.loopNum % this.toRotate.length;
      var fullTxt = this.toRotate[i];

      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.el.innerHTML = '<span class="wrap">' + this.txt + '<span class="wrap-border"></span></span>';

      var that = this;
      var delta = 200 - Math.random() * 100;

      if (this.isDeleting) {
        delta /= 2;
      }
      if (!this.isDeleting && this.txt === fullTxt) {
        delta = this.period;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
      }

      setTimeout(function () {
        that.tick();
      }, delta);
    };


    // mailchimp form
    if ($scope.find(".mc-form").length) {
      $scope.find(".mc-form").each(function () {
        var Self = $(this);
        var mcURL = Self.data("url");
        var mcResp = Self.parent().find(".mc-form__response");

        Self.ajaxChimp({
          url: mcURL,
          callback: function (resp) {
            // appending response
            mcResp.append(function () {
              return '<p class="mc-message">' + resp.msg + "</p>";
            });
            // making things based on response
            if (resp.result === "success") {
              // Do stuff
              Self.removeClass("errored").addClass("successed");
              mcResp.removeClass("errored").addClass("successed");
              Self.find("input").val("");

              mcResp.find("p").fadeOut(10000);
            }
            if (resp.result === "error") {
              Self.removeClass("successed").addClass("errored");
              mcResp.removeClass("successed").addClass("errored");
              Self.find("input").val("");

              mcResp.find("p").fadeOut(10000);
            }
          }
        });
      });
    }

    if ($scope.find(".wow").length) {
      var wow = new WOW({
        boxClass: "wow", // animated element css class (default is wow)
        animateClass: "animated", // animation css class (default is animated)
        mobile: true, // trigger animations on mobile devices (default is true)
        live: true // act on asynchronously loaded content (default is true)
      });
      wow.init();
    }

    // Sidebar
    if ($scope.find(".main-header__toggler, .main-header-four__toggler, .sidebar-one__overlay, .sidebar-one__close").length) {
      $scope.find(".main-header__toggler, .main-header-four__toggler, .sidebar-one__overlay, .sidebar-one__close").on("click", function (e) {
        e.preventDefault();
        $(".sidebar-one").toggleClass("active");
        $("body").toggleClass("locked");
      });
    }

    //Fact Counter + Text Count
    if ($scope.find(".count-box").length) {
      $scope.find(".count-box").appear(
        function () {
          var $t = $(this),
            n = $t.find(".count-text").attr("data-stop"),
            r = parseInt($t.find(".count-text").attr("data-speed"), 10);

          if (!$t.hasClass("counted")) {
            $t.addClass("counted");
            $({
              countNum: $t.find(".count-text").text()
            }).animate({
              countNum: n
            }, {
              duration: r,
              easing: "linear",
              step: function () {
                $t.find(".count-text").text(Math.floor(this.countNum));
              },
              complete: function () {
                $t.find(".count-text").text(this.countNum);
              }
            });
          }
        }, {
          accY: 0
        }
      );
    }

    // Btn Hover
    if ($scope.find(".tolak-btn").length) {
      $scope.find('.tolak-btn').on('mouseenter', function (e) {
        var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
        $(this).find('span').css({
          top: relY,
          left: relX
        })
      }).on('mouseout', function (e) {
        var parentOffset = $(this).offset(),
          relX = e.pageX - parentOffset.left,
          relY = e.pageY - parentOffset.top;
        $(this).find('span').css({
          top: relY,
          left: relX
        })
      });
    }

    function tolak_stretch() {
      var i = $(window).width();
      $scope.find(".row .tolak-stretch-element-inside-column").each(function () {
        var $this = $(this),
          row = $this.closest(".row"),
          cols = $this.closest('[class^="col-"]'),
          colsheight = $this.closest('[class^="col-"]').height(),
          rect = this.getBoundingClientRect(),
          l = row[0].getBoundingClientRect(),
          s = cols[0].getBoundingClientRect(),
          r = rect.left,
          d = i - rect.right,
          c = l.left + (parseFloat(row.css("padding-left")) || 0),
          u = i - l.right + (parseFloat(row.css("padding-right")) || 0),
          p = s.left,
          f = i - s.right,
          styles = {
            "margin-left": 0,
            "margin-right": 0
          };
        if (Math.round(c) === Math.round(p)) {
          var h = parseFloat($this.css("margin-left") || 0);
          styles["margin-left"] = h - r;
        }
        if (Math.round(u) === Math.round(f)) {
          var w = parseFloat($this.css("margin-right") || 0);
          styles["margin-right"] = w - d;
        }
        $this.css(styles);
      });
    }
    tolak_stretch();

    function tolak_post_filter() {
      if ($scope.find(".post-filter").length) {
        $scope
          .find(".post-filter li")
          .children(".filter-text")
          .on("click", function () {
            var Self = $(this);
            var selector = Self.parent().attr("data-filter");
            $scope.find(".post-filter li").removeClass("active");
            Self.parent().addClass("active");
            $scope.find(".filter-layout").imagesLoaded(function () {
              $scope.find(".filter-layout").isotope({
                filter: selector,
                animationOptions: {
                  duration: 500,
                  easing: "linear",
                  queue: false
                }
              });
            });
            return false;
          });
      }
    }


    window.onload = function () {
      // owl slider
      let tolakowlCarousel = $scope.find(".tolak-owl__carousel");
      if (tolakowlCarousel.length) {
        tolakowlCarousel.each(function () {
          let elm = $(this);
          let options = elm.data("owl-options");
          let thmOwlCarousel = elm.owlCarousel(
            "object" === typeof options ? options : JSON.parse(options)
          );
          elm.find("button").each(function () {
            $(this).attr("aria-label", "carousel button");
          });
        });
      }

      let tolakowlCarouselNav = $scope.find(".tolak-owl__carousel--custom-nav");
      if (tolakowlCarouselNav.length) {
        tolakowlCarouselNav.each(function () {
          let elm = $(this);
          let owlNavPrev = elm.data("owl-nav-prev");
          let owlNavNext = elm.data("owl-nav-next");
          $(owlNavPrev).on("click", function (e) {
            elm.trigger("prev.owl.carousel");
            e.preventDefault();
          });

          $(owlNavNext).on("click", function (e) {
            elm.trigger("next.owl.carousel");
            e.preventDefault();
          });
        });
      }

      var elements = document.getElementsByClassName('typewrite');
      for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        var period = elements[i].getAttribute('data-period');
        if (toRotate) {
          new TxtType(elements[i], JSON.parse(toRotate), period);
        }
      }

      tolak_post_filter();

    }

    window.onresize = function () {
      tolak_stretch();
      tolak_post_filter();
    }

    if ($scope.find(".odometer").length) {
      var odo = $scope.find(".odometer");
      odo.each(function () {
        $(this).appear(function () {
          var countNumber = $(this).attr("data-count");
          $(this).html(countNumber);
        });
      });
    }

    if ($scope.find(".masonry-layout").length) {
      $scope.find(".masonry-layout").imagesLoaded(function () {
        $scope.find(".masonry-layout").isotope({
          layoutMode: "masonry"
        });
      });
    }

    if ($scope.find(".img-popup").length) {
      var groups = {};
      $(".img-popup").each(function () {
        var id = parseInt($(this).attr("data-group"), 10);

        if (!groups[id]) {
          groups[id] = [];
        }

        groups[id].push(this);
      });

      $.each(groups, function () {
        $(this).magnificPopup({
          type: "image",
          closeOnContentClick: true,
          closeBtnInside: false,
          gallery: {
            enabled: true
          }
        });
      });
    }

    if ($scope.find(".tolak-masonary").length) {
      $scope.find(".tolak-masonary").imagesLoaded(function () {
        $scope.find(".tolak-masonary").isotope({
          layoutMode: "masonry"
        });
      });
    }

    if ($scope.find(".post-filter").length) {
      $scope.find(".post-filter li")
        .children(".filter-text")
        .on("click", function () {
          var Self = $(this);
          var selector = Self.parent().attr("data-filter");
          $scope.find(".post-filter li").removeClass("active");
          Self.parent().addClass("active");
          $scope.find(".tolak-filter").imagesLoaded(function () {
            $scope.find(".tolak-filter").isotope({
              filter: selector,
              animationOptions: {
                duration: 500,
                easing: "linear",
                queue: false
              }
            });
          });
          return false;
        });
    }

    if ($scope.find(".post-filter.has-dynamic-filters-counter").length) {
      // var allItem = $('.single-filter-item').length;
      var activeFilterItem = $scope.find(".post-filter.has-dynamic-filters-counter").find(
        "li"
      );
      activeFilterItem.each(function () {
        var filterElement = $(this).data("filter");
        var count = $scope.find(".tolak-filter").find(filterElement).length;
        $(this)
          .children(".filter-text")
          .append('<span class="count">(' + count + ")</span>");
      });
    }

    if ($scope.find(".masonary-layout").length) {
      $scope.find(".masonary-layout").isotope({
        layoutMode: "masonry"
      });
    }



    if ($scope.find(".tabs-box").length) {
      $scope.find(".tabs-box .tab-buttons .tab-btn").on("click", function (e) {
        e.preventDefault();
        var target = $($(this).attr("data-tab"));

        if ($(target).is(":visible")) {
          return false;
        } else {
          target
            .parents(".tabs-box")
            .find(".tab-buttons")
            .find(".tab-btn")
            .removeClass("active-btn");
          $(this).addClass("active-btn");
          target
            .parents(".tabs-box")
            .find(".tabs-content")
            .find(".tab")
            .fadeOut(0);
          target
            .parents(".tabs-box")
            .find(".tabs-content")
            .find(".tab")
            .removeClass("active-tab");
          $(target).fadeIn(300);
          $(target).addClass("active-tab");
        }
      });
    }

    if ($scope.find(".neighborhoods__faq").length) {
      $scope
        .find(".neighborhoods__faq")
        .find(".accrodion")
        .each(function () {
          $(this).on("click", function () {
            let tabName = $(this).data("name");
            $(".neighborhoods__img-box")
              .find(".neighborhoods__location-1")
              .removeClass("active");
            $(".neighborhoods__img-box")
              .find(".neighborhoods__location-1." + tabName)
              .addClass("active");
          });
        });
    }

    // Accrodion
    if ($scope.find(".tolak-accrodion").length) {
      var accrodionGrp = $(".tolak-accrodion");
      accrodionGrp.each(function () {
        var accrodionName = $(this).data("grp-name");
        var Self = $(this);
        var accordion = Self.find(".accrodion");
        Self.addClass(accrodionName);
        Self.find(".accrodion .accrodion-content").hide();
        Self.find(".accrodion.active").find(".accrodion-content").show();
        accordion.each(function () {
          $(this)
            .find(".accrodion-title")
            .on("click", function () {
              if ($(this).parent().hasClass("active") === false) {
                $(".tolak-accrodion." + accrodionName)
                  .find(".accrodion")
                  .removeClass("active");
                $(".tolak-accrodion." + accrodionName)
                  .find(".accrodion")
                  .find(".accrodion-content")
                  .slideUp();
                $(this).parent().addClass("active");
                $(this).parent().find(".accrodion-content").slideDown();
              }
            });
        });
      });
    }

    // Popular Causes Progress Bar
    if ($scope.find(".count-bar").length) {
      $(".count-bar").appear(
        function () {
          var el = $(this);
          var percent = el.data("percent");
          $(el).css("width", percent).addClass("counted");
        }, {
          accY: -50
        }
      );
    }

    // Popular Causes Progress Bar
    if ($scope.find(".circle-progress").length) {
      $(".circle-progress").appear(function () {
        let circleProgress = $(".circle-progress");
        circleProgress.each(function () {
          let progress = $(this);
          let progressOptions = progress.data("options");
          progress.circleProgress(progressOptions);
        });
      });
    }

    //======Circle Progress
    if ($(".circle-progress").length) {
      $(".circle-progress").appear(function () {
        let circleProgress = $(".circle-progress");
        circleProgress.each(function () {
          let progress = $(this);
          let progressOptions = progress.data("options");
          progress.circleProgress(progressOptions);
        });
      });
    }

    //======Circle Progress
    if ($(".dial").length) {
      $(".dial").appear(
        function () {
          var elm = $(this);
          var color = elm.attr("data-fgColor");
          var perc = elm.attr("value");
          elm.knob({
            value: 0,
            min: 0,
            max: 100,
            skin: "tron",
            readOnly: true,
            thickness: 0.18,
            dynamicDraw: true,
            displayInput: false,
          });
          $({
            value: 0,
          }).animate({
            value: perc,
          }, {
            duration: 2000,
            easing: "swing",
            progress: function () {
              elm.val(Math.ceil(this.value)).trigger("change");
            },
          });
          $(this).append(function () {});
        }, {
          accY: 20,
        }
      );
    }

    //Fact Counter + Text Count
    if ($scope.find(".count-box").length) {
      $(".count-box").appear(
        function () {
          var $t = $(this),
            n = $t.find(".count-text").attr("data-stop"),
            r = parseInt($t.find(".count-text").attr("data-speed"), 10);

          if (!$t.hasClass("counted")) {
            $t.addClass("counted");
            $({
              countNum: $t.find(".count-text").text()
            }).animate({
              countNum: n
            }, {
              duration: r,
              easing: "linear",
              step: function () {
                $t.find(".count-text").text(Math.floor(this.countNum));
              },
              complete: function () {
                $t.find(".count-text").text(this.countNum);
              }
            });
          }
        }, {
          accY: 0
        }
      );
    }

    let thmSwiperSliders = $scope.find(".thm-swiper__slider");
    if (thmSwiperSliders.length) {
      thmSwiperSliders.each(function () {
        let elm = $(this);
        let options = elm.data("swiper-options");
        let thmSwiperSlider = new Swiper(
          elm,
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }

    let thmOwlCarousels = $scope.find(".tolak-owl__carousel");
    if (thmOwlCarousels.length) {
      thmOwlCarousels.each(function () {
        let elm = $(this);
        let options = elm.data("owl-options");
        let thmOwlCarousel = elm.owlCarousel(
          "object" === typeof options ? options : JSON.parse(options)
        );
      });
    }

    let thmOwlNavCarousels = $scope.find(".thm-owl__carousel--custom-nav");
    if (thmOwlNavCarousels.length) {
      thmOwlNavCarousels.each(function () {
        let elm = $(this);
        let owlNavPrev = elm.data("owl-nav-prev");
        let owlNavNext = elm.data("owl-nav-next");
        $(owlNavPrev).on("click", function (e) {
          elm.trigger("prev.owl.carousel");
          e.preventDefault();
        });

        $(owlNavNext).on("click", function (e) {
          elm.trigger("next.owl.carousel");
          e.preventDefault();
        });
      });
    }

    if ($scope.find("#testimonials-two__thumb").length) {
      let testimonialsThumb = new Swiper("#testimonials-two__thumb", {
        slidesPerView: 3,
        spaceBetween: 0,
        speed: 1400,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        loop: true,
        autoplay: {
          delay: 5000
        }
      });

      let testimonialsCarousel = new Swiper("#testimonials-two__carousel", {
        observer: true,
        observeParents: true,
        speed: 1400,
        mousewheel: false,
        slidesPerView: 1,
        autoplay: {
          delay: 5000
        },
        thumbs: {
          swiper: testimonialsThumb
        },
        pagination: {
          el: "#testimonials-one__carousel-pagination",
          type: "bullets",
          clickable: true
        }
      });
    }
    if ($scope.find(".post-filter").length) {
      var postFilterList = $(".post-filter li");
      // for first init
      $(".filter-layout").isotope({
        filter: ".filter-item",
        animationOptions: {
          duration: 500,
          easing: "linear",
          queue: false
        }
      });
      // on click filter links
      postFilterList.on("click", function () {
        var Self = $(this);
        var selector = Self.attr("data-filter");
        postFilterList.removeClass("active");
        Self.addClass("active");

        $(".filter-layout").isotope({
          filter: selector,
          animationOptions: {
            duration: 500,
            easing: "linear",
            queue: false
          }
        });
        return false;
      });
    }
    if ($scope.find(".curved-circle--item").length) {
      $(".curved-circle--item").circleType();
    }

    // Date Picker
    if ($(".tolak-datepicker").length) {
      $(".tolak-datepicker").each(function () {
        $(this).datepicker();
      });
    }

    if ($("#datepicker").length) {
      $("#datepicker").datepicker();
    }

    if ($("#datepicker2").length) {
      $("#datepicker2").datepicker();
    }


  };

  var WidgetFaqHandler = function ($scope) {
    if ($scope.find(".accrodion-grp").length) {
      var accrodionGrp = $(".accrodion-grp");
      accrodionGrp.each(function () {
        var accrodionName = $(this).data("grp-name");
        var Self = $(this);
        var accordion = Self.find(".accrodion");
        Self.addClass(accrodionName);
        Self.find(".accrodion .accrodion-content").hide();
        Self.find(".accrodion.active").find(".accrodion-content").show();
        accordion.each(function () {
          $(this)
            .find(".accrodion-title")
            .on("click", function () {
              if ($(this).parent().hasClass("active") === false) {
                $(".accrodion-grp." + accrodionName)
                  .find(".accrodion")
                  .removeClass("active");
                $(".accrodion-grp." + accrodionName)
                  .find(".accrodion")
                  .find(".accrodion-content")
                  .slideUp();
                $(this).parent().addClass("active");
                $(this).parent().find(".accrodion-content").slideDown();
              }
            });
        });
      });
    }
  };

  if ($("#history-one__thumb").length) {
    let testimonialsThumb = new Swiper("#history-one__thumb", {
      slidesPerView: 5,
      spaceBetween: 0,
      speed: 1400,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
      loop: true,
      autoplay: {
        delay: 5000
      }
    });

    let testimonialsCarousel = new Swiper("#history-one__carousel", {
      observer: true,
      observeParents: true,
      loop: true,
      speed: 1400,
      mousewheel: false,
      slidesPerView: 1,
      spaceBetween: 72,
      autoplay: {
        delay: 5000
      },
      thumbs: {
        swiper: testimonialsThumb
      },
      pagination: {
        el: "#testimonials-one__carousel-pagination",
        type: "bullets",
        clickable: true
      },

      navigation: {
        nextEl: "#history-one__swiper-button-next",
        prevEl: "#history-one__swiper-button-prev"
      }
    });
  }

  //elementor front start
  $(window).on("elementor/frontend/init", function () {
    elementorFrontend.hooks.addAction(
      "frontend/element_ready/widget",
      WidgetDefaultHandler
    );

    elementorFrontend.hooks.addAction(
      "frontend/element_ready/tolak-faq.default",
      WidgetFaqHandler
    );

  });

  // login
  $("#tolak-login").submit(function (event) {
    event.preventDefault();

    var login = "action=signup_paragon&param=login&" + $(this).serialize();
    $.ajax({
      type: "POST",
      url: tolak_login_object.ajaxurl,
      data: login,
      beforeSend: function () {
        // setting a timeout
        $(".login-result").addClass("loading");
      },
      success: function (data) {
        $(".login-result").removeClass("loading");
        if (data.status == 2) {
          $(".login-result").removeClass("alert alert-warning");
          $(".login-result").html(data.message).addClass("alert alert-success");
          window.location.href = tolak_login_object.login_redirect_url;
        } else if (data.status == 1) {
          $(".login-result").html(data.message).addClass("alert alert-warning");
        } else {
          $(".login-result")
            .html(tolak_login_object.message)
            .addClass("alert alert-warning");
        }
      }
    });
  }); //end login

  // register
  $("#tolak-registration").submit(function (event) {
    event.preventDefault();

    var signupForm =
      "action=signup_paragon&param=register&" + $(this).serialize();
    $.ajax({
      type: "POST",
      url: tolak_login_object.ajaxurl,
      data: signupForm,
      beforeSend: function () {
        // setting a timeout
        $(".registration-result").addClass("loading");
      },
      success: function (data) {
        $(".registration-result").removeClass("loading");
        if (data.status == 2) {
          $(".registration-result").removeClass("alert alert-warning");
          $(".registration-result")
            .html(data.message)
            .addClass("alert alert-success");
          window.location.href = tolak_login_object.registration_redirect_url;
        } else {
          $(".registration-result")
            .html(data.message)
            .addClass("alert alert-warning");
        }
      }
    });
  }); //end register
})(jQuery);