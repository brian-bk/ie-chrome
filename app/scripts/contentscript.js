import * as tf from '@tensorflow/tfjs';

// Global decleration of model, loaded in main() by tensorflowjs
let model;

const replacements = [
    ["Google Chrome", "Internet Explorer"],
    ["google chrome", "internet explorer"],
    ["GoogleChrome", "InternetExplorer"],
    ["googlechrome", "internetexplorer"],
    ["Chrome Browser", "Internet Explorer Browser"],
    ["Chrome browser", "Internet Explorer browser"],
    ["chrome browser", "internet explorer browser"],
    ["Download Chrome", "Download Internet Explorer"],
    ["download Chrome", "download Internet Explorer"],
];

/**
 * Recursively run func on every node and child node from
 * node provided.
 * @param {Node} node 
 * @param {Function} func 
 */
function traverseDOM(node, func) {
    func(node);
    node = node.firstChild;
    while(node) {
        traverseDOM(node, func);
        node = node.nextSibling;
    }
}

/**
 * If node is text and not empty, replace text
 * @param {Node} node 
 */
function replaceText(node) {
    if(node.nodeType !== 3 || !node.textContent.trim().length > 0) { return; }
    node.textContent = replacements.reduce(
        (text, replacement) => text.replace(replacement[0], replacement[1]),
        node.textContent
    );
}

/**
 * If node is an image, predict and see if we should replace it
 * @param {Node} node 
 */
function replaceImage(node) {
    if(node.nodeType !== 1 || node.nodeName !== 'IMG') { return; }
    // Before prediction make sure we don't block execution
    setTimeout(() => {
        const tensor = tf.browser.fromPixels(node)
            .resizeNearestNeighbor([256, 256])
            .toFloat()
            .expandDims();
        
        const prediction = model.predict(tensor)
        const predictionData = prediction.dataSync()[0];

        if(predictionData < 0.5) {
            node.crossOrigin = 'anonymous';
            node.src = browser.extension.getURL('/images/icon-256.png');
        }

    }, 0);
}


function main() {
    traverseDOM(document.body, replaceText);
    // Before loading model make sure we don't block execution
    setTimeout(() => {
        console.log('Loading model');
        tf.loadLayersModel(browser.extension.getURL('/models/initial/model.json')).then(m => {
            console.log('Model loaded');
            model = m;
            traverseDOM(document.body, replaceImage);
        }).catch(e => {
            console.error(`Error when loading model: ${e}`);
        });
    }, 0);
}

main();
