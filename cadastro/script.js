document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelector(".slides");
  const slideContents = document.querySelectorAll(".slide");
  const totalSlides = slideContents.length;
  let currentIndex = 0;

  function showSlide(index) {
    if (index < 0) {
      currentIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const newTransformValue = -currentIndex * 100 + "%";
    slides.style.transform = "translateX(" + newTransformValue + ")";
  }

  // 自動スライド
  setInterval(function () {
    showSlide(currentIndex + 1);
  }, 3000); // 3秒ごとにスライド

  // タッチスワイプサポート
  let touchStartX = 0;
  let touchEndX = 0;

  slides.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
  });

  slides.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].clientX;

    if (touchStartX - touchEndX > 50) {
      showSlide(currentIndex + 1);
    } else if (touchStartX - touchEndX < -50) {
      showSlide(currentIndex - 1);
    }
  });
});
