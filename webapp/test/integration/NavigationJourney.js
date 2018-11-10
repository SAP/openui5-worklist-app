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

	QUnit.module("Navigation", {
		beforeEach: function() {
			mockserver.init();
		},
		afterEach: function() {
			mockserver.shutdown();
		}
	});

	opaTest("Should see the objects list", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheTable();
	});

	opaTest("Should react on hash change", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iRememberTheItemAtPosition(2);
		When.onTheBrowser.iChangeTheHashToTheRememberedItem();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheRememberedObject().
			and.theViewIsNotBusyAnymore();
	});

	opaTest("Should go back to the TablePage", function (Given, When, Then) {
		// Actions
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheTable();
	});

	opaTest("Object Page shows the correct object Details", function (Given, When, Then) {
		// Actions
		When.onTheWorklistPage.iRememberTheItemAtPosition(1).
			and.iPressATableItemAtPosition(1);

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheRememberedObject();
	});

	opaTest("Should be on the table page again when browser back is pressed", function (Given, When, Then) {
		// Actions
		When.onTheBrowser.iPressOnTheBackwardsButton();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheTable();
	});

	opaTest("Should be on the object page again when browser forwards is pressed", function (Given, When, Then) {
		// Actions
		When.onTheBrowser.iPressOnTheForwardsButton();

		// Assertions
		Then.onTheObjectPage.iShouldSeeTheRememberedObject();

		// Cleanup
		Then.iTeardownMyApp();
	});

	QUnit.module("Service errors", {
		beforeEach: function() {
			mockserver.init({
				forceMetadataError: true,
				forceRequestError: true
			});
		},
		afterEach: function() {
			mockserver.shutdown();
		}
	});

	opaTest("Start the App and simulate metadata error: MessageBox should be shown", function (Given, When, Then) {
		// Arrangement
		Given.iStartMyApp();

		// Assertions
		Then.onTheAppPage.iShouldSeeTheServiceErrorMessageBox();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Start the App and simulate bad request error: MessageBox should be shown", function (Given, When, Then) {
		// Arrangement
		Given.iStartMyApp();

		// Assertions
		Then.onTheAppPage.iShouldSeeTheServiceErrorMessageBox();

		// Cleanup
		Then.iTeardownMyApp();
	});

});