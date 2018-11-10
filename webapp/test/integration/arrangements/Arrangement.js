sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	return Opa5.extend("sap.ui.demo.worklist.test.integration.arrangements.Arrangement", {

		iStartMyApp: function (oOptions) {
			oOptions = oOptions || {};

			this.iStartMyUIComponent({
				componentConfig: {
					name: "sap.ui.demo.worklist",
					async: true
				},
				hash: oOptions.hash
			});
		},

		iRestartTheAppWithTheRememberedItem: function (oOptions) {
			oOptions = oOptions || {};

			var sObjectId;
			this.waitFor({
				success : function () {
					sObjectId = this.getContext().currentItem.id;
				}
			});

			return this.waitFor({
				success : function() {
					oOptions.hash = "/Objects/" + encodeURIComponent(sObjectId);
					this.iStartMyApp(oOptions);
				}
			});
		}

	});

});
