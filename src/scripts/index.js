import {CHART_COLOR, CHART_LABEL, GRADATION_AMOUNT} from './constants';
import {getAverage, getDefaultArray, getLabels, getImageData, renderImage, clearCanvas, getRatio} from './utils';
import '../styles/style.css';

const filePicker = document.querySelector('.histo_file');
const histogram = document.querySelector('.canvas__histogram');
const canvas = document.querySelector('.canvas__image');

let chart = null;

const getPixelsBrightness = (imageData, step = 4) => {
    const pixelsBrightness = getDefaultArray(GRADATION_AMOUNT);

    for (let i = 0; i < imageData.length; i += step) {
        const currBrightness = getAverage(imageData[i], imageData[i + 1], imageData[i + 2]);

        pixelsBrightness[currBrightness] += 1;
    }
    return pixelsBrightness;
};

const renderHistogram = (canvas, labels, data) => {
    chart && chart.destroy();

    chart = new Chart(canvas, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                data,
                label: CHART_LABEL,
                backgroundColor: CHART_COLOR
            }]
        }
    });
};

const drawHistogram = (image, ctx, canvas, histogram) => {
    const labels = getLabels(GRADATION_AMOUNT);

    canvas.height = image.height * getRatio(canvas.width, image.width);

    clearCanvas(ctx, canvas.width, canvas.height);
    renderImage(ctx, image, canvas.width, canvas.height);
    renderHistogram(histogram, labels, getPixelsBrightness(getImageData(ctx, canvas.width, canvas.height)));
};

const setAppData = (canvas, histogram, imgData) => {
    const ctx = canvas.getContext('2d');
    const image = new Image();
    const onImageLoad = () => drawHistogram(image, ctx, canvas, histogram);

    image.addEventListener('load', onImageLoad, false);
    image.src = imgData;
};

const onFileLoad = event => setAppData(canvas, histogram, event.target.result);

const readFile = event => {
    const FR = new FileReader();

    FR.readAsDataURL(event.srcElement.files[0]);
    FR.addEventListener('load', onFileLoad, false);
};

filePicker.addEventListener('change', readFile, false);