import {DEFAULT_X, DEFAULT_Y} from '../constants';

export const getSum = (a, b) => a + b;

export const getRatio = (a, b) => a / b;

export const getAverage = (...values) => (values.reduce(getSum, 0) / values.length).toFixed();

export const getDefaultArray = (amount, defaultValue = 0) => Array(amount).fill(defaultValue);

export const getLabels = amount => [...Array(amount).keys()];

export const getImageData = (ctx, width, height) => ctx.getImageData(DEFAULT_X, DEFAULT_Y, width, height).data;

export const renderImage = (ctx, image, width, height) => ctx.drawImage(image, DEFAULT_X, DEFAULT_Y, width, height);

export const clearCanvas = (ctx, width, height) => ctx.clearRect(DEFAULT_X, DEFAULT_Y, width, height);