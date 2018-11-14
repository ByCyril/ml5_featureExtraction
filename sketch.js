let featureExtractor;
let classifier;
let video;

function setup() {
  noCanvas();

  video = createCapture(VIDEO);
  video.parent("videoContainer");
  video.size(500, 500);

  featureExtractor = ml5.featureExtractor("MobileNet", modelReady);
  featureExtractor.numClasses = 3;
  classifier = featureExtractor.classification(video, videoReady);

  setupButtons();
}

function videoReady() {
  select("#videoStatus").html("Video is ready!");
  console.log("Video is ready!");
  classify();
}

function modelReady() {
  select("#modelStatus").html("MobileNet is loaded!");
  classifier.load("model.json", customModelReady);
}

function customModelReady() {
  console.log("Custom Model is ready!");
  classify();
}

function setupButtons() {
  captureButton = select("#captureButton");
  captureButton.mousePressed(capture);

  trainButton = select("#train");
  trainButton.mousePressed(train);

  saveButton = select("#save");
  saveButton.mousePressed(saveModel);
}

function capture() {
  let label = select("#label").value();
  classifier.addImage(label);
  console.log("captured", label);
}

function train() {
  classifier.train(function(lossValue) {
    if (lossValue) {
      loss = lossValue;
      select("#loss").html("Loss: " + loss);
    } else {
      select("#loss").html("Done training! Final loss: " + loss);
      classify();
    }
  });
}

function saveModel() {
  classifier.save();
}

function classify() {
  classifier.classify(gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
  } else {
    select("#result").html(results);
    classify();
  }
}

setup();
