"use strict";

var DTClassifier = require("..").DecisionTreeClassifier;
var DTRegression = require("..").DecisionTreeRegression;
var irisDataset = require("ml-dataset-iris");
var Utils = require("../src/Utils");

describe("Basic functionality", function () {
    describe("Decision Tree Classifier", function () {
        var trainingSet = irisDataset.getNumbers();
        var predictions = irisDataset.getClasses().map(elem => irisDataset.getDistinctClasses().indexOf(elem));

        var options = {
            gainFunction: "gini",
            maxDepth: 10,
            minNumSamples: 3
        };

        var classifier = new DTClassifier(options);
        classifier.train(trainingSet, predictions);
        var result = classifier.predict(trainingSet);

        it("Decision Tree classifier with iris dataset", function () {
            var correct = 0;
            for(var i = 0 ; i < result.length; ++i) {
                if(result[i] == predictions[i]) correct++;
            }

            var score = correct / result.length;
            score.should.be.aboveOrEqual(0.7);
        });

        it("Export and import for decision tree classifier", function () {
            var model = JSON.parse(JSON.stringify(classifier.export()));

            var newClassifier = DTClassifier.load(model);
            var newResult = newClassifier.predict(trainingSet);

            for(var i = 0; i < result.length; ++i) {
                newResult[i].should.be.equal(result[i]);
            }
        });
    });

    describe("Decision tree regression", function () {
        var x = new Array(100);
        var y = new Array(100);
        var val = 0.0;
        for(var i = 0; i < x.length; ++i) {
            x[i] = val;
            y[i] = Math.sin(x[i]);
            val += 0.01;
        }

        var reg = new DTRegression();
        reg.train(x, y);
        var estimations = reg.predict(x);

        it("Decision Tree classifier with sin function", function () {
            for(i = 0; i < x.length; ++i) {
                estimations[i].should.be.approximately(y[i], 0.1);
            }
        });

        it("Export and import for decision tree classifier", function () {
            var model = JSON.parse(JSON.stringify(reg.export()));

            var newClassifier = DTRegression.load(model);
            var newEstimations = newClassifier.predict(x);

            for(var i = 0; i < estimations.length; ++i) {
                newEstimations[i].should.be.equal(estimations[i]);
            }
        });
    });


});

describe("Utils", function () {
    it("Gini gain", function () {
        Utils.giniGain([0, 1, 0, 1, 0, 1], {
            greater: [0, 0],
            lesser: [1, 1, 1, 0]
        }).should.be.approximately(0.25, 0.001);
    });

    it("Regression error", function () {
        var y = [0.5, 0.7, 0.8, 0.9, 1, 1.1];
        var splitted = {
            greater: [0.5, 0.7],
            lesser: [0.8, 0.9, 1.0, 1.1]
        };

        Utils.regressionError(y, splitted).should.be.approximately(0.07, 0.01);
    });

    it("Get number of classes", function () {
        Utils.getNumberOfClasses([0, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9]).should.be.equal(10);
    });
});