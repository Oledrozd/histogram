import {GRADATION_MAX, DEFAULT_X, DEFAULT_Y} from '../constants';

export const getSum = (a, b) => a + b;

export const getRatio = (a, b) => a / b;

export const getAverage = (...values) => (values.reduce(getSum, 0) / values.length).toFixed();

export const getDefaultArray = (amount, defaultValue = 0) => Array(amount).fill(defaultValue);

export const getLabels = amount => [...Array(amount).keys()];

export const getImageData = (ctx, canvas) => ctx.getImageData(DEFAULT_X, DEFAULT_Y, canvas.width, canvas.height).data;

export const render = (ctx, width, height, image) => ctx.drawImage(image, DEFAULT_X, DEFAULT_Y, width, height);

export const clearCanvas = (ctx, width, height) => ctx.clearRect(DEFAULT_X, DEFAULT_Y, width, height);

export const getExtremePoints = arr => {
    let min = null;
    let max = null;

    arr.forEach((point, index) => min = min && point === 0 ? min : index);
    arr.reverse().forEach((point, index) => max = max && point === 0 ? max : GRADATION_MAX - index);

    return {min, max};
};