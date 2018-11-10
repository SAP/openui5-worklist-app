/*global QUnit*/

sap.ui.define([
	"sap/ui/test/opaQunit",
	"sap/ui/demo/worklist/localService/mockserver",
	"./pages/Worklist",
	"./pages/App"
], function (opaTest, mockserver) {
	"use strict";

	QUnit.module("App", {
		beforeEach: function() {
			mockserver.init({
				// By default it takes 1 second for busy indicators to show up
				// Adding extra delay allows testing them
				delay: 5000
			});
		},
		afterEach: function() {
			mockserver.shutdown();
		}
	});

	opaTest("Should see the busy indicator on app view while worklist view metadata is loaded", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheAppPage.iShouldSeeTheBusyIndicatorForTheWholeApp();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Should see the busy indicator on worklist table after metadata is loaded", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheAppPage.iWaitUntilTheAppBusyIndicatorIsGone();

		// Assertions
		Then.onTheWorklistPage.iShouldSeeTheWorklistTableBusyIndicator();

		// Cleanup
		Then.iTeardownMyApp();
	});

	QUnit.module("Worklist", {
		beforeEach: function() {
			mockserver.init();
		},
		afterEach: function() {
			mockserver.shutdown();
		}
	});

	opaTest("Should see the table with all entries", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Assertions
		Then.onTheWorklistPage.theTableShouldHaveAllEntries().
			and.theTableShouldContainOnlyFormattedUnitNumbers().
			and.theTitleShouldDisplayTheTotalAmountOfItems();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Search for the First object should deliver results that contain the firstObject in the name", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheWorklistPage.iSearchForTheFirstObject();

		// Assertions
		Then.onTheWorklistPage.theTableShowsOnlyObjectsWithTheSearchStringInTheirTitle();

		// Cleanup
		Then.iTeardownMyApp();
	});

	opaTest("Entering something that cannot be found into search field and pressing search field's refresh should leave the list as it was", function (Given, When, Then) {
		// Arrangements
		Given.iStartMyApp();

		// Actions
		When.onTheWorklistPage.iTypeSomethingInTheSearchThatCannotBeFoundAndTriggerRefresh();

		// Assertions
		Then.onTheWorklistPage.theTableHasEntries();

		// Cleanup
		Then.iTeardownMyApp();
	});

});