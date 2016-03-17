var fieldWidth ;
var fieldHeight;
var minesCount;
var startGameDiv = document.getElementById("start-game");
var buttonsHolderElement = document.getElementById("buttons-holder");
var smallFieldButton = document.getElementById("small-field");
var largeFieldButton = document.getElementById("large-field");
var buttonsElements = buttonsHolderElement.getElementsByTagName("button");
var countOfMines = document.getElementById("mines-counter-holder");
var messageElement = document.getElementById("message");
var tryAgainButton = document.getElementById("try-again");
var fieldElement = document.getElementById("field");

for (var i = 0; i < buttonsElements.length; i++) {
	buttonsElements[i].onclick = function (e) {
		countOfMines.classList.remove("hidden");

		startGameDiv.classList.add("hidden");
		if (e.target === smallFieldButton) {
			fieldWidth = 15;
			fieldHeight = 10;
			minesCount = 5;
		} else {
			fieldWidth = 25;
			fieldHeight = 12;
			minesCount = 50;
		}
		countOfMines.innerText = minesCount;
		var fieldArray = createField(fieldWidth, fieldHeight);
		setMines(fieldArray, minesCount);
		setCellsValues(fieldArray);

		createFieldElement(fieldArray, fieldElement);
	}
}