/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/demo/worklist/localService/mockserver",
	"./pages/Worklist",
	"./pages/Browser",
	"./pages/Object",
	"./pages/App"
], function (opaTest, mockserver) {
	"use strict";

	QUnit.module("Object", {
		beforeEach: function() {
			mockserver.init({
				// By default it takes 1 second for busy indicators to show up
				// Adding extra delay allows testing them
				delay: 2000
			});
		},
		afterEach: function() {
			mockserver.shutdown();
		}
	});

	opaTest("Should remember the first item", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheWorklistPage.iRememberTheItemAtPosition(1);

		// Assertions
		Then.onTheWorklistPage.theTitleShouldDisplayTheTotalAmountOfItems();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should start the app with remembered item", function (Given, When, Then) {
		// Arrangements
		Given.iRestartTheAppWithTheRememberedItem();

		// Actions
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheObjectViewsBusyIndicator().
		and.theObjectViewsBusyIndicatorDelayIsRestored().
		and.iShouldSeeTheRememberedObject().
		and.theObjectViewShouldContainOnlyFormattedUnitNumbers();

		// Cleanup
		Then.iTeardownMyApp();
	});

});
