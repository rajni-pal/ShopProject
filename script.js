const form = document.getElementById("item-form");
const item = document.getElementById("item");
const itemFilter = document.getElementById("filter");
const itemList = document.querySelector(".ul-items");
const clearButton = document.getElementById("clear");
let isEditMode = false;
const formBtn = document.querySelector("button");

function displayItems() {
  const itemFromLocalStorage = getItemsFromStorage();
  itemFromLocalStorage.forEach((item) => addItemToDOM(item));
  checkUI();
}

//Add new Item
function addItem(e) {
  e.preventDefault();
  const newItem = item.value;
  //validating
  if (item.value === "") {
    alert("Please add an item.");
    return;
  }
  
  //Check for edit mode
  if (isEditMode) {
    const itemToEdit = itemList.querySelector(".edit");
    console.log(itemToEdit);
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove("edit");
    itemToEdit.remove();
    isEditMode = false;
  } else { //check duplicate
    if (checkDuplicate(newItem)) {
      alert("Item already exists.");
      return;
    }
  }

  //Add item to the Dom
  addItemToDOM(newItem);

  //Add item to local stroge
  addItemToStorage(newItem);

  //we have to repeatidly check for the UI.
  checkUI();

  item.value = "";
}

function checkDuplicate(item) {
  const itemFromLocalStorage = getItemsFromStorage();
  return itemFromLocalStorage.includes(item);
}

function addItemToDOM(item) {
  const li = document.createElement("li");
  li.className = "items";
  const text = document.createTextNode(item);
  li.appendChild(text);

  const button = createButton("button");
  li.appendChild(button);
  itemList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement("button");
  button.className = classes;
  const icon = createIcon("fa-solid fa-xmark");
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement("i");
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  let itemFromLocalStorage = getItemsFromStorage();

  itemFromLocalStorage.push(item);

  //Convert to json string and set to local storage.
  localStorage.setItem("items", JSON.stringify(itemFromLocalStorage));
}

function getItemsFromStorage() {
  let itemFromLocalStorage;

  if (localStorage.getItem("items") === null) {
    itemFromLocalStorage = [];
  } else {
    itemFromLocalStorage = JSON.parse(localStorage.getItem("items"));
  }

  return itemFromLocalStorage; //object form
}

function onClickItem(e) {
  if (e.target.parentElement.parentElement.tagName === "LI") {
    removeListItem(e.target.parentElement.parentElement);
  } else {
    setItemToEdit(e.target);
  }
}

function setItemToEdit(value) {
  isEditMode = true;
  itemList.querySelectorAll("li").forEach((i) => i.classList.remove("edit"));
  value.classList.add("edit");
  formBtn.innerHTML = `<i class ="fa-solid fa-pen"></i>Update Item`;
  formBtn.style.backgroundColor = "#228B22";
  item.value = value.textContent;
}

//remove item.
function removeListItem(item) {
  //Remove item from Dom.
  if (confirm("Are you sure you want to delete?")) {
    item.remove();
    //Remove item from Storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}
function removeItemFromStorage(item) {
  let itemFromLocalStorage = getItemsFromStorage();

  //Filter out item to be removed.
  itemFromLocalStorage = itemFromLocalStorage.filter((i) => i !== item); //It will result out all other elements except the one to be deleted.
  console.log(itemFromLocalStorage);

  //Re-set to localStorage
  localStorage.setItem("items", JSON.stringify(itemFromLocalStorage));
}

//remove All items.
function removeAll() {
  //   itemList.remove();
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  //Clear from localStorage
  localStorage.removeItem("items"); //This is all in local storage.
  checkUI();
}
//filter items
function filterItems(e) {
  const items = itemList.querySelectorAll("li");
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.textContent.toLowerCase();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}
//Checking UI
function checkUI() {
  item.value = "";
  const childList = itemList.querySelectorAll("li"); // we are every time defining it.
  //   console.log(childList);
  if (childList.length === 0) {
    clearButton.style.display = "none";
    itemFilter.style.display = "none";
  } else {
    clearButton.style.display = "block";
    itemFilter.style.display = "block";
  }
  formBtn.innerHTML = '<i class ="fa-solid fa-plus"></i>Add Item';
  formBtn.style.backgroundColor = "#333";

  isEditMode = false;
}

//Event Listeners
form.addEventListener("submit", addItem);
itemList.addEventListener("click", onClickItem);
clearButton.addEventListener("click", removeAll);
itemFilter.addEventListener("input", filterItems);
document.addEventListener("DOMContentLoaded", displayItems);
checkUI();


