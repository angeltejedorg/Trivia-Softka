// URL base
const API = "https://opentdb.com/api.php";
let questionsAPI;
let n = 0; //Question number
let answers = [];
let score = 0;
const form = document.getElementById("main-form");
const questionContainer = document.getElementById("question-container");


// Game rounds
let rounds = [];
let roundCount = 1;
const roundsCategory =  {
    1: "9", //General Knowledge
    2: "23", //History
    3: "22", //Geography
    4: "18", //Science: Computers
    5: "19" // Science: Mathematics
};

const roundsScore = {
    1: 50,
    2: 100,
    3: 200,
    4: 500,
    5: 1000,
}

const myURL = category => {
    const UrlAPI = `${API}?amount=5&category=${category}&difficulty=medium&type=multiple`;
    return UrlAPI;
}


const fetchDataAPI = url => {
    fetch(url)
    .then(response => response.json())
    .then(result => getQuestions(result.results))
    .catch(err=> console.log(err))
}

const startGame = e => {
    e.preventDefault();
    let firstRound = myURL(roundsCategory[roundCount])
    showContainerQuestion();
    fetchDataAPI(firstRound);

}
const getQuestions = (resultAPI) => {
    questionsAPI = resultAPI;
    // console.log(questionsAPI)
    showQuestion();
}

const showQuestion = () => {
    getAnswers();

    questionContainer.innerHTML =
    ` 
    <div class="question-item">
        <h2>Round ${roundCount}</h2>
        <h2>Question #${n+1}</h2>
        <h2>${questionsAPI[n].question}</h2>
        <ul>
            <li><button onclick="handleCheckAnswer(this)" class="button-answer">${answers[0]}</button></li>
            <li><button onclick="handleCheckAnswer(this)" class="button-answer">${answers[1]}</button></li>
            <li><button onclick="handleCheckAnswer(this)" class="button-answer">${answers[2]}</button></li>
            <li><button onclick="handleCheckAnswer(this)" class="button-answer">${answers[3]}</button></li>
        </ul>
    </div>
    `
    
}

const getAnswers = () => {
    answers = questionsAPI[n].incorrect_answers;
    answers = [...answers, questionsAPI[n].correct_answer];
    answers.sort( () => {return Math.random() - 0.5})
}




const showContainerQuestion = () => {
    questionContainer.style.transform = "scaleY(1)";
}

const handleCheckAnswer = button => {
    // console.log(n)
    
    if (button.innerText === questionsAPI[n].correct_answer) {
        // button.classList.remove("button-answer")
        button.classList.add("bg-right")
        calculateScore();
        setTimeout(nextQuestion, 1000);
           
    }
    else {
        button.classList.add("bg-wrong")
        setTimeout(gameOver, 500);

    }
}

const calculateScore = () => {
    let rateScore = roundsScore[roundCount];
    score = score + rateScore;
}

const nextQuestion = () => {
    questionContainer.innerHTML = "";
    answers = [];
    if (questionsAPI.length - 1 !== n) {
        n++;
        showQuestion();
    }
    else {
        questionContainer.innerHTML = "";
        showScore();
    }
    
}

const showScore = () => {
    
        questionContainer.innerHTML = `
        <div class="question-item">
        <h1>Your <span>score</span> so far is: </h1>
        <h2>${score} <span>points</span></h1>
        <h2>Ready for next round?</h1>
        <button onclick="nextRound()" class="play-button">Next round</button>
        </div>
        `      
}

const nextRound = () => {
    
    roundCount++;
    n=0;
    if (roundCount<=5) {
        let firstRound = myURL(roundsCategory[roundCount])
        fetchDataAPI(firstRound);
    }

    else {
        questionContainer.innerHTML = ""
        gameOver();
    }
    

}

const saveData = () => {
    let namePlayer = document.getElementById("player").value;
    let myScore = new Object();
    myScore.name = namePlayer;
    myScore.score = score;
    localStorage.setItem(namePlayer, JSON.stringify(myScore))
}

const getScores = () => {
    var values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        values.push( JSON.parse(localStorage.getItem(keys[i])) );
    }

    return values;
}

let scoreHistory = getScores();


const gameOver = () => {
    saveData();
    questionContainer.innerHTML = `
    <div class="question-item">
    <h1>GAME <span>ENDED</span></h1>
    <h2>Your total socre was <span>${score} points</span></h1>
    <h2><span>Wanna</span> play again?</h1>
    <button onclick="playAgain()" class="play-button">Play again!</button>
    </div>
    `   
}

const playAgain = () => {
    window.location.reload();
}
// // Events
form.onsubmit = startGame;
