function menuMovil() {
  var element = document.getElementById("menu");
  element.classList.add("panelMovil");
  var element = document.getElementById("clmenu");
  element.classList.add("closemenu");
}

function closeMenu() {
  var element = document.getElementById("menu");
  element.classList.remove("panelMovil");
  var element = document.getElementById("clmenu");
  element.classList.remove("closemenu");
}
