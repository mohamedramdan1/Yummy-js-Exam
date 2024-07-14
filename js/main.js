/// <reference types="../@types/jquery"/>
// ======================golbal====================
let rowData = document.getElementById("row_data");
let search_cartona = document.getElementById("search-box");
let submit_Btn;
let name_Input_OK = false; // flag
let email_Input_OK = false;
let phone_Input_OK = false;
let age_Input_OK = false;
let password_Input_OK = false;
let repassword_Input_OK = false;
//================================================



//================================================
//window.ready
$(function () {
  search_name("").then(function () {
    $(".loading").fadeOut(500);
    $("body").css("overflow", "auto");
  });
});
close_Nav();
// ================================================




//================================================
//nav_bar
function close_Nav() {
  let left_nav = $(".side-nav .nav-links").outerWidth();
  $(".side-nav").animate(
    {
      left: -left_nav,
    },
    500
  );
  $(".icon").addClass("fa-align-justify");
  $(".icon").removeClass("fa-x");
  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}

function open_Nav() {
  $(".side-nav").animate(
    {
      left: 0,
    },
    500
  );
  $(".icon").removeClass("fa-align-justify");
  $(".icon").addClass("fa-x");
  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate({ top: 0 }, (i + 5) * 100);
  }
}

$(".side-nav .icon").on("click", function () {
  if ($(".side-nav").css("left") == "0px") {
    close_Nav();
  } else {
    open_Nav();
  }
});
//================================================




//================================================
//event on element in navbar
document.getElementById("search_of").addEventListener("click", function () {
  show_shearch_inpus();
  close_Nav();
});

document.getElementById("categories").addEventListener("click", function () {
  get_category();
  close_Nav();
});

document.getElementById("area").addEventListener("click", function () {
  get_Area();
  close_Nav();
});

document.getElementById("ingredients").addEventListener("click", function () {
  get_Ingrident();
  close_Nav();
});

document.getElementById("contact_us").addEventListener("click", function () {
  show_contact();
  close_Nav();
});
//================================================




//================================================
//giv meals and dispaly it
function dispaly_meals(data) {
  let meals_cartona = "";
  for (let i = 0; i < data.length; i++) {
    meals_cartona += `
        <div class="col-md-3">
          <div onclick="get_Meals_Details('${data[i].idMeal}')" class="meals position-relative align-items-center rounded-2 overflow-hidden">
            <img src="${data[i].strMealThumb}" class="w-100 rounded" alt="meal-images">
            <div class="meal-layer text-black p-2">
              <h3>${data[i].strMeal}</h3>
            </div>
          </div>
        </div>
    `;
  }
  rowData.innerHTML = meals_cartona;
}

async function get_Meals_Details(id_meals) {
  close_Nav();
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);

  search_cartona.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id_meals}`
  );
  let data = await respone.json();

  display_Meals_info(data.meals[0]);
  $(".inner_loading").fadeOut(300);
}

function display_Meals_info(meal_info) {
  search_cartona.innerHTML = "";
  let info = "";
  for (let i = 0; i < 20; i++) {
    if (meal_info[`strIngredient${i + 1}`]) {
      info += `<li class="alert alert-info m-2 p-1">${
        meal_info[`strMeasure${i + 1}`]
      } ${meal_info[`strIngredient${i + 1}`]}</li>`;
    }
  }

  let badge = meal_info.strTags?.split(",");
  if (!badge) {
    badge = [];
  }
  let badgestr = "";
  for (let i = 0; i < badge.length; i++) {
    badgestr += `
      <li class="alert alert-danger m-2 p-1">${badge[i]}</li>`;
  }

  let info_cartona = `
        <div class="col-md-4">
          <img src="${meal_info.strMealThumb}" class="w-100 rounded-2" alt="img">
          <h2>${meal_info.strMeal}</h2>
        </div>
        <div class="col-md-8">
          <h2>Instructions</h2>
          <p>${meal_info.strInstructions}</p>
          <h3>
            <span class="fw-bolder">Area : </span>${meal_info.strArea}
          </h3>
          <h3>
            <span class="fw-bolder">Category : </span>${meal_info.strCategory}
          </h3>
          <h3>
            <span>Recipes : </span>
          </h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${info}
          </ul>
          <h3><span>Tags :</span></h3>
          <ul class="list-unstyled d-flex g-3 flex-wrap">
            ${badgestr}
          </ul>
          <a target="_blank" href="${meal_info.strSource}"
            class="btn btn-success btn-1">Source</a>
          <a target="_blank" href="${meal_info.strYoutube}"
            class="btn btn-danger btn-2">Youtube</a>
        </div>
  `;
  rowData.innerHTML = info_cartona;
}
//================================================





//================================================
//search_in_navbar
function show_shearch_inpus() {
  search_cartona.innerHTML = `
      <div class="row py-4">
      <div class="col-md-6">
        <input type="text" onkeyup="search_name(this.value)" class="form-control text-white bg-transparent" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input type="text" onkeyup="search_letter(this.value)" maxlength="1" class="form-control text-white bg-transparent" placeholder="Search By First Letter">
      </div>
    </div>
  `;
  rowData.innerHTML = "";
}

async function search_name(word) {
  close_Nav();
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${word}`
  );
  let data = await respone.json();
  if (data.meals) {
    dispaly_meals(data.meals);
  } else {
    dispaly_meals([]);
  }
  $(".inner_loading").fadeOut(300);
}

async function search_letter(word) {
  close_Nav();
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  if (word == "") {
    word = "a";
  } else {
    word == "";
  }
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${word}`
  );
  let data = await respone.json();
  if (data.meals) {
    dispaly_meals(data.meals);
  } else {
    dispaly_meals([]);
  }
  $(".inner_loading").fadeOut(300);
}
//================================================




//================================================
//category_in_navbar
async function get_category() {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  search_cartona.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let data = await respone.json();
  dispaly_category(data.categories);
  $(".inner_loading").fadeOut(300);
}

function dispaly_category(data) {
  let categories_cartona = "";
  for (let i = 0; i < data.length; i++) {
    categories_cartona += `
        <div class="col-md-3">
          <div onclick="get_Meals_Category('${
            data[i].strCategory
          }')" class="meals position-relative rounded-2 overflow-hidden">
            <img src="${
              data[i].strCategoryThumb
            }" class="w-100 rounded" alt="meal-images">
            <div class="meal-layer flex-column p-2 text-center text-black">
              <h3 class="">${data[i].strCategory}</h3>
              <p>${data[i].strCategoryDescription
                .split(" ")
                .slice(0, 20)
                .join(" ")}</p>
            </div>
          </div>
        </div>
    `;
  }
  rowData.innerHTML += categories_cartona;
}

async function get_Meals_Category(category_meals) {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category_meals}`
  );
  let data = await respone.json();
  dispaly_meals(data.meals.slice(0, 20));
  $(".inner_loading").fadeOut(300);
}
//================================================



//================================================
//area_in_navbar
async function get_Area() {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  search_cartona.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let data = await respone.json();
  display_Area(data.meals);
  $(".inner_loading").fadeOut(300);
}

function display_Area(data) {
  let area_cartona = "";
  for (let i = 0; i < data.length; i++) {
    area_cartona += `
              <div class="col-md-3">
                <div onclick="get_Meals_Area('${data[i].strArea}')" class="rounded-2 text-center area">
                        <i class="fa-solid fa-house-laptop fa-4x"></i>
                        <h3>${data[i].strArea}</h3>
                </div>
        </div>
    `;
  }
  rowData.innerHTML += area_cartona;
}

async function get_Meals_Area(area_meals) {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area_meals}`
  );
  let data = await response.json();
  dispaly_meals(data.meals.slice(0, 20));
  $(".inner_loading").fadeOut(300);
}
//================================================




//================================================
//ingridents_in_navbar
async function get_Ingrident() {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  search_cartona.innerHTML = "";
  let respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let data = await respone.json();
  display_Ingrident(data.meals.slice(0, 20));
  $(".inner_loading").fadeOut(300);
}

function display_Ingrident(data) {
  let area_cartona = "";
  for (let i = 0; i < data.length; i++) {
    area_cartona += `
        <div class="col-md-3">
            <div onclick="get_Meals_ingrident('${
              data[i].strIngredient
            }')" class="rounded-2 text-center Ingrident">
              <i class="fa-solid fa-drumstick-bite fa-4x"></i>
              <h3>${data[i].strIngredient}</h3>
              <p>${data[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
        </div>
    `;
  }
  rowData.innerHTML += area_cartona;
}

async function get_Meals_ingrident(indrident_meals) {
  rowData.innerHTML = "";
  $(".inner_loading").fadeIn(300);
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${indrident_meals}`
  );
  let data = await response.json();
  dispaly_meals(data.meals.slice(0, 20));
  $(".inner_loading").fadeOut(300);
}
//================================================




//================================================
//contact_us

function show_contact() {
  search_cartona.innerHTML=" "
  rowData.innerHTML = `
        <div class="contact-us min-vh-100 d-flex justify-content-center align-items-center">
          <div class="container w-75 text-center">
            <div class="row g-4">
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="nameInput" type="text" class="form-control"
                  placeholder="Enter Your Name">
                <div id="name_alert" class="alert alert-danger mt-2 d-none">
                  Special characters and numbers not allowed
                </div>
              </div>
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="emailInput" type="email" class="form-control"
                  placeholder="Enter Your Email">
                <div id="email_alert" class="alert alert-danger mt-2 d-none">
                  Email not valid *exemple@yyy.zzz
                </div>
              </div>
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="phoneInput" type="text" class="form-control"
                  placeholder="Enter Your Phone">
                <div id="phone_alert" class="alert alert-danger w-100 mt-2 d-none">
                  Enter valid Phone Number
                </div>
              </div>
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="ageInput" type="number" class="form-control"
                  placeholder="Enter Your Age">
                <div id="age_alert" class="alert alert-danger mt-2 d-none">
                  Enter valid age
                </div>
              </div>
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="passwordInput" type="password" class="form-control"
                  placeholder="Enter Your Password">
                <div id="password_alert" class="alert alert-danger mt-2 d-none">
                  Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
              </div>
              <div class="col-md-6">
                <input onkeyup="input_Validation()" id="repasswordInput" type="password" class="form-control"
                  placeholder="Enter Your Repassword">
                <div id="repassword_alert" class="alert alert-danger mt-2 d-none">
                  Enter valid repassword
                </div>
              </div>
            </div>
            <button class="btn btn-outline-danger px-2 mt-3 btn-3" id="Submit-btn" disabled>Submit</button>
          </div>
        </div>
  `;


  document.getElementById("nameInput").addEventListener("focus",function () {
    name_Input_OK = true;
  });

  document.getElementById("emailInput").addEventListener("focus",function () {
    email_Input_OK = true;
  });

  document.getElementById("phoneInput").addEventListener("focus",function () {
    phone_Input_OK = true;
  });

  document.getElementById("ageInput").addEventListener("focus",function () {
    age_Input_OK = true;
  });

  document
    .getElementById("passwordInput").addEventListener("focus",function () {
      password_Input_OK = true;
    });

  document
    .getElementById("repasswordInput").addEventListener("focus",function () {
      repassword_Input_OK = true;
    });
}

function input_Validation() {
  if (name_Input_OK) {
    if (name_validation()) {
      document.getElementById("name_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("name_alert").classList.replace("d-none", "d-block");
    }
  }

  if (email_Input_OK) {
    if (email_validation()) {
      document.getElementById("email_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("email_alert").classList.replace("d-none", "d-block");
    }
  }

  if (phone_Input_OK) {
    if (phone_validation()) {
      document.getElementById("phone_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("phone_alert").classList.replace("d-none", "d-block");
    }
  }

  if (age_Input_OK) {
    if (age_validation()) {
      document.getElementById("age_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("age_alert").classList.replace("d-none", "d-block");
    }
  }

  if (password_Input_OK) {
    if (password_validation()) {
      document.getElementById("password_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("password_alert").classList.replace("d-none", "d-block");
    }
  }

  if (repassword_Input_OK) {
    if (repassword_validation()) {
      document.getElementById("repassword_alert").classList.replace("d-block", "d-none");
    } else {
      document.getElementById("repassword_alert").classList.replace("d-none", "d-block");
    }
  }

  submit_Btn = document.getElementById("Submit-btn");

  if (
    name_validation() &&
    email_validation() &&
    phone_validation() &&
    age_validation() &&
    password_validation() &&
    repassword_validation()
  ) {
    submit_Btn.removeAttribute("disabled");
  } else {
    submit_Btn.setAttribute("disabled", true);
  }
}

// functions validation of input
function name_validation() {
  let text = document.getElementById("nameInput").value;
  let regex = /^[a-zA-Z ]+$/;
  return regex.test(text);
}

function email_validation() {
  let text = document.getElementById("emailInput").value;
  let regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(text);
}

function phone_validation() {
  let text = document.getElementById("phoneInput").value;
  let regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return regex.test(text);
}

function age_validation() {
  let text = document.getElementById("ageInput").value;
  let regex = /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/;
  return regex.test(text);
}

function password_validation() {
  let text = document.getElementById("passwordInput").value;
  let regex = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/;
  return regex.test(text);
}

function repassword_validation() {
  return (
    document.getElementById("repasswordInput").value ==
    document.getElementById("passwordInput").value
  );
}


// clear data
function clear() {
  document.getElementById("nameInput").value = null;
  document.getElementById("emailInput").value = null;
  document.getElementById("phoneInput").value = null;
  document.getElementById("ageInput").value = null;
  document.getElementById("passwordInput").value = null;
  document.getElementById("repasswordInput").value = null;
}
//================================================
