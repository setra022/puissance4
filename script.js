let gamePlaying = false;
let player1Ready = false;
let player2Ready = false;

const formButtonPlayer1Element = document.querySelector("#formButton1");
const formButtonPlayer2Element = document.querySelector("#formButton2");
const grilleElement = document.querySelector("#grille");
const topGrilleElement = document.querySelector("#topGrille");
const replayElement = document.querySelector("#replay");

let name1 = '';
let name2 = '';

let nbVictoiresJoueur1 = 0;
let nbVictoiresJoueur2 = 0;

formButtonPlayer1Element.addEventListener('click', function() {
	if (name1.length == 0) {
		name1 = 'joueur_1';
		document.querySelector("#Player1").textContent = 'Joueur 1 : ' + name1 + ' (' + nbVictoiresJoueur1 + ' victoire(s))'
	}
	document.body.removeChild(document.querySelector("#form1"));
	player1Ready = true;
	startGame();
});

formButtonPlayer2Element.addEventListener('click', function() {
	if (name2.length == 0) {
		name2 = 'joueur_2';
		document.querySelector("#Player2").textContent = 'Joueur 2 : ' + name2 + ' (' + nbVictoiresJoueur2 + ' victoire(s))'
	}
	document.body.removeChild(document.querySelector("#form2"));
	player2Ready = true;
	startGame();
});

let stop = false;
let turn = 1;
let winner = 0;

function startGame() {
	if (player1Ready && player2Ready) {
		gamePlaying = true;
		turn = 1
		displayGame();
	}
}

const input1 = document.querySelector("#name1");

input1.addEventListener('input', function(event) {
	name1 = event.target.value;
    document.querySelector("#Player1").textContent = 'Joueur 1 : ' + name1; 
});

const input2 = document.querySelector("#name2");

input2.addEventListener('input', function(event) {
	name2 = event.target.value;
    document.querySelector("#Player2").textContent = 'Joueur 2 : ' + name2; 
});

const numberRow = 6;
const numberColumns = 7;

const matrix = []

const turnElement = document.querySelector("#turn_text");
const wonMessageElement = document.querySelector("#wonMessage");

function updateTurn() {
	if (turn == 1) {
		turnElement.textContent = "C'est au tour de " + name1 + " de jouer";
	} else {
		turnElement.textContent = "C'est au tour de " + name2 + " de jouer";
	}
}

function displayGame() {
	updateTurn();
	if (topGrilleElement.children.length == 0) {
		const row = document.createElement("tr");
		for (let j = 0; j < numberColumns; j++) {
			const top_column = document.createElement("td");
			top_column.style.backgroundColor = "#58FAF4";
			const form = document.createElement("form");
			const button = document.createElement("input");
			button.setAttribute("id", "colonne_" + (j+1))
			button.setAttribute("type", "submit");
			button.setAttribute("value", "Jouer ici");
			button.addEventListener('click', function(event) {
				event.preventDefault();
				if (!stop) {
					addBall(event.target.id)
				}
			});
			form.appendChild(button);
			top_column.appendChild(form);
			row.appendChild(top_column);
		}
		topGrilleElement.appendChild(row);
	}
	if (matrix.length == 0) {
		for (let i = 0; i < numberRow; i++) {
			const row = document.createElement("tr");
			const tab = [];
			for (let j = 0; j < numberColumns; j++) {
				const pos = document.createElement("td");
				pos.setAttribute("id", "pos_" + i + "_" + j);
				row.appendChild(pos);
				tab.push(0)
			}
			grilleElement.appendChild(row);
			matrix.push(tab);
		}
	};
	if (checkDraw()) {
		drawMessage();
		processReplay()
	};
	winner = checkWin();
	if (winner != 0) {
		wonMessage();
		stop = true;
		processReplay();
	}
}

function checkDraw() {
	for (let j = 0; j < numberColumns; j++) {
		if (matrix[0][j] == 0) {
			return false
		}
	}
	return true
}

function addBall(columnId) {

	const id = columnId.split('_')[1] - 1;
	let raw_id = numberRow - 1;
	while (matrix[raw_id][id] != 0) {
		raw_id -= 1;
		if (raw_id < 0) {return};
	}
	matrix[raw_id][id] = turn;
	const pos = document.querySelector("#pos_" + raw_id + "_" + id);
	if (turn == 1) {
		pos.innerHTML = "<img src=\"images/boule_bleue_mini.jpg\"/>";
	} else {
		pos.innerHTML = "<img src=\"images/boule_rouge_mini.jpg\"/>";
	}
	turn = 3 - turn;
	displayGame();
}

function checkWin() {
	for (let i = 0; i < numberRow; i++) {
		winner = checkRow(matrix[i]);
		if (winner != 0) {
			return winner
		}
	};
	for (let j = 0; j < numberColumns; j++) {
		row = [];
		for (let i = 0; i < numberRow; i++) {
			row.push(matrix[i][j])
		};
		winner = checkRow(row);
		if (winner != 0) {
			return winner
		}
	};
	for (let k = 0; k < numberRow + numberColumns; k++) {
		row = [];
		for (let i = 0; i < numberRow; i++) {
			for (let j = 0; j < numberColumns; j++) {
				if (i + j == k) {
					row.push(matrix[i][j])
				}
			}
		};
		winner = checkRow(row);
		if (winner != 0) {
			return winner
		}
	}
	return 0
}

function checkRow(row) {
	if (row.length <= 3) {
		return 0
	}
	for (let i = 0; i < row.length - 3; i++) {
		if ((row[i] == row[i + 1]) && (row[i] == row[i + 2]) && (row[i] == row[i + 3])) {
			return row[i]
		}
	};
	return 0
}

function drawMessage() {
	wonMessageElement.innerHTML = "Match nul !";
}

function wonMessage() {
	if (winner == 1) {
		nbVictoiresJoueur1 += 1;
		wonMessageElement.innerHTML = name1 + ' a gagné !';
		document.querySelector("#Player1").textContent = 'Joueur 1 : ' + name1 + ' (' + nbVictoiresJoueur1 + ' victoire(s))';
	} else {
		nbVictoiresJoueur2 += 1;
		wonMessageElement.innerHTML = name2 + ' a gagné !';
		document.querySelector("#Player2").textContent = 'Joueur 2 : ' + name2 + ' (' + nbVictoiresJoueur2 + ' victoire(s))';
	}
}

function processReplay() {
	const formReplayButton = document.createElement("form");
	formReplayButton.setAttribute("id", "formReplayButton")
	const replayButton = document.createElement("input");
	replayButton.setAttribute("type", "submit");
	replayButton.setAttribute("value", "Rejouer");
	replayButton.addEventListener('click', function(event) {
		event.preventDefault();
		reinitialize();
		stop = false;
		startGame();
	})
	formReplayButton.appendChild(replayButton);
	replayElement.appendChild(formReplayButton)
}

function reinitialize() {
	for (row of matrix) {
		for (let i = 0; i < row.length; i++) {
			row[i] = 0;
		}
	};
	for (row of grilleElement.children) {
		for (pos of row.children) {
			pos.innerHTML = ""
		}
	};
	wonMessageElement.innerHTML = '';
	replayElement.removeChild(document.querySelector("#formReplayButton"))
}