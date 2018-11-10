sap.ui.define([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"./Common"
], function(Opa5, PropertyStrictEquals, Common) {
	"use strict";

		Opa5.createPageObjects({
			onTheAppPage : {
				baseClass : Common,

				actions : {

				iWaitUntilTheAppBusyIndicatorIsGone : function () {
					return this.waitFor({
						id : "app",
						viewName : "App",
						matchers: new PropertyStrictEquals({
							name: "busy",
							value: false
						}),
						autoWait: false,
						success : function () {
							Opa5.assert.ok(true, "The app is not busy");
						},
						errorMessage : "The app is busy"
					});
				}
			},

			assertions : {

				iShouldSeeTheBusyIndicatorForTheWholeApp : function () {
					return this.waitFor({
						id : "app",
						viewName : "App",
						matchers : new PropertyStrictEquals({
							name : "busy",
							value : true
						}),
						autoWait: false,
						success : function () {
							// we set the view busy, so we need to query the parent of the app
							Opa5.assert.ok(true, "The app is busy");
						},
						errorMessage : "The App is not busy"
					});
				},

				iShouldSeeTheServiceErrorMessageBox : function () {
					return this.waitFor({
						id: "serviceErrorMessageBox",
						controlType : "sap.m.Dialog",
						autoWait: false,
						matchers : new PropertyStrictEquals({ name: "type", value: "Message"}),
						success : function (oDialog) {
							Opa5.assert.ok(true, "The correct MessageBox was shown");
							// It's needed to close the error dialog just in case another one is
							// going to be opened in following tests, as its ID is always the same
							oDialog.close()
						}
					});
				}
			}
		}
	});
});