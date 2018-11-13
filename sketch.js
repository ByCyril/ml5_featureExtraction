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
}

function modelReady() {
  select("#modelStatus").html("MobileNet is loaded!");
  classifier.load("model.json", customModelReady);
}

function setupButtons() {
  captureButton = select("#captureButton");
  captureButton.mousePressed(function() {
    let label = select("#label").value();
    classifier.addImage(label);
    console.log("captured", label);
  });

  trainButton = select("#train");
  trainButton.mousePressed(train);

  saveButton = select("#save");
  saveButton.mousePressed(save);

  loadButton = select("#loadModel");
  loadButton.mousePressed(loadModel);
}

function customModelReady() {
  console.log("Custom Model is ready!");
  classify();
}

function save() {
  classifier.save();
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
function classify() {
  classifier.classify(gotResults);
}

function gotResults(err, results) {
  if (err) {
    console.error(err);
  }

  select("#result").html(results);
  classify();
}
setup();
