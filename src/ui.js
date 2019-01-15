class UIHandler {
  static displayHumanStat() {
    const table = document.getElementById('humanstats');
    table.innerHTML = ""
    let index = 0;

    const head = table.insertRow(-1);
    head.insertCell(0).innerHTML = "Human";
    head.insertCell(1).innerHTML = "Score";
    head.insertCell(2).innerHTML = "Body Delta";

    for (const human of globals.humans) {
      const row = table.insertRow(-1);
      row.insertCell(0).innerHTML = ++index;
      row.insertCell(1).innerHTML = human.score.toFixed(2);
      row.insertCell(2).innerHTML = human.bodyDelta.toFixed(2);
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