import {CHART_COLOR, CHART_LABEL, GRADATION_AMOUNT, GRADATION_MAX, DEFAULT_X, DEFAULT_Y} from './constants';
import {getAverage, getDefaultArray, getLabels, getImageData, render, clearCanvas, getRatio, getExtremePoints} from './utils';
import '../styles/style.css';

const filePicker = document.querySelector('.histo_file');
const histogram = document.querySelector('.canvas__histogram');
const canvas = document.querySelector('.canvas__image');
const normalizeBtn = document.querySelector('.histo_normalize');

let chart = null;

const getPixelsBrightness = (imageData, step = 4) => {
    const pixelsBrightness = [];

    for (let i = 0; i < imageData.length; i += step) {
        const currBrightness = getAverage(imageData[i], imageData[i + 1], imageData[i + 2]);

        pixelsBrightness.push(currBrightness);
    }
    return pixelsBrightness;
};

const getPixelsByAmount = pixels => {
    const pixelsByAmount = getDefaultArray(GRADATION_AMOUNT);

    for (let i = 0; i < pixels.length; i++) {
        pixelsByAmount[pixels[i]] += 1;
    }
    return pixelsByAmount;
};

const getNormalizedPixels = (pixels, {min, max}) => {
    const normalizedPixels = [];

    for (let i = 0; i < pixels.length; i++) {
        const normalizedPixel = Math.abs(Math.round((pixels[i] - min) * GRADATION_MAX / (max - min)));

        normalizedPixels.push(normalizedPixel);
    }
    return normalizedPixels;
};

const convertToImgData = (ctx, canvas, pixels, step = 4) => {
    let imgData = ctx.createImageData(canvas.width, canvas.height);
    let currPixelIndex = 0;

    for (let i = 0; i < imgData.data.length; i += step) {
        imgData.data[i] = pixels[currPixelIndex];
        imgData.data[i + 1] = pixels[currPixelIndex];
        imgData.data[i + 2] = pixels[currPixelIndex];
        imgData.data[i + 3] = GRADATION_MAX;

        currPixelIndex += 1;
    }
    return imgData;
};

const renderHistogram = (canvas, labels, data, label = CHART_LABEL, backgroundColor = CHART_COLOR) => {
    chart && chart.destroy();

    chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{data, label, backgroundColor}]
        }
    });
};

const normalizeImage = (ctx, canvas, pixelsBrightness, pixelsByAmount, histogram, labels) => {
    const normalizedPixels = getNormalizedPixels(pixelsBrightness, getExtremePoints(pixelsByAmount));
    const imgData = convertToImgData(ctx, canvas, normalizedPixels);

    renderHistogram(histogram, labels, getPixelsByAmount(normalizedPixels));
    ctx.putImageData(imgData, DEFAULT_X, DEFAULT_Y);
};

const initImage = (image, ctx, canvas) => {
    canvas.height = image.height * getRatio(canvas.width, image.width);

    clearCanvas(ctx, canvas.width, canvas.height);
    render(ctx, canvas.width, canvas.height, image);
};

const initHistogram = (image, ctx, canvas, histogram) => {
    const labels = getLabels(GRADATION_AMOUNT);
    const pixelsBrightness = getPixelsBrightness(getImageData(ctx, canvas));
    const pixelsByAmount = getPixelsByAmount(pixelsBrightness);

    const onNormalizeClick = () => normalizeImage(ctx, canvas, pixelsBrightness, pixelsByAmount, histogram, labels);

    renderHistogram(histogram, labels, pixelsByAmount);

    normalizeBtn.removeEventListener('click', onNormalizeClick, false);
    normalizeBtn.addEventListener('click', onNormalizeClick, false);
};

const setAppData = (canvas, histogram, imgData) => {
    const ctx = canvas.getContext('2d');
    const image = new Image();

    const onImageLoad = () =>  {
        initImage(image, ctx, canvas);
        initHistogram(image, ctx, canvas, histogram);
    };

    image.addEventListener('load', onImageLoad, false);
    image.src = imgData;
};

const readFile = event => {
    const FR = new FileReader();
    const onFileLoad = event => setAppData(canvas, histogram, event.target.result);

    FR.readAsDataURL(event.srcElement.files[0]);
    FR.addEventListener('load', onFileLoad, false);
};

filePicker.addEventListener('change', readFile, false);