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
    1: "23",
    2: "9",
    3: "22",
    4: "18",
    5: "19"
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
    console.log(questionsAPI)
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
    console.log(n)
    
    if (button.innerText === questionsAPI[n].correct_answer) {
        // button.classList.remove("button-answer")
        button.classList.add("bg-right")
        calculateScore();
        setTimeout(nextQuestion, 1000);
           
    }
    else {
        button.classList.add("bg-wrong")
        setTimeout(nextQuestion, 500);

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
    
    // if (score >= 70) {
        questionContainer.innerHTML = `
        <div class="question-item">
        <h1>Your score for round ${roundCount} is </h1>
        <h2>${score} points</h1>
        <h2>Ready for next round?</h1>
        <button onclick="nextRound()" class="play-button">Next round</button>
        </div>
        `      
}

const nextRound = () => {
    
    roundCount++;
    n=0;
    if (roundCount>5) {
        let firstRound = myURL(roundsCategory[roundCount])
        fetchDataAPI(firstRound);
    }

    else {
        questionContainer.innerHTML = ""
        showHistory();
    }
    

}

const showHistory = () => {
    
}


// // Events
form.onsubmit = startGame;
