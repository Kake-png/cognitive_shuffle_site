const dropdown = document.querySelector(".dropdown");
const dropdownButton = document.querySelector(".dropdown-button");

dropdownButton.addEventListener("click", () => {
  dropdown.classList.toggle("open");
});

document.addEventListener("click", (event) => {
  if (!dropdown.contains(event.target)) {
    dropdown.classList.remove("open");
  }
});