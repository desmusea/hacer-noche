document.addEventListener('DOMContentLoaded', function () {
  const poemFragments = [
    'En una noche oscura,\n',
    'con ansias en amores inflamada\n',
    '¡oh dichosa ventura!\n',
    'salí sin ser notada,\n',
    'estando ya mi casa sosegada.\n',
    'A oscuras y segura,\n',
    'por la secreta escala, disfrazada,\n',
    '¡oh dichosa ventura!\n',
    'a oscuras y en celada,\n',
    'estando ya mi casa sosegada.\n',
    'En la noche dichosa,\n',
    'en secreto, que nadie me veía,\n',
    'ni yo miraba cosa,\n',
    'sin otra luz y guía\n',
    'sino la que en el corazón ardía.\n',
    'Aquesta me guiaba\n',
    'más cierto que la luz del mediodía\n',
    'a donde me esperaba\n',
    'quien yo bien me sabía,\n',
    'en parte donde nadie parecía.\n',
  ];

  const URL = 'https://teachablemachine.withgoogle.com/models/Gy5mZyr8b/';
  const poemContainer = document.getElementById('poemContainer');
  const restart = document.getElementById('restart');
  const button = document.getElementById('button');
  const labelContainer = document.getElementById('label-container');
  let poemCreated = false;

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  };

  const generatePoem = () => {
    const poemLength = getRandomInt(3, 7); // Generar un poema de 1 a 5 fragmentos
    const generatedPoem = generateRandomPoem(poemLength);
    displayPoem(generatedPoem);
    poemCreated = true;
  };

  const generateRandomPoem = (length) => {
    let randomPoem = '';
    for (let i = 0; i < length; i++) {
      const randomFragment =
        poemFragments[Math.floor(Math.random() * poemFragments.length)];
      randomPoem += randomFragment + ' ';
    }
    return randomPoem;
  };

  const displayPoem = (poemText) => {
    const poemLines = poemText.split('\n');
    poemContainer.innerHTML = '';
    for (let i = 0; i < poemLines.length; i++) {
      const line = poemLines[i].trim();
      if (line) {
        const p = document.createElement('p');
        p.textContent = line;
        poemContainer.appendChild(p);
      }
    }
  };

  let model, webcam, maxPredictions;

  async function init() {
    document.getElementById('webcam-container').innerHTML = '';
    labelContainer.innerHTML = '✦';
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);
    document.getElementById('webcam-container').appendChild(webcam.canvas);
    labelContainer.innerHTML = '';
    button.classList.add('hidden');

    for (let i = 0; i < maxPredictions; i++) {
      labelContainer.appendChild(document.createElement('div'));
    }
  }
  button.addEventListener('click', init);

  async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
  }

  const onRestart = () => {
    poemContainer.innerHTML = '';
    restart.classList.add('hidden');
    poemCreated = false;
  };

  restart.addEventListener('click', onRestart);

  async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
      if (
        prediction[i].probability.toFixed(2) === '1.00' &&
        prediction[i].className == 'belomancie' &&
        !poemCreated
      ) {
        generatePoem();
        restart.classList.remove('hidden');
      }
    }
  }
});
