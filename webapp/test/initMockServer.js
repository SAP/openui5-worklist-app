sap.ui.define([
	"../localService/mockserver"
], function (mockserver, MessageBox) {
	"use strict";

	var aMockservers = [];

	// initialize the mock server
	aMockservers.push(mockserver.init());
	
	// load configure sap.m with async load
	sap.ui.getCore().loadLibrary("sap.m", {async: true});

	Promise.all(aMockservers).catch(function (oError) {
		sap.ui.require(["sap/m/MessageBox"], function(MessageBox){
			MessageBox.error(oError.message);
		});
	}).finally(function () {
		// initialize the embedded component on the HTML page
		sap.ui.require(["sap/ui/core/ComponentSupport"]);
	});
});