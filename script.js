/** Index variable */
let formCreateNote = document.getElementById("form-create-note");
let formEditNote = document.getElementById("form-edit-note");
let notesContainer = document.getElementById("notes-container");
let titles = [];
let notes = [];
let dates = [];
let id;

/** Trash variable */
let notesContainerTrash = document.getElementById("notes-container-trash");
let titlesTrash = [];
let notesTrash = [];
let datesTrash = [];

/** Change color page */
let pickColorValue = "#feefc3";
let fontColor = "#000000";

loadArray();

async function includeHTML() {
	let includeElements = document.querySelectorAll("[w3-include-html]");
	for (let i = 0; i < includeElements.length; i++) {
		const element = includeElements[i];
		file = element.getAttribute("w3-include-html"); // "includes/header.html"
		let resp = await fetch(file);
		if (resp.ok) {
			element.innerHTML = await resp.text();
		} else {
			element.innerHTML = "Page not found";
		}
	}
}

/** Render index */
function render() {
	notesContainer.innerHTML = "";
	let indexMessage = "Du hast keine Notizen!";
	let indexIcon = "pencil.svg";
	emptyArrays(titles, notes, notesContainer, indexMessage, indexIcon);
	for (let i = titles.length - 1; i >= 0; i--) {
		notesContainer.innerHTML += /*html*/ `
			<div class="note-container" id="${i}note-container">
				<input type="checkbox" class="highlight">
				<div class="note-subcontainer" data-id="${i}">
					<h4 class="note-headline">${titles[i]}</h4>
					<p  class="note-text">${notes[i]}</p>
					<p  class="note-date"><i>${dates[i]}</i></p>
				</div>
				<div class="buttons-container padding-right-8">
					<button onclick="showPopUpNote(${i})">
						<img src="./img/pencil.svg" alt="" />
					</button>
					<button onclick="deleteNote(${i})">
						<img src="./img/trash.svg" alt="" />
					</button>
				</div>
			</div>`;
	}
	includeHTML();
}

/** Render Trash */
function renderTrash() {
	notesContainerTrash.innerHTML = "";
	let trashMessage = "Dein Papierkorb ist leer!";
	let trashIcon = "trash-fill.svg";
	emptyArrays(titlesTrash,notesTrash,notesContainerTrash,trashMessage,trashIcon);
	for (let i = titlesTrash.length - 1; i >= 0; i--) {
		notesContainerTrash.innerHTML += /*html*/ ` 
			<div class="note-container" id="${i}note-container-trash">
				<div class="note-subcontainer">
					<h4 class="note-headline">${titlesTrash[i]}</h4>
					<p class="note-text">${notesTrash[i]}</p>
					<p  class="note-date"><i>${datesTrash[i]}</i></p>
				</div>
				<div class="buttons-container padding-right-8">
					<button onclick="takeNoteBack(${i})">
						<img src="./img/recycle.svg" alt="" />
					</button>
					<button onclick="deleteNoteForever(${i})">
						<img src="./img/trash-fill.svg" alt="" />
					</button>
				</div>
			</div>`;
}
	includeHTML();
}

function emptyArrays(arrayTitle, arrayNotes, container, message, icon) {
	if (arrayTitle.length == 0 && arrayNotes.length == 0) {
		container.innerHTML += /*html */ `    
				<div class="no-notes">  
					<img src="./img/${icon}" />
					<h2>${message}</h2> 
				</div>`;
	}
}

if (formCreateNote) {
	formCreateNote.addEventListener("submit", (e) => {
		e.preventDefault();
		addNote();
	});
}

if (formEditNote) {
	formEditNote.addEventListener("submit", (e) => {
		e.preventDefault();
		updatingInfo();
	});
}

function addNote() {
	let title = document.getElementById("title");
	let note = document.getElementById("note");
	titles.push(title.value);
	notes.push(note.value);
	const date = new Date();
	const  dayCreatedNote = date.toLocaleDateString();
	const timeCreatedNote = date.toLocaleTimeString();
	dates.push(`${dayCreatedNote} - ${timeCreatedNote}`);
	render();
	saveArray();
	document.getElementById("title").value = "";
	document.getElementById("note").value = "";
}

function showPopUpNote(i) {
	document.getElementById("edit-container").classList.remove("d-none");
	editNote(i);
}

function hidePopUpNote() {
	document.getElementById("edit-container").classList.add("d-none");
}

function editNote(i) {
	document.getElementById("title-edit").value = titles[i];
	document.getElementById("note-edit").value = notes[i];
	id = i;
}

function updatingInfo() {
	titles[id] = document.getElementById("title-edit").value;
	notes[id] = document.getElementById("note-edit").value;
	document.getElementById("edit-container").classList.add("d-none");
	document.getElementById("title-edit").value = "";
	document.getElementById("note-edit").value = "";
	render();
	saveArray();
	id = "";
}

function deleteNote(i) {
	titlesTrash.push(titles[i]);
	notesTrash.push(notes[i]);
	datesTrash.push(dates[i]);
	titles.splice(i, 1);
	notes.splice(i, 1);
	dates.splice(i, 1);
	render();
	saveArray();
}

function deleteEditForm() {
	deleteNote(id);
	hidePopUpNote();
	id = "";
}

function saveArray() {
	let titlesAstext = JSON.stringify(titles);
	let notesAstext = JSON.stringify(notes);
	let titleTrashsAstext = JSON.stringify(titlesTrash);
	let notesTrashAstext = JSON.stringify(notesTrash);
	let pickColorValueAsText = JSON.stringify(pickColorValue);
	let fontColorAsText = JSON.stringify(fontColor);
	let datesAsText = JSON.stringify(dates);
	let datesTrashAsText = JSON.stringify(datesTrash);

	localStorage.setItem("titles", titlesAstext);
	localStorage.setItem("notes", notesAstext);
	localStorage.setItem("titlesTrash", titleTrashsAstext);
	localStorage.setItem("notesTrash", notesTrashAstext);
	localStorage.setItem("colorPage", pickColorValueAsText);
	localStorage.setItem("fontColor", fontColorAsText);
	localStorage.setItem("dates", datesAsText);
	localStorage.setItem("datesTrash", datesTrashAsText);
}

function loadArray() {
	let titlesAstext = localStorage.getItem("titles");
	let notesAstext = localStorage.getItem("notes");
	let titlesTrashsAstext = localStorage.getItem("titlesTrash");
	let notesTrashAstext = localStorage.getItem("notesTrash");
	let pickColorValueAsText = localStorage.getItem("colorPage");
	let fontColorAsText = localStorage.getItem("fontColor");
	let datesAsText = localStorage.getItem("dates");
	let datesTrashAsText = localStorage.getItem("datesTrash");

	if (titlesAstext && notesAstext && datesAsText) {
		titles = JSON.parse(titlesAstext);
		notes = JSON.parse(notesAstext);
		dates = JSON.parse(datesAsText);
	}

	if (titlesTrashsAstext && notesTrashAstext && datesTrashAsText) {
		titlesTrash = JSON.parse(titlesTrashsAstext);
		notesTrash = JSON.parse(notesTrashAstext);
		datesTrash = JSON.parse(datesTrashAsText);
	}

	if(pickColorValueAsText){
		pickColorValue = JSON.parse(pickColorValueAsText);
		setColorPage();
	}
	fontColor = JSON.parse(fontColorAsText);
	if(pickColorValue == "#000000"){
		document.getElementsByTagName('h1')[0].style.color = fontColor;
	}
}

/** Delete function */
function takeNoteBack(i) {
	titles.push(titlesTrash[i]);
	notes.push(notesTrash[i]);
	dates.push(datesTrash[i]);
	titlesTrash.splice(i, 1);
	notesTrash.splice(i, 1);
	datesTrash.splice(i, 1);
	renderTrash();
	saveArray();
}

function deleteNoteForever(i) {
	titlesTrash.splice(i, 1);
	notesTrash.splice(i, 1);
	datesTrash.splice(i, 1);
	renderTrash();
	saveArray();
}

function deleteAllTrash() {
	if (titlesTrash.length && notesTrash.length) {
		titlesTrash = [];
		notesTrash = [];
		datesTrash = [];
		renderTrash();
		saveArray();
	}
}

/** Changing color page */
function changeColorPage(){
	document.getElementById('colorLink').classList.toggle('color-link-visible');
	document.getElementById('resetColorLink').classList.toggle('color-link-visible');
}

function selectColor() {
	document.getElementById('backgroundColorPicker').classList.remove('d-none');
}

function addDisplayNone() {
	document.getElementById('backgroundColorPicker').classList.add('d-none');
	pickColor();
	setColorPage();
	saveArray();
	loadArray();
}

function pickColor() {
	pickColorValue = document.getElementById('inputColor').value;
	document.getElementsByTagName('h1')[0].style.backgroundColor = pickColorValue;
	if(pickColorValue == "#000000"){
		fontColor = "#ffffff";
		document.getElementsByTagName('h1')[0].style.color = "#ffffff";
		document.getElementById('navList').classList.add('black-background-icons');
	}
	setColorPage()
}

function setColorPage() {
	let rootElement = document.querySelector(':root');
  // Set the value of variable --main-color to another value (in this case "pickColorValue")
  rootElement.style.setProperty('--main-color', pickColorValue);
}

function resetColorPage() {
	pickColorValue = "#feefc3";
	document.querySelector('h1').style.backgroundColor = pickColorValue;
	document.querySelector('h1').style.color = "#000000";
	console.log(pickColorValue);
	
	saveArray();
	setColorPage();
	/* loadArray(); */
}


