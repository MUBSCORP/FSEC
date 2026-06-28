$(document).ready(function () {
  var $$body = $("body");
  var $$breakpoints = 1280;
  var $$isDesktop = true;
  var $$isMo = false;

  function mobileCheck() {
    var thisWidth = window.innerWidth - 1;

    if (thisWidth < $$breakpoints) {
      $$body.addClass("isMobile");
      $$body.removeClass("isDesktop");

      $$isDesktop = false;
      $$isMo = true;
    } else {
      $$body.removeClass("isMobile");
      $$body.addClass("isDesktop");

      $$isDesktop = true;
      $$isMo = false;
    }
  }

  // 모바일 체크
  mobileCheck();

  // resizing 액션
  $(window).on("resize", function () {
    mobileCheck();
  });

  // scrolling 액션
  $(window).scroll(function () {});
  if ($(".moveTop").length) {
    $(".moveTop").on("click", function () {
      $("html, body").animate({ scrollTop: 0 }, 400);
      return false;
    });
  }

  // 모달열기
  openModalMulti = function (target) {
    var triggerPop = ".unitModal." + target;
    var $thisButton = $("." + target);
    var $thisPop = $(triggerPop);
    var $thisPopButton = $(triggerPop + " .topModalClose");

    $thisButton.addClass("modalOpen");
    $thisPop.addClass("modalOpen");
    $("body").css("overflow", "hidden");

    //포커스 이동
    setTimeout(() => {
      $thisPopButton.focus();
    }, 1);

    $thisPop.show();
    $(".closeModal, .bottomModalClose").on("click", function () {
      modalClose();
    });
    $(".unitModal").append('<button type="button" class="modalDim"><span class="ir">닫기</span></button>');
    $(".unitModal .modalDim").on("click", function () {
      $(this).parent().removeClass("modalOpen");
      $(".unitModal .modalDim").remove();
      $("body").css("overflow", "unset");
    });
  };
  // 모달닫기
  modalClose = function (target) {
    var triggerPop = ".unitModal." + target;
    var $thisPop = $(triggerPop);
    setTimeout(() => {
      $thisPop.removeClass("modalOpen");
      $(".unitModal .modalDim").remove();
      $("body").css("overflow", "unset");
    }, 200);
  };

  // gnb
  if ($("header").length) {
    var $dep01 = $("#menu .dep01 > li");
    var $dep02 = $("#menu .dep01 > li > a .dep02");
    var $allMenu = $(".right .topIcon .btnOpen");
    var handleMethod = "mouseover focus";
    var delayTime = 0;

    $("body").hasClass("isMobile") ? (handleMethod = "click") : (handleMethod = "mouseover focus");

    if ($("body").hasClass("isDesktop")) {
      $dep01.on(handleMethod, function () {
        var $this = $(this).children("a");
        $("header").addClass("isActive");
        $("#menu .dep01 li .dep02").slideDown(delayTime);
        $("#menu .dep01 > li > a").not($this).removeClass("current");
        $this.addClass("current");

        $("header").on("mouseleave", function () {
          $("header").removeClass("isActive");
          $("#menu .dep01 li .dep02").slideUp(delayTime);
          $("#menu .dep01 li > a").removeClass("current");
        });
      });
    } else {
      $dep01.on(handleMethod, function () {
        var $this = $(this).children("a");
        $("#menu .dep01 > li > a").not($this).removeClass("current");
        $this.toggleClass("current"); // pub_02
        $("#menu .dep01 > li > a + .dep02").not($this.next()).slideUp(delayTime);
        $this.next().slideToggle(delayTime);
      });
    }

    $allMenu.on("click", function () {
      $dep01.children("a").removeClass("current");
      $("header").toggleClass("isActive");
      $("header .topArea").removeClass("isActive");
      if ($("body").hasClass("isDesktop")) {
        $("#menu .dep01 li .dep02").slideToggle(delayTime);
      }
    });

    $(".right .topSch .sch").on("click", function (e) {
      if ($("body").hasClass("isMobile")) {
        $("header .topArea").toggleClass("isActive");
      }
    });
  }

  // select
  if ($(".formSelect").length) {
    $(".formSelect").each(function () {
      var $wrap = $(this);
      var $btn = $wrap.find(".select");
      var $option = $wrap.find(".option");
      var $items = $option.find("li");
      var $currentValue = Number($btn.data("value")) - 1;

      var btnWidth = $btn.outerWidth();
      var optionWidth = $option.outerWidth();

      $items.removeClass("isActive");

      if ($btn.data("value") !== "") {
        if ($items.eq($currentValue).length) {
          $items.eq($currentValue).addClass("isActive");
          $btn.html("<span>" + $items.eq($currentValue).text() + "</span>");
        }
      }

      setTimeout(function () {
        var btnWidth = $btn.outerWidth();
        var optionWidth = $option.outerWidth();
        if (btnWidth > optionWidth) {
          $option.css("width", btnWidth + "px");
        } else {
          $btn.css("width", optionWidth + "px");
        }
      }, 1);

      $btn.on("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        setTimeout(function () {
          var btnWidth = $btn.outerWidth();
          var optionWidth = $option.outerWidth();
          if (btnWidth > optionWidth) {
            $option.css("width", btnWidth + "px");
          } else {
            $btn.css("width", optionWidth + "px");
          }
        }, 1);

        $(".formSelect .select").not($btn).removeClass("isActive");
        $(".formSelect").not($btn.parent()).css("zIndex", ""); // pub_01
        $(".formSelect .option").not($option).slideUp(100);

        $btn.toggleClass("isActive");
        $btn.parent().css("zIndex", "3"); // pub_01
        $option.slideToggle(100);
      });

      $option.find("a").on("click", function (e) {
        var $li = $(this).parent();
        var index = $li.index();
        var text = $(this).text();

        $items.removeClass("isActive");
        $li.addClass("isActive");

        $btn.html("<span>" + text + "</span>");

        $btn.attr("data-value", index);
        $btn.data("value", index);

        $btn.removeClass("isActive");
        $option.slideUp(100);
      });

      $option.on("click", function (e) {
        e.stopPropagation();
      });

      $items.last().on("focusout", function () {
        $btn.focus();
      });
    });

    $(document).on("click", function () {
      $(".formSelect .select").removeClass("isActive");
      $(".formSelect .option").slideUp(100);
    });
  }

  // 피커
  if ($("input[name^='datepicker']").length) {
    $("input[name^='datepicker']").each(function () {
      var $this = $("#" + this.id);
      var option = {
        showAnim: "fadeIn", // slideDown, fadeIn, fold
        showOtherMonths: true,
        selectOtherMonths: true,
        showButtonPanel: false,
        numberOfMonths: 1,
        changeMonth: true,
        changeYear: true,
        autoSize: true,
        monthNamesShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        dayNamesMin: ["S", "M", "T", "W", "T", "F", "S"],
        dateFormat: "mm.dd",
        showOn: "button",
        buttonImage: "../../static/img/common/cal.png",
        buttonImageOnly: false,
        buttonText: "날짜선택",
        yearSuffix: "",
        prevText: "이전",
        nextText: "다음",
        closeText: "닫기",
        currentText: "오늘",
        beforeShow: function () {},
      };
      $this.datepicker(option);
    });
  }

  // tab
  if ($(".unitTab").length) {
    // 초기화
    $(".unitTab").each(function () {
      var $tab = $(this);
      var initIndex = Number($tab.attr("data-init")) || 0;

      var $menus = $tab.children("ul").find("> li > .menu");
      var $contents = $tab.children(".contents");

      $menus.removeClass("isActive").attr("title", "");
      $contents.removeClass("isActive").attr("title", "");

      var $selectedMenu = $menus.eq(initIndex);

      if (!$selectedMenu.length) return;

      var targetClass = $selectedMenu.data("tab");
      var menuText = $.trim($selectedMenu.html());

      $selectedMenu.addClass("isActive").attr("title", "선택됨");

      var $targetContent = $contents.filter("." + targetClass);

      $targetContent.addClass("isActive").attr("title", "선택됨");

      // 접근성용 제목 설정
      $targetContent.find(".contName").html(menuText);
    });

    // 탭 클릭
    $(".unitTab").on("click", ".menu", function () {
      var $tab = $(this).closest(".unitTab");
      var targetClass = $(this).data("tab");
      var menuText = $.trim($(this).html());

      var $menus = $tab.children("ul").find("> li > .menu");
      var $contents = $tab.children(".contents");

      $menus.removeClass("isActive").attr("title", "");

      $(this).addClass("isActive").attr("title", "선택됨");

      $contents.removeClass("isActive").attr("title", "");

      var $targetContent = $contents.filter("." + targetClass);

      $targetContent.addClass("isActive").attr("title", "선택됨");

      // a11y heading
      $targetContent.find(".contName").html(menuText);
    });
  }

  // faq셀렉트
  if ($(".faqSelect")) {
    $(".faqSelect > ul > li > button").on("click", function () {
      $(".faqSelect > ul > li > button").not($(this)).removeClass("isActive");
      $(this).addClass("isActive");
    });
  }

  // 홍보영상
  if ($(".movieCont").length) {
    $(".movieCont .right a").on("click", function () {
      $(".movieCont .right a").not(this).removeClass("isActive");
      $(this).addClass("isActive");
    });
  }

  // 연차보고서
  if ($(".reportCont").length) {
    $(".reportCont .right button").on("click", function () {
      $(".reportCont .right button").not(this).removeClass("isActive");
      $(this).addClass("isActive");
    });
  }

  /*
   * 스와이퍼
   */
  // 스와이퍼 버튼
  if ($(".unitSwiper .controller .btnCont").length) {
    $(".unitSwiper .controller .btnCont > button").on("click", function () {
      $(".unitSwiper .controller .btnCont > button").not($(this)).addClass("isActive");
      $(this).removeClass("isActive");
    });
  }

  // 푸터
  if ($(".swiperFooter .swiper-wrapper .swiper-slide").length == 1) {
    $(".swiperModal01").parent().children(".controller").hide();
  }
  var swiperFooter = new Swiper(".swiperFooter", {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    observer: true,
    observeParents: true,
    autoHeight: true,
    navigation: {
      nextEl: ".swiperFooter-next",
      prevEl: ".swiperFooter-prev",
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    watchOverflow: true,
    // pagination: {
    //   el: ".swiperFooter-pagin",
    //   type: "bullets",
    //   clickable: false,
    // },
    a11y: {
      slideLabelMessage: "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      440: {
        slidesPerView: 2,
      },
      1000: {
        slidesPerView: 3,
      },
      1280: {
        slidesPerView: 4,
      },
      1480: {
        slidesPerView: 5,
      },
    },
    on: {
      transitionStart: function () {},

      transitionEnd: function () {},
    },
  });

  // 메인 키비주얼
  if ($(".swiperMainVisual .swiper-wrapper .swiper-slide").length == 1) {
    $(".swiperMainVisual").parent().children(".controller").hide();
  }
  var swiperMainVisual = new Swiper(".swiperMainVisual", {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    observer: true,
    observeParents: true,
    autoHeight: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    watchOverflow: true,
    pagination: {
      el: ".swiperMainVisual-pagin",
      type: "bullets",
      clickable: true,
    },
    a11y: {
      slideLabelMessage: "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
    },
    keyboard: {
      enabled: true,
    },
    on: {
      transitionStart: function () {},

      transitionEnd: function () {},
    },
  });

  // 메인 자료마당
  if ($(".swiperMainData .swiper-wrapper .swiper-slide").length == 1) {
    $(".swiperMainData").parent().children(".controller").hide();
  }
  var swiperMainData = new Swiper(".swiperMainData", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: false,
    observer: true,
    observeParents: true,
    autoHeight: true,
    navigation: {
      nextEl: ".swiperMainData-next",
      prevEl: ".swiperMainData-prev",
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    watchOverflow: true,
    pagination: {
      el: ".swiperMainData-pagin",
      type: "bullets",
      clickable: true,
    },
    a11y: {
      slideLabelMessage: "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      760: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    on: {
      transitionStart: function () {},

      transitionEnd: function () {},
    },
  });

  // 메인 자료마당
  if ($(".swiperMainData .swiper-wrapper .swiper-slide").length == 1) {
    $(".swiperMainData").parent().children(".controller").hide();
  }
  var swiperMainData = new Swiper(".swiperMainData", {
    slidesPerView: 2,
    spaceBetween: 10,
    loop: false,
    observer: true,
    observeParents: true,
    autoHeight: true,
    navigation: {
      nextEl: ".swiperMainData-next",
      prevEl: ".swiperMainData-prev",
    },
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    watchOverflow: true,
    pagination: {
      el: ".swiperMainData-pagin",
      type: "bullets",
      clickable: true,
    },
    a11y: {
      slideLabelMessage: "총 {{slidesLength}}장의 슬라이드 중 {{index}}번 슬라이드 입니다.",
    },
    keyboard: {
      enabled: true,
    },
    breakpoints: {
      760: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    },
    on: {
      transitionStart: function () {},

      transitionEnd: function () {},
    },
  });
});
