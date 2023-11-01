// Step - 1 Define Quiz data
const quizData = [
  {
    question: "console.log(null && undefined)",
    options: ["null ", "undefined", "True", "False"],
    correct: 0,
  },
  {
    question: "console.log(undefined && null)",
    options: ["null", "undefined", "True", "False"],
    correct: 1,
  },
  {
    question: "console.log(null || undefined)",
    options: ["null", "undefined", "True", "False"],
    correct: 1,
  },
  {
    question: "console.log(undefined || null)",
    options: ["null", "undefined", "True", "False"],
    correct: 0,
  },
  {
    question: "console.log(1 == 2 || 2 == 2)",
    options: ["1", "2", "True", "False"],
    correct: 2,
  },
  {
    question: "console.log(1 == 2 && 2 == 2)",
    options: ["1", "2", "True", "False"],
    correct: 3,
  },
  {
    question: `console.log(1 + +"2" + "2")`,
    options: ["122", "5", "32", "error"],
    correct: 2,
  },
  {
    question: ` console.log(1 + -"2" + "2")`,
    options: ["1", "-12", "122", "error"],
    correct: 1,
  },
  {
    question: `console.log("1" - "11")`,
    options: ["111", "12", "error", "-10"],
    correct: 3,
  },
];

//Step - 2 JS Initialization

const quiz = document.querySelector("#quiz");
const scores = document.querySelector(".score");
const answer = document.querySelectorAll(".answer");
const [questions, option_1, option_2, option_3, option_4] =
  document.querySelectorAll(
    "#question, .option_1, .option_2, .option_3, option_4"
  );
const submit = document.querySelector("#submit");
const back = document.querySelector("#back");

// step - 3  Load QUIZ

let currentQuiz = 0;
let score = 0;

const loadQuiz = () => {
  const { question, options } = quizData[currentQuiz];
  //   console.log(question);
  questions.innerText = `${currentQuiz + 1} :- ${question}`;
  scores.innerHTML = `Score : ${score} / ${quizData.length}`;
  options.forEach(
    (crntoption, index) =>
      (window[`option_${index + 1}`].innerText = crntoption)
  );
};

loadQuiz();

// step - 4  Get selected answer on submit button

const getSelectedOption = () => {
  //   let ans_index;
  //   answer.forEach((crntOption, index) => {
  //     if (crntOption.checked) {
  //       ans_index = index;
  //     }
  //   });
  //   return ans_index;

  //  Above commented code will be short
  let anselmnt = Array.from(answer);
  return anselmnt.findIndex((crnt) => crnt.checked);
};

// Deselect answer

const deselectans = () => {
  answer.forEach((crntelm) => (crntelm.checked = false));
};

submit.addEventListener("click", () => {
  const selectedOptionIndex = getSelectedOption();
  //   console.log(selectedOptionIndex);

  if (selectedOptionIndex === quizData[currentQuiz].correct) {
    score++;
  }

  currentQuiz++;
  if (currentQuiz < quizData.length) {
    deselectans();
    loadQuiz();
  } else {
    quiz.innerHTML = `
      <div class="result">
      <h2> Your Score : ${score} / ${quizData.length} correct Answer </h2>
      <p>Thanks for completed the QUIZ!</p>
      <button class="button" onclick="location.reload()">Play Again</button>
      </div>`;
  }
  console.log(score);
});
