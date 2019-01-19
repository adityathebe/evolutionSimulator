class UIController {

  static uploadCustomGenome() {
    const customGenome = JSON.parse(document.getElementById('userGenomeInput').value);
    GeneticAlgorithm.useCustomGenome(customGenome);
  }

  static downloadBestGenome() {
    if (globals.bestHuman.genome) {
      const bestGenome = JSON.parse(JSON.stringify(globals.bestHuman.genome));
      saveJSON(bestGenome, 'bestGenome.json');
    }
  }

  static displayHumanStat() {
    const table = document.getElementById('humanstats');
    table.innerHTML = ""
    let index = 0;

    const head = table.insertRow(-1);
    head.insertCell(-1).innerHTML = "Human";
    head.insertCell(-1).innerHTML = "Score";
    head.insertCell(-1).innerHTML = "Steps";
    head.style.fontWeight = "bold";

    for (const human of globals.humans) {
      const row = table.insertRow(-1);
      row.insertCell(-1).innerHTML = ++index;
      row.insertCell(-1).innerHTML = human.score.toFixed(2);
      row.insertCell(-1).innerHTML = human.stepsMade;

      if (human.isAlive === false) {
        row.style.backgroundColor = "#FF2748";
      }
    }
  }

  static displayGenerationIndex() {
    document.getElementById("simulationConfigs").innerHTML = "";
    const para = document.createElement("p");
    const node = document.createTextNode('Generation : ' + globals.generationIndex);
    para.appendChild(node);
    document.getElementById("simulationConfigs").appendChild(para);
  }

  static displayBestHumanStats() {
    document.getElementById("bestHumanConfigs").innerHTML = "";
    const para = document.createElement("p");
    const bestScore = document.createTextNode('Best Score : ' + globals.bestHuman.score.toFixed(2));
    const mostStepsMade = document.createTextNode('Most Steps : ' + globals.bestHuman.stepsMade);
    para.appendChild(bestScore);
    para.appendChild(mostStepsMade);
    document.getElementById("bestHumanConfigs").appendChild(para);
  }

  static displayChart() {
    const labels = Array(globals.generationIndex).fill(null).map((x, i) => i + 1)
    const highScoreData = globals.generationHighScores;
    const avgScoreData = globals.generationAvgScores;
    var ctx = document.getElementById("chart").getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'High Score',
          data: highScoreData,
          fill: false,
          borderColor: 'red',
          backgroundColor: 'red',
          borderDash: [3, 1],
          pointRadius: 1,
          pointHoverRadius: 3,
        },
        {
          label: 'Average Score',
          data: avgScoreData,
          fill: true,
          borderColor: '#2193EE',
          backgroundColor: '#2193EE',
          pointRadius: 0,
          pointHoverRadius: 0,
        }],
      },
      options: {
        events: [], // Bug on chartJS /issues/3753
        animation: false,
        responsive: true,
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Generation'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Score'
            }
          }]
        }
      }
    });
  }
}