//Jquery

$(".box").click(function (info) {
    var color = $(info.target).css("background-color")
    $("body,.recipes-details,.categories,.areas,.ingradients,.contact,.search").css({ "background-color": color })
})

// side bar
let width = $(".left-side").outerWidth()
$(".sidebar").animate({ left: `-${width}px` }, 1)

$(".right-side").click(function () {
    let left = $(".sidebar").css("left")
    let width = $(".left-side").outerWidth()

    if (left == "0px") {
        $(".sidebar").animate({ left: `-${width}px` }, 1000)
        document.getElementById("icon-change").classList.replace("fa-xmark", "fa-bars")
    }
    else {
        document.getElementById("icon-change").classList.replace("fa-bars", "fa-xmark")
        $(".sidebar").animate({ left: `0px` }, 1000)
    }
})

let rightSideWidth = $(".right-side").outerWidth()
$(".default-recipes , .recipes-details , .categories , .search , .areas , .ingradients").css({ left: `${rightSideWidth}` })
$(':input[type="submit"]').prop('disabled', true);

// Shared function 
async function getMealsById(id) {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let data = await response.json()
    recipesDeatails = data
}

function displayRecipesDetails() {
    var tags
    var tagsTemp = ''
    if (recipesDeatails.meals[0].strTags != null) {
        tags = recipesDeatails.meals[0].strTags.split(",");
        tags.forEach(element => {
            tagsTemp += `<div class="bg-info-subtle rounded-1 p-2 my-2 w-30 text-center text-black">${element}</div>`
        });
    }

    var tagsRecipes = ''
    for (var i = 1; i < 21; i++) {
        var ingredient = "strIngredient" + i
        var measure = "strMeasure" + i
        if (recipesDeatails.meals[0][measure] && recipesDeatails.meals[0][ingredient] != null && recipesDeatails.meals[0][measure] != false && recipesDeatails.meals[0][ingredient] != false) {
            tagsRecipes += `<div class="bg-info-subtle rounded-1 p-2 my-2 w-30 text-center text-black">${recipesDeatails.meals[0][measure]} ${recipesDeatails.meals[0][ingredient]}</div>`
        }
    }

    var temp =
        ` <div class="right-details">
            <img src=${recipesDeatails.meals[0].strMealThumb} class="border border-1 border-white rounded-1" style="width: 200px ; height:200px ;">
            <p class="fw-bold py-1">${recipesDeatails.meals[0].strMeal}</p>
       </div>
       <div class="left-details">
            <h2 class="fw-bold">Instructions</h2>
            <p>${recipesDeatails.meals[0].strInstructions}</p>
            <p><span class="fw-bold fs-4">Area : </span> <span class="fs-5">${recipesDeatails.meals[0].strArea}</span></p>
            <p><span class="fw-bold fs-4">Category : </span> <span class="fs-5">${recipesDeatails.meals[0].strCategory}</span></p>
            <h4 class="h4 fw-bold py-2">Recipes :</h4>
            <div class="d-flex gap-2">
                  ${tagsRecipes}
            </div>
            <h4 class="h4 fw-bold py-2" id="tag">Tags :</h4>
            <div class ="d-flex gap-2">${tagsTemp}</div>
            <a href=${recipesDeatails.meals[0].strSource}><button class="btn btn-success my-1">Source</button></a>
            <a href=${recipesDeatails.meals[0].strYoutube}><button class="btn btn-danger my-1">Youtube</button></a>
    </div>`
    document.getElementById("recipes-details").innerHTML = temp

}

function showCardsAndDetails(item, valueToGet, functionToGetValue, functionToDisplayValue, cardName, sectionTohide) {
    var cards = document.getElementsByClassName(item)
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", async function (info) {
            var value = info.target.getAttribute(valueToGet)
            await functionToGetValue(value)
            functionToDisplayValue()
            var cards = document.getElementsByClassName(cardName)
            for (var i = 0; i < cards.length; i++) {
                cards[i].addEventListener("click", async function (info) {
                    var id = info.target.getAttribute("mealId")
                    await getMealsById(id)
                    $(sectionTohide).css({ display: "none" })
                    $(".recipes-details").css({ display: "block" })
                    displayRecipesDetails()
                })
            }
        })
    }
}

//  Main Page
var defaultMeals
var recipesDeatails

async function getInitialMeals() {
    $(".loading-screen").fadeIn(1000)
    let response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=")
    let data = await response.json()
    $(".loading-screen").fadeOut(3000)
    defaultMeals = data.meals
    displayDefaultRecipes()
    var cards = document.getElementsByClassName("item")
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", async function (info) {
            var id = info.target.getAttribute("mealId")
            await getMealsById(id)
            document.getElementById("recipes-details").style.display = "flex"
            displayRecipesDetails()

        })
    }
}

function displayDefaultRecipes() {
    var temp = ''
    defaultMeals.forEach(element => {
        temp +=
            `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="item position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class="fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
    });

    document.getElementById("default-recipes").innerHTML = temp
}

// Search Page
var recipe
var recipeByLetter

async function getMealsByname(name) {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let data = await response.json()
    $(".loading-screen").fadeOut(2000)
    recipe = data.meals
}

document.getElementById("meal-name").addEventListener("keyup", function () {
    if (document.getElementById("meal-name").value != false) {
        getMealsByname(document.getElementById("meal-name").value)
        var temp = ''
        recipe.forEach(element => {
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="searchitem item position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class="fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
        });
        document.getElementById("search-container").innerHTML = temp
    }
    searchCards()
})

async function getMealsByletter(letter) {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
    let data = await response.json()
    $(".loading-screen").fadeOut(2000)
    recipeByLetter = data.meals
}

document.getElementById("fletter").addEventListener("keyup", function () {
    if (document.getElementById("fletter").value != false) {
        getMealsByletter(document.getElementById("fletter").value)
        var temp = ''
        recipeByLetter.forEach(element => {
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="searchitem item position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class="fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
        });
        document.getElementById("search-container").innerHTML = temp
    }
    searchCards()
})

function searchCards() {
    var cards = document.getElementsByClassName("searchitem")
    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("click", async function (info) {
            var id = info.target.getAttribute("mealId")
            await getMealsById(id)
            $(".search").css({ display: "none" })
            $(".recipes-details").css({ display: "flex" })
            displayRecipesDetails()
        })
    }
}

// Category Pages
var categories
var allMealsByCategory

async function getMealsCategories() {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    categories = data.categories
    displayCategories()
    showCardsAndDetails("categoryitem", "categoryname", getMealsByCategory, displayAllMealsByCategory, "categorymealitem", ".categories")
}

function displayCategories() {
    var temp = ' '
    var first_statment
    categories.forEach(element => {
        first_statment = element.strCategoryDescription.split(".");
        temp +=
            `<div class="col-lg-3 col-md-4 col-sm-6" categoryname = ${element.strCategory}>
                <div class="categoryitem position-relative overflow-hidden border border-2 border-white rounded-1" categoryname = ${element.strCategory} >
                    <img src= "${element.strCategoryThumb}" class="w-100" categoryname=${element.strCategory}>
                    <div class="layer position-absolute p-2" categoryname=${element.strCategory}>
                    <p class="fw-bold fs-3 p-0 m-0" categoryname=${element.strCategory}>${element.strCategory}</p>
                    <small categoryname=${element.strCategory}>${first_statment[0]}</small>
                    </div>
                </div>
           </div>`
    });
    document.getElementById("categories").innerHTML = temp
}

async function getMealsByCategory(category) {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    allMealsByCategory = data.meals
}

function displayAllMealsByCategory() {
    var temp = ''
    allMealsByCategory.forEach((element, index) => {
        if (index < 20) {
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="categorymealitem position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class="fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
        }
    });

    document.getElementById("categories").innerHTML = temp
}

// Area Pages
var areas
var allMealsByArea

async function getMealsAreas() {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    areas = data.meals
    displayareas()
    showCardsAndDetails("area-item", "areaName", getMealsByArea, displayAllMealsByArea, "areamealitem", ".areas")
}

function displayareas() {
    var temp = ' '
    areas.forEach(element => {
        temp +=
            `<div class="col-lg-3 col-md-4 col-sm-6  text-white cursor-pointer" areaName = ${element.strArea}>
            <div class="area-item text-center" areaName = ${element.strArea}>
            <i class="fa-solid fa-home fa-2x" areaName = ${element.strArea}></i>
            <p class="text-center pt-2" areaName = ${element.strArea}>${element.strArea}</p>
            </div>           
           </div>`
    });
    document.getElementById("areas").innerHTML = temp
}

async function getMealsByArea(area) {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    allMealsByArea = data.meals
}

function displayAllMealsByArea() {
    var temp = ''
    allMealsByArea.forEach((element, index) => {
        if (index < 20) {
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="areamealitem position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class="fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
        }

    });
    document.getElementById("areas").innerHTML = temp
}

// Ingradient Pages
var Ingradients
var allMealsByingradient

async function getMealsIngradient() {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    Ingradients = data.meals
    displayIngradient()
    showCardsAndDetails("ingredientitem", "ingradientname", getMealsByIngradient, displayAllMealsByIngradient, "ingmealitem", ".ingradients")
}

function displayIngradient() {
    var temp = ' '
    var first_statment
    Ingradients.forEach((element, index) => {
        if (index < 20) {
            first_statment = element.strDescription.split(".");
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6  text-white cursor-pointer" ingradientname = ${element.strIngredient}>
                    <div class="ingredientitem text-center p-3" ingradientname = ${element.strIngredient}>
                        <i class="fa-solid fa-drumstick-bite fa-2x" ingradientname = ${element.strIngredient}></i>
                        <p class="text-center pt-2" ingradientname = ${element.strIngredient}>${element.strIngredient}</p>
                        <small ingradientname = ${element.strIngredient}>${first_statment[0]}</small>
                    </div>           
                </div>`
        }
    });
    document.getElementById("ingradients").innerHTML = temp
}

async function getMealsByIngradient(ingradient) {
    $(".loading-screen").css({ display: "block" })
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingradient}`)
    let data = await response.json()
    $(".loading-screen").fadeOut(1000)
    allMealsByingradient = data.meals
}

function displayAllMealsByIngradient() {
    var temp = ''
    allMealsByingradient.forEach((element, index) => {
        if (index < 20) {
            temp +=
                `<div class="col-lg-3 col-md-4 col-sm-6" mealId=${element.idMeal}>
                <div class="ingmealitem position-relative overflow-hidden border border-2 border-white rounded-1" mealId=${element.idMeal} >
                    <img src= "${element.strMealThumb}" class="w-100" mealId=${element.idMeal}>
                    <div class="layer position-absolute d-flex justify-content-center align-items-center" mealId=${element.idMeal}>
                    <p class=" fw-bold fs-3" mealId=${element.idMeal}>${element.strMeal}</p>
                    </div>
                </div>
           </div>`
        }
    });
    document.getElementById("ingradients").innerHTML = temp
}

// Contact Us
let nameInput = document.getElementById("nameInput")
let nameRegex = /^[A-Za-z]+$/
let namecorrect

let mailInput = document.getElementById("emailInput")
let mailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let mailcorrect

let phoneInput = document.getElementById("phoneInput")
let phoneRegex = /^[0-9]{12}$/
let phonecorrect

let ageInput = document.getElementById("ageInput")
let ageRegex = /^(?:[1-9]\d?|100)$/
let agecorrect

let passwordInput = document.getElementById("passwordInput")
let passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
let passcorrect

let repasswordInput = document.getElementById("repasswordInput")
let repassRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
let repasscorrect


nameInput.addEventListener("keyup", function (info) {
    if (nameRegex.test(info.target.value)) {
        document.getElementById("namealert").classList.replace("d-block", "d-none")
        namecorrect = true
    }
    else {
        document.getElementById("namealert").classList.replace("d-none", "d-block")
        namecorrect = false
    }
    enableDisableButton()
})

mailInput.addEventListener("keyup", function (info) {
    if (mailRegex.test(info.target.value)) {
        document.getElementById("emailInputalert").classList.replace("d-block", "d-none")
        mailcorrect = true
    }
    else {
        document.getElementById("emailInputalert").classList.replace("d-none", "d-block",)
        mailcorrect = false
    }
    enableDisableButton()
})

phoneInput.addEventListener("keyup", function (info) {
    if (phoneRegex.test(info.target.value)) {
        document.getElementById("phoneInputalert").classList.replace("d-block", "d-none")
        phonecorrect = true
    }
    else {
        document.getElementById("phoneInputalert").classList.replace("d-none", "d-block",)
        phonecorrect = false
    }
    enableDisableButton()
})

ageInput.addEventListener("keyup", function (info) {
    if (ageRegex.test(info.target.value)) {
        document.getElementById("ageInputalert").classList.replace("d-block", "d-none")
        agecorrect = true
    }
    else {
        document.getElementById("ageInputalert").classList.replace("d-none", "d-block",)
        agecorrect = false
    }
    enableDisableButton()
})

passwordInput.addEventListener("keyup", function (info) {
    if (passRegex.test(info.target.value)) {
        document.getElementById("passInputalert").classList.replace("d-block", "d-none")
        passcorrect = true
    }
    else {
        document.getElementById("passInputalert").classList.replace("d-none", "d-block",)
        passcorrect = false
    }
    enableDisableButton()
})

repasswordInput.addEventListener("keyup", function (info) {
    if (repassRegex.test(info.target.value) && passwordInput.value == info.target.value) {
        document.getElementById("repassInputalert").classList.replace("d-block", "d-none")
        repasscorrect = true
    }
    else {
        document.getElementById("repassInputalert").classList.replace("d-none", "d-block",)
        repasscorrect = false
    }
    enableDisableButton()
})

function enableDisableButton() {
    if (namecorrect && mailcorrect && phonecorrect && agecorrect && passcorrect && repasscorrect) {
        $(':input[type="submit"]').prop('disabled', false);
    }
    else {
        $(':input[type="submit"]').prop('disabled', true);
    }
}

// Click anywhere to close recip details page
document.getElementById("recipes-details").addEventListener("click", function () {
    document.getElementById("recipes-details").style.display = "none"
})

// Which sideBar button clicked ?
var list = document.querySelectorAll("#main-list li")
for (var i = 0; i < list.length; i++) {
    list[i].addEventListener("click", function (info) {
        var section = "." + info.target.getAttribute("data")
        if (section == ".search") {
            $(".search").css({ display: "block" })
            $(".ingradients").css({ display: "none" })
            $(".categories").css({ display: "none" })
            $(".areas").css({ display: "none" })
            $(".contact").css({ display: "none" })
        }
        else if (section == ".ingradients") {
            $(".ingradients").css({ display: "block" })
            getMealsIngradient()
            $(".search").css({ display: "none" })
            $(".categories").css({ display: "none" })
            $(".areas").css({ display: "none" })
            $(".contact").css({ display: "none" })
        }
        else if (section == ".categories") {
            $(".categories").css({ display: "block" })
            getMealsCategories()
            $(".search").css({ display: "none" })
            $(".ingradients").css({ display: "none" })
            $(".areas").css({ display: "none" })
            $(".contact").css({ display: "none" })
        }
        else if (section == ".areas") {
            $(".areas").css({ display: "block" })
            getMealsAreas()
            $(".search").css({ display: "none" })
            $(".ingradients").css({ display: "none" })
            $(".categories").css({ display: "none" })
            $(".contact").css({ display: "none" })
        }
        else if (section == ".contact") {
            $(".contact").css({ display: "flex" })
            $(".search").css({ display: "none" })
            $(".ingradients").css({ display: "none" })
            $(".categories").css({ display: "none" })
            $(".areas").css({ display: "block" })
        }

    })
}

// Call Main Page
getInitialMeals()