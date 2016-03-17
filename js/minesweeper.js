function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createField (width, height) {
  var fieldArray = [];
  for (var i = 0; i < height; i++) {
    fieldArray[i] = [];
    for (var j = 0; j < width; j++) {
      fieldArray[i][j] = {
        value: 0,
        address: {
          x: j,
          y: i
        },
        checked: false, 
        opened: false,
        signed: false
      };
    }
  }

  return fieldArray;
}

function setMines (field, minesCount) {
  var mines = 0;
  while (mines !== minesCount) {
    var minePositionX = getRandomInt(0, fieldWidth - 1);
    var minePositionY = getRandomInt(0, fieldHeight - 1);
    if (field[minePositionY][minePositionX].value !== "mine") {
      field[minePositionY][minePositionX].value = "mine";
      mines++;
    }
  }
}

function setCellsValues (array) {
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array[i].length; j++) {
      if(array[i][j].value === "mine") {

        continue;
      }
      var minesCount = 0;
      for (var k = -1; k <= 1; k++) {
        for (var l = -1; l <= 1; l++) {
          if (array[i + k] && array[i + k][j + l] && array[i + k][j + l].value === "mine") {
            minesCount++;
          }
        }
      }
      array[i][j].value = minesCount;
    }
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
						if (cell.signed === false && cell.opened == false) {
							cell.signed = true;
							markedCells--;
							countOfMines.innerText = markedCells;
							cell.element.classList.add("signed");
						} else if (cell.opened == false) {
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