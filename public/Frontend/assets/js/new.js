

document.getElementById("currentYear").innerHTML = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", function () {
  var alertDiv = document.querySelector(".alert");

  if (alertDiv) {
    setTimeout(function () {
      alertDiv.style.display = "none";
    }, 3000);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var imagePaths = [
    "/Frontend/newimg/section_img/hero_1.png",
    "/Frontend/newimg/section_img/hero_2.png",
  ];

  var imageIndex = 0;

  function changeImage() {
    var images = document.querySelectorAll(".banner-media .media");
    images.forEach(function (image) {
      image.classList.remove("active");
    });

    images[imageIndex].classList.add("active");

    imageIndex = (imageIndex + 1) % imagePaths.length;
  }

  setInterval(changeImage, 2000);
});

function handleOriginSelect() {
  var selectElement = document.getElementById("originSelect");
  var inputElement = document.getElementById("otherCityInput1");

  if (selectElement.value === "Yes") {
    inputElement.style.display = "block";
  } else {
    inputElement.style.display = "none";
  }
}

{
  /* // Function to check if passwords match */
}
function checkPasswordMatch() {
  var password1 = document.getElementById("password1").value;
  var password2 = document.getElementById("password2").value;
  var errorDiv = document.getElementById("passwordError");

  if (password1 === password2) {
    errorDiv.innerHTML = "";
  } else {
    errorDiv.innerHTML = "Passwords Not Match";
  }
}

// Attach the function to the input events
document
  .getElementById("password1")
  .addEventListener("input", checkPasswordMatch);
document
  .getElementById("password2")
  .addEventListener("input", checkPasswordMatch);

function checkPasswordMatch1() {
  var password3 = document.getElementById("password3").value;
  var password4 = document.getElementById("password4").value;
  var errorDiv1 = document.getElementById("passwordError1");

  if (password3 === password4) {
    errorDiv1.innerHTML = "";
  } else {
    errorDiv1.innerHTML = "Passwords Not Match";
  }
}

{
  /* // Attach the function to the input events */
}
// document
//   .getElementById("password3")
//   .addEventListener("input", checkPasswordMatch1);
// document
//   .getElementById("password4")
//   .addEventListener("input", checkPasswordMatch1);

// function checkPasswordMatch2() {
//   var password5 = document.getElementById("password5").value;
//   var password6 = document.getElementById("password6").value;
//   var errorDiv2 = document.getElementById("passwordError2");

//   if (password5 === password6) {
//     errorDiv2.innerHTML = "";
//   } else {
//     errorDiv2.innerHTML = "Passwords Not Match";
//   }
// }

// document
//   .getElementById("password5")
//   .addEventListener("input", checkPasswordMatch2);
// document
//   .getElementById("password6")
//   .addEventListener("input", checkPasswordMatch2);

// < type="text/javascript">
// function googleTranslateElementInit() {
// new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
// }
