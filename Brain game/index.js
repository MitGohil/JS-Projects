let array = [
  {
    name: "one",
    img: "https://picsum.photos/id/237/200/300",
  },
  {
    name: "two",
    img: "https://picsum.photos/id/238/200/300",
  },
  {
    name: "three",
    img: "https://picsum.photos/id/239/200/300",
  },
  {
    name: "four",
    img: "https://picsum.photos/id/240/200/300",
  },
  {
    name: "five",
    img: "https://picsum.photos/id/241/200/300",
  },
  {
    name: "six",
    img: "https://picsum.photos/id/242/200/300",
  },
];

const parentDiv = document.querySelector("#card-sec");

// Duplicate the card
const gameCard = array.concat(array);

// Shuffled the card on refresh
const sfl = Array.from(gameCard).sort((compareFn = () => 0.5 - Math.random()));

for (let i = 0; i < sfl.length; i++) {
  const childDiv = document.createElement("div");
  childDiv.classList.add("card");
  childDiv.dataset.name = sfl[i].name;
  // childDiv.style.backgroundImage = `url( ${sfl[i].img})`;

  const front_div = document.createElement("div");
  front_div.classList.add("front-card");
  const back_div = document.createElement("div");
  back_div.classList.add("back-card");

  back_div.style.backgroundImage = `url( ${sfl[i].img})`;
  parentDiv.appendChild(childDiv);

  childDiv.appendChild(front_div);
  childDiv.appendChild(back_div);
}

let clicks = 0;
firstCard = "";
secondCard = "0;";

// Style on match card
const match = () => {
  let card_selected = document.querySelectorAll(".card_selected");
  card_selected.forEach((curElem) => {
    curElem.classList.add("card_match");
  });
};

const reset = () => {
  firstCard = "";
  secondCard = "";
  clicks = 0;

  let card_selected = document.querySelectorAll(".card_selected");
  card_selected.forEach((curElem) => {
    curElem.classList.remove("card_selected");
  });
};
parentDiv.addEventListener("click", (event) => {
  let curCard = event.target;
  if (curCard.id === "card-sec") {
    return false;
  }

  clicks++;
  if (clicks < 3) {
    if (clicks === 1) {
      firstCard = curCard.parentNode.dataset.name;
      curCard.parentNode.classList.add("card_selected");
    } else {
      secondCard = curCard.parentNode.dataset.name;
      curCard.parentNode.classList.add("card_selected");
    }

    if (firstCard !== "" && secondCard !== "") {
      if (firstCard === secondCard) {
        curCard.classList.add("card_match");
        setTimeout(() => {
          match();
          reset();
        }, 1000);
      } else {
        setTimeout(() => {
          reset();
        }, 1000);
      }
    }
  }
});
