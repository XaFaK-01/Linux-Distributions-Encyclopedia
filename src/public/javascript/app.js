// alert("hello world!");

$(".heading").fadeOut(600).fadeIn(600);
$(".heading-paragraph").fadeOut(800).fadeIn(800);
$(".distro-card").slideToggle().slideToggle();

$(".distro-logo-col").toggle("fold").toggle("fold");

$(".home-btn").click(function (e) {
  e.preventDefault();

  console.log("home-btn clicked");
  $(".abt-li").removeClass("active");
  $(".home-li").addClass("active");
  //   $(".home-btn").attr("href", "/");
  window.location.href = "/";
});

$(".abt-btn").click(function (e) {
  e.preventDefault();
  console.log("abt-btn clicked");

  $(".home-li").removeClass("active");
  $(".abt-li").addClass("active");
  //   $(".abt-btn").attr("href", "/about");
  window.location.href = "/about";
});
