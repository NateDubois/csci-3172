const creatureSanctuary = [];

function addCreature() {
  const creatureName = document.getElementById("creatureName").value;
  const creatureType = document.getElementById("creatureType").value;
  const creatureHabitat = document.getElementById("creatureHabitat").value;

  const newCreature = {
    name: creatureName,
    type: creatureType,
    habitat: creatureHabitat,
  };

  console.log(creatureName);
  console.log(creatureType);
  console.log(creatureHabitat);

  creatureSanctuary.push(newCreature);

  console.log(creatureSanctuary);

  document.getElementById("addCreatureForm").reset();

  // need to display creatures
  displayCreatures();
}

function removeCreature() {
  creatureSanctuary.pop();
  
  console.log(creatureSanctuary);

  displayCreatures();
}

function displayCreatures() {
  const creaturesDiv = document.getElementById("creatureSanctuary");
  creaturesDiv.innerHTML = "";

  console.log(creaturesDiv);

  const list = document.createElement("ul");

  for (const creature of creatureSanctuary) {
    const listItem = document.createElement("li");
    listItem.textContent = `${creature.name} - ${creature.type} (Habitat: ${creature.habitat})`;
    list.appendChild(listItem);
  }
  creaturesDiv.appendChild(list);
}

document
  .getElementById("addCreatureForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    addCreature();
  });
