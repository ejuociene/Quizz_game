const startDisplay = document.querySelector('.start');
const easyBtn = document.querySelector('.easy');
const mediumBtn = document.querySelector('.medium');
const hardBtn = document.querySelector('.hard');
const beginMessage = document.querySelector('.begin');
const game = document.querySelector('.question_container');
const categoryDisplay = document.querySelector('.category');
const questionDisplay = document.querySelector('.question_text');
const scoreText = document.querySelector('.score_text');
const scoreDisplay = document.querySelector('.score_count');
const questionCountDisplay = document.querySelector('.question_count');
const choiceA = document.querySelector('.choiceA_text');
const choiceB = document.querySelector('.choiceB_text');
const choiceC = document.querySelector('.choiceC_text');
const choiceD = document.querySelector('.choiceD_text');
const gameEndContainer = document.querySelector('.game_end_container');
const finalScoreDisplay = document.querySelector('.game_end_score_count');
const playAgain = document.querySelector('.play_again_btn');
const message = document.querySelector('.success');
const highscoreDisplay = document.querySelector('.highscore_display');
const currentHighscore = JSON.parse(localStorage.getItem('highscores')) || 0;
const newHighscoreMessage = document.querySelector('.new_highscore');
const errDisplay = document.querySelector('.err');

const DELAY_BETWEEN_QUESTIONS = 1000;

let score = 0;
let currentQuestionIndex = 0;
let questions = [];
let correct_answer = '';
let correctIndex = '';
let allChoices = [ choiceA, choiceB, choiceC, choiceD ];
let difficultyBtns = [ easyBtn, mediumBtn, hardBtn ];
let isclicked = false;

const getQuestions = async (difficulty) => {
	try {
		startDisplay.classList.add('hidden');
		const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=multiple`);
		const result = await response.json();
		const questionArray = result.results;
		console.log(questionArray);
		game.classList.remove('hidden');
		nextQuestion(questionArray);
	} catch (error) {
		console.log('Įvyko klaida');
		console.log(error);
	}
};

const textSpinning = [ { transform: 'rotate(0) scale(0)' }, { transform: 'rotate(360deg) scale(1)' } ];
const textPopOut = [
	{ transform: 'translateY(0)' },
	{ transform: 'translateY(-5px)' },
	{ transform: 'translateY(0)' }
];
const textTiming = {
	duration: 500,
	iterations: 1
};

const popTiming = {
	duration: 200,
	iterations: 1
};

const startGame = (clickedBtn, difficulty) => {
	clickedBtn.classList.add('selectedBtn');
	beginMessage.classList.remove('hidden');
	beginMessage.animate(textSpinning, textTiming);
	setTimeout(() => {
		beginMessage.classList.add('hidden');
		getQuestions(difficulty);
	}, 1500);
};

easyBtn.addEventListener('click', () => {
	startGame(easyBtn, 'easy');
});

mediumBtn.addEventListener('click', () => {
	startGame(mediumBtn, 'medium');
});

hardBtn.addEventListener('click', () => {
	startGame(hardBtn, 'hard');
});

const nextQuestion = (questionArray) => {
	questions = [ ...questionArray ];
	for (let each of allChoices) {
		each.style.backgroundColor = '';
	}
	message.innerHTML = '';
	categoryDisplay.innerHTML = questionArray[currentQuestionIndex].category;
	let currentQuestion = questionArray[currentQuestionIndex].question;
	questionDisplay.innerHTML = currentQuestion;
	questionCountDisplay.innerHTML = currentQuestionIndex + 1;
	createAsnwers();
};

const createAsnwers = () => {
	let answerChoices = [ ...questions[currentQuestionIndex].incorrect_answers ];
	correctIndex = Math.floor(Math.random() * 3);
	console.log(questions[currentQuestionIndex].correct_answer);
	answerChoices.splice(correctIndex, 0, questions[currentQuestionIndex].correct_answer);
	correct_answer = answerChoices[correctIndex];
	choiceA.innerHTML = answerChoices[0];
	choiceB.innerHTML = answerChoices[1];
	choiceC.innerHTML = answerChoices[2];
	choiceD.innerHTML = answerChoices[3];
};

const clickHandling = (choice) => {
	if (isclicked === false) {
		if (choice.dataset.index == correctIndex) {
			score++;
			scoreDisplay.innerHTML = score;
			scoreText.animate(textPopOut, popTiming);
			choice.style.backgroundColor = '#538d22';
			message.innerHTML = 'Correct!';
		} else {
			message.innerHTML = 'Better luck next time!';
			choice.style.backgroundColor = '#ae2012';
			for (let each of allChoices) {
				if (each.dataset.index == correctIndex) {
					each.style.backgroundColor = '#538d22';
				}
			}
		}
		isclicked = true;
		currentQuestionIndex++;
		setTimeout(() => {
			if (currentQuestionIndex < 10) {
				nextQuestion(questions);
				isclicked = false;
			} else {
				finishGame();
			}
		}, DELAY_BETWEEN_QUESTIONS);
	} else {
		return;
	}
};

choiceA.addEventListener('click', () => {
	clickHandling(choiceA);
});

choiceB.addEventListener('click', () => {
	clickHandling(choiceB);
});

choiceC.addEventListener('click', () => {
	clickHandling(choiceC);
});

choiceD.addEventListener('click', () => {
	clickHandling(choiceD);
});

const finishGame = () => {
	game.classList.add('hidden');
	gameEndContainer.classList.remove('hidden');
	finalScoreDisplay.innerHTML = score;
	if (score > +currentHighscore || currentHighscore === '') {
		highscoreDisplay.innerHTML = score;
		localStorage.setItem('highscores', JSON.stringify(score));
		newHighscoreMessage.classList.remove('hidden');
		newHighscoreMessage.animate(textSpinning, textTiming);
	} else {
		highscoreDisplay.innerHTML = currentHighscore;
	}
};

playAgain.addEventListener('click', () => {
	gameEndContainer.classList.add('hidden');
	score = 0;
	scoreDisplay.innerHTML = score;
	currentQuestionIndex = 0;
	questionCountDisplay.innerHTML = currentQuestionIndex;
	highscoreDisplay.innerHTML = '';
	questions = [];
	for (let each of difficultyBtns) {
		each.classList.remove('selectedBtn');
	}
	startDisplay.classList.remove('hidden');
});
