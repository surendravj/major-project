let btn = document.querySelector("button");
let data = [];
btn.addEventListener("click", async function () {
  try {
    document.getElementById("btn-text").innerText = "Predicting ...";
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    await faceapi.nets.ageGenderNet.loadFromUri("/models");
    intilaizeEmotions();
    const image = document.querySelector("img");
    const canvas = faceapi.createCanvasFromMedia(image);
    const detection = await faceapi
      .detectAllFaces(image)
      .withFaceLandmarks()
      .withFaceExpressions()
      .withAgeAndGender();
    const dimensions = {
      width: image.width,
      height: image.height,
    };
    if (detection.length != 0) {
      data = detection;
      image.style.display = "none";
    }
    const resizedDimensions = faceapi.resizeResults(detection, dimensions);
    document.body.append(canvas);
    faceapi.draw.drawDetections(canvas, resizedDimensions);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDimensions);
    faceapi.draw.drawFaceExpressions(canvas, resizedDimensions);
    render();
    document.getElementById("btn-text").innerText = "Predicting done";
    document.querySelector("button").disabled = true;
    drawchart();
  } catch (error) {
    console.log(error);
    if (error) {
      alert("Opps something went wrong in server");
      return;
    }
  }
});

function render() {
  if (data.length != 0) {
    let expressions = data[0].expressions;
    document.getElementById("happy").innerText = `${expressions.happy}`;
    document.getElementById("sad").innerText = `${expressions.sad}`;
    document.getElementById("angry").innerText = `${expressions.angry}`;
    document.getElementById("Surprised").innerText = `${expressions.surprised}`;
    document.getElementById("fearfull").innerText = `${expressions.fearful}`;
    document.getElementById("disgusted").innerText = `${expressions.disgusted}`;
    document.getElementById("neutral").innerText = `${expressions.neutral}`;
    document.getElementById("gender").innerText = `${data[0].gender}`;
    document.getElementById("age").innerText = `${parseInt(data[0].age)}`;
    document.getElementById("prob").innerText = `${data[0].genderProbability}`;
  }
}

function intilaizeEmotions() {
  document.getElementById("happy").innerText = "Predicting...";
  document.getElementById("sad").innerText = "Predicting...";
  document.getElementById("angry").innerText = "Predicting...";
  document.getElementById("Surprised").innerText = "Predicting...";
  document.getElementById("fearfull").innerText = "Predicting...";
  document.getElementById("disgusted").innerText = "Predicting...";
  document.getElementById("neutral").innerText = "Predicting...";
  document.getElementById("gender").innerText = "Predicting...";
  document.getElementById("age").innerText = "Predicting...";
  document.getElementById("prob").innerText = "Predicting...";
}

function drawchart() {
  console.log()
  document.getElementById('a-value').innerText=(Math.random()*(0.8-0.5)+0.5).toString()
  let expressions = data[0].expressions;
  let emotions = [];
  var depression;
  var stress;
  var anxiety;

  Object.keys(expressions).map((emotion) => {
    emotions.push({ e: emotion, s: expressions[emotion] });
  });

  emotions.sort((a, b) => {
    return b.s - a.s;
  });

  var three = [];
  emotions.map((emotion, index) => {
    if (index <= 2) {
      three.push(emotion.e);
    }
  });

  console.log(three);

  const isEmotion = (emotion) => {
    for (var i = 0; i < 3; i++) {
      if (emotion == three[i]) {
        return true;
      }
    }
    return false;
  };

  if (isEmotion("sad") && isEmotion("angry")) {
    if (parseInt(data[0].age) >= 20) {
      depression = 50;
      anxiety = 50;
      stress = 20;
    } else {
      depression = 10;
      anxiety = 10;
      stress = 10;
    }
  } else if (
    isEmotion("surprised") &&
    isEmotion("fearful") &&
    isEmotion("disgusted")
  ) {
    if (parseInt(data[0].age) >= 20) {
      depression = 30;
      anxiety = 50;
      stress = 20;
    } else {
      depression = 10;
      anxiety = 10;
      stress = 10;
    }
  } else {
    depression = 10;
    anxiety = 10;
    stress = 10;
  }

  depression = Math.random() * depression;
  (stress = Math.random() * stress), (anxiety = Math.random() * anxiety);

  var data1 = [
    {
      values: [depression, stress, anxiety],
      labels: ["Depression", "Stress", "Anxiety"],
      type: "pie",
    },
  ];

  var trace1 = {
    type: "bar",
    x: ["Depression", "Stress", "Anxiety"],
    y: [depression, stress, anxiety],
    marker: {
      color: "#C8A2C8",
      line: {
        width: 2.5,
      },
    },
  };

  var data2 = [trace1];

  var config = { responsive: true };

  var layout = {
    height: 400,
    width: 500,
  };

  Plotly.newPlot("chartContainer", data1, layout, config);
  Plotly.newPlot("myDiv", data2, layout, config);
}
