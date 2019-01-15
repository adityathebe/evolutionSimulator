class UIHandler {
  static displayHumanStat() {
    const table = document.getElementById('humanstats');
    table.innerHTML = ""
    let index = 0;

    const head = table.insertRow(-1);
    head.insertCell(-1).innerHTML = "Human";
    head.insertCell(-1).innerHTML = "Score";
    head.style.fontWeight = "bold";

    for (const human of globals.humans) {
      const row = table.insertRow(-1);
      row.insertCell(-1).innerHTML = ++index;
      row.insertCell(-1).innerHTML = human.score.toFixed(2);

      if (human.isAlive === false) {
        row.style.backgroundColor = "#e74c3c";
      }
    }
  }

  static displayGenerationIndex() {
    document.getElementById("configs").innerHTML = "";
    const para = document.createElement("p");
    const node = document.createTextNode('Generation : ' + globals.generationIndex);
    para.appendChild(node);
    document.getElementById("configs").appendChild(para);
  }

  static displayConfigs() {

  }
}