$(document).ready(function () {
  var _fin = $(".wrapper > .container > .right table tbody tr.fin").length;
  var _mod = $(".wrapper > .container > .right table tbody tr.mod").length;
  var _total = $(".wrapper > .container > .right table tbody td.btn a:first-child").length;

  $(".projectTit .counter .fin").text(_fin + _mod);
  // $('.projectTit .counter .total').text(_total/2)
  $(".projectTit .counter .total").text(_total);

  $("table p.target").each(function () {
    var $this = $(this);
    var url = $this.children("span").text();

    var $thisBtnPc = $this.parent().next().children(".btnPc");
    var $thisBtnMo = $this.parent().next().children(".btnMo");
    var $pcUrl = "../html/" + url;
    var $moUrl = 'javascript:PopWin("' + $pcUrl + '","420","740","no");';

    $thisBtnPc.on("click", function () {
      $(this).attr("href", $pcUrl);
      $("table tbody td.btn a").not($(this)).removeClass("is-active");
      $(this).addClass("is-active");
    });
    $thisBtnMo.on("click", function () {
      $(this).attr("href", $moUrl);
      $("table tbody td.btn a").not($(this)).removeClass("is-active");
      $(this).addClass("is-active");
    });
  });
  $("table tr").each(function () {
    var $this = $(this);

    $this.hasClass("fin") || $this.hasClass("mod") ? null : $this.children(".btn").children("a").hide();
  });

  $(".openDevLog").on("click", function () {
    $(this).toggleClass("is-active");
    $(".wrapper > .container").toggleClass("is-active");
  });
});
function PopWin(url, w, h, sb) {
  var newWin;
  var setting = "width=" + w + ", height=" + h + ", top=50, left=50, scrollbars=" + sb;
  newWin = window.open(url, "", setting);
  newWin.focus();
}
