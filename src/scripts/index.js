import {CHART_COLOR, CHART_LABEL, GRADATION_AMOUNT} from './constants';
import {
    getAverage,
    getDefaultArray,
    getLabels,
    getImageData,
    renderImage,
    clearCanvas,
    clearChart,
    setCanvasHeight,
    getRatio
} from './utils';
import '../styles/style.css';

const filePicker = document.querySelector('.histo_file');
const chartCanvas = document.querySelector('.canvas__histogram');
const imageCanvas = document.querySelector('.canvas__image');

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

const setAppData = (imgCanvas, chartCanvas, imgData, chart) => {
    const ctx = imgCanvas.getContext('2d');
    const image = new Image();

    image.src = imgData;
    image.onload = () => {
        const currCanvasHeight = image.height * getRatio(imgCanvas.width, image.width);

        clearChart(chart);
        clearCanvas(ctx, imgCanvas.width, imgCanvas.height);

        setCanvasHeight(imgCanvas, currCanvasHeight);

        renderImage(ctx, image, imgCanvas.width, imgCanvas.height);
        renderHistogram(
            chartCanvas,
            getLabels(GRADATION_AMOUNT),
            getPixelsBrightness(getImageData(ctx, image.width, image.height))
        );
    }
};

const onFileLoad = event => setAppData(imageCanvas, chartCanvas, event.target.result, chart);

const readFile = event => {
    const FR = new FileReader();

    FR.readAsDataURL(event.srcElement.files[0]);
    FR.addEventListener('load', onFileLoad, false);
};

filePicker.addEventListener('change', readFile, false);