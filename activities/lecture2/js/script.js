// Create an array of possible answers
const answers = [
  "It is certain",
  "It is decidedly so",
  "Outlook good",
  "Better not tell you now",
  "Don't count on it",
  "My sources say no",
];

// Create a function to fetch the question the user has asked
// Our function should also check from an empty value
function askQuestion() {
  const userQuestion = document.getElementById("userQuestion").value;
  if (userQuestion === "") {
    alert("Please enter a question");
    return;
  }
  // Select a random answer from your array
  const randomIndex = Math.floor(Math.random() * answers.length);
  const answer = answers[randomIndex];

  document.getElementById("answer").textContent =
    `You asked: ${userQuestion}; `;
  document.getElementById("answer").textContent +=
    "The Magic 8-Ball says: " + answer;

  console.log(`Question: ${userQuestion}`);
  console.log(`Answer: ${answer}`);
}

function giveAnswer(){
  const userQuestion = document.getElementById("userQuestion").value;
  if (userQuestion === "") {
    alert("Please enter a answer");
    return;
  }

  answers.push(userQuestion);
}