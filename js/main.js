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
			minesCount = 20;
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
function createFieldElement (array, parentElement, closedCells, markedCells) {
	closedCells = closedCells || array.length;
	markedCells = markedCells || minesCount;
	for (var i = 0; i < array.length; i++) {
		var row = document.createElement("tr");
		for (var j = 0; j < array[i].length; j++) {
			var cellElement = document.createElement("td");
			array[i][j].element = cellElement;
			cellElement.addEventListener("click", cellClick(array[i][j], array, closedCells));
			
			cellElement.addEventListener("mousedown", function (cell) {
				return function (event) {
		 
					event.target.setAttribute("oncontextmenu", "return false");
					if (event.which === 3) {
						event.preventDefault;
						if (cell.signed === false) {
							cell.signed = true;
							//
							markedCells--;
							console.log(markedCells);
							countOfMines.innerText = markedCells;
							cell.element.classList.add("signed");
						} else {
							cell.signed = false;
							markedCells++;
							countOfMines.innerText = markedCells;
							cell.element.classList.remove("signed");
						}
					}
				}
			}(array[i][j]));

			row.appendChild(cellElement);
		}
		parentElement.appendChild(row);
	}
}

function cellClick (cell, field, closedCells) {
				
	return function () {
		if (cell.signed === true) {
			return;
		} else {
			if (cell.value === "mine") {
				gameOver(field);
				cell.element.classList.add("active-mine");
			} else if (cell.value > 0 && cell.signed == false) {
				cell.element.innerText = cell.value;
				cell.element.classList.add("opened");
				cell.checked = true;
				cell.opened = true;
				closedCells--;
				console.log(closedCells);
				isWon(field);
			} else if (cell.signed == false) {
				isWon(field);
				emptyCellsOpening(cell, field);
			}
		}
	}
}
function newGame () {
	startGameDiv.classList.remove("hidden");
	while(fieldElement.childNodes[0]) {
		fieldElement.removeChild(fieldElement.childNodes[0]);
	}
	messageElement.innerText = "";
	tryAgainButton.classList.add("hidden");

}

function endOfGame (field, result) {
	messageElement.classList.add(result.messageClass);
	messageElement.classList.remove("hidden");
	messageElement.innerText = result.message;
	tryAgainButton.classList.remove("hidden");
	tryAgainButton.onclick = newGame;
	countOfMines.classList.add("hidden");
	for (var i = 0; i < field.length; i++) {
		field[i].map(function (obj) {
			if (obj.element && obj.value === "mine") {
				obj.element.classList.add(result.mineCellClass);
			} else if (obj.element && obj.value > 0) {
				obj.element.innerText = obj.value;
				obj.element.classList.add("opened");
			} else if (obj.element) {
				obj.element.classList.add("opened");
			}
			
		});
	}
}

function gameOver (field) {
	var result = {
		message: "game over!",
		messageClass: "game-over",
		mineCellClass: "mine"
	}
	endOfGame(field, result);
}

function isWon (field) {
	var closedCells = [];
	var rowClosedCells = [];
	for (var i = 0; i < field.length; i++){
		rowClosedCells = field[i].filter(function(obj) {
			return !obj.opened;
		});
		closedCells = closedCells.concat(rowClosedCells);
		var signedCells = field[i].filter(function(obj) {
			return obj.signed;
		});
		
	}
	if (closedCells.length === minesCount ) {
		var result = {
			message: "you won! congratulations!",
			messageClass: "won",
			mineCellClass: "flag"
		}
		endOfGame(field, result);
	}
}

function emptyCellsOpening (cell, field) {
  if (cell.signed === false) {
    cell.checked = true;
    cell.opened = true;
    cell.element.classList.add("opened");
    
    for (var k = -1; k <= 1; k++) {
      if (!field[cell.address.y + k]) {
        continue;
      }
      for (var l = -1; l <= 1; l++) {
        if (!field[cell.address.y + k][cell.address.x + l]) {
          continue;
        }
        var currentCell = field[cell.address.y + k][cell.address.x + l];
          if (currentCell.checked || currentCell.value === "mine") {
            continue;
        } else if (currentCell.value > 0 && currentCell.signed == false) {
          currentCell.checked = true;
          currentCell.opened = true;
          currentCell.element.innerText = currentCell.value;
          currentCell.element.classList.add("opened");
        } else {
          emptyCellsOpening(currentCell, field);
        }
      }
    }
  }
}