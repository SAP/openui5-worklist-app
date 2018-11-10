sap.ui.define([
		"sap/ui/core/util/MockServer"
	], function (MockServer) {
		"use strict";

		var oMockServer,
			_fnErrResponse = function (iErrCode, sMessage, oRequest) {
				oRequest.response = function(oXhr){
					oXhr.respond(iErrCode, {"Content-Type": "text/plain;charset=utf-8"}, sMessage);
				};
			},
			_sAppModulePath = "sap/ui/demo/worklist/",
			_sJsonFilesModulePath = _sAppModulePath + "localService/mockdata";

		return {

			/**
			 * Initializes the mock server.
			 * The local mock data in this folder is returned instead of the real data for testing.
			 * @param {Object} oOptions Options for the mock server
			 * @param {boolean} [oOptions.forceMetadataError=false] Forces the mockserver to return error on metadata requests.
			 * @param {boolean} [oOptions.forceRequestError=false] Forces the mockserver to return error on requests other than metadata.
			 * @param {int} [oOptions.errorCode=500] Error code to return on requests other than metadata.
			 * @param {int} [oOptions.delay=1000] Server delay on responses.
			 * @public
			 * @returns {sap.ui.core.util.MockServer} The initialized mockserver.
			 */
			init: function (oOptions) {
				oOptions = oOptions || {};
				var sJsonFilesUrl = sap.ui.require.toUrl(_sJsonFilesModulePath),
					sManifestUrl = sap.ui.require.toUrl(_sAppModulePath + "manifest.json"),
					oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
					oMainDataSource = oManifest["sap.app"].dataSources.mainService,
					sMetadataUrl = sap.ui.require.toUrl(_sAppModulePath + oMainDataSource.settings.localUri),
					// ensure there is a trailing slash
					sMockServerUrl = /.*\/$/.test(oMainDataSource.uri) ? oMainDataSource.uri : oMainDataSource.uri + "/",
					bForceMetadataError = oOptions.forceMetadataError || false,
					bForceRequestError = oOptions.forceRequestError || false,
					iErrorCode = oOptions.errorCode || 500,
					iDelay = oOptions.delay || 1000;

				MockServer.config({
					autoRespond : true,
					autoRespondAfter : iDelay
				});

				oMockServer = new MockServer({
					rootUri : sMockServerUrl
				});

				// Simulate a manual back-end call
				oMockServer.simulate(sMetadataUrl, {
					sMockdataBaseUrl : sJsonFilesUrl,
					bGenerateMissingMockData : true
				});

				if (bForceMetadataError) {
					this._forceMetadataError();
				}
				if (bForceRequestError) {
					this._forceRequestError(iErrorCode);
				}

				oMockServer.start();

				jQuery.sap.log.info("Running the app with mock data");

				return oMockServer;
			},

			/**
			 * Stops and removes the mockserver instance.
			 * @public
			 */
			shutdown: function () {
				oMockServer.stop();
				oMockServer.destroy();
				oMockServer = null;
			},

			/**
			 * Returns the mockserver of the app, which should be used in integration tests.
			 * @public
			 * @returns {sap.ui.core.util.MockServer} the mockserver instance.
			 */
			getMockServer: function () {
				return oMockServer;
			},

			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Forces the server to return an error response on metadata requests.
			 * @private
			 */
			_forceMetadataError: function () {
				var aRequests = oMockServer.getRequests();

				aRequests.forEach(function(oEntry) {
					var bIsMetadata = oEntry.path.toString().indexOf("$metadata") > -1;

					if (bIsMetadata) {
						// handler for metadata error test
						_fnErrResponse(500, "metadata Error", oEntry);
					}
				});

				oMockServer.setRequests(aRequests);
			},

			/**
			 * Forces the server to return an error response on requests other than metadata.
			 * @param {int} iErrorCode Error code.
			 * @private
			 */
			_forceRequestError: function (iErrorCode) {
				var aRequests = oMockServer.getRequests();

				aRequests.forEach(function(oEntry) {
					var bIsMetadata = oEntry.path.toString().indexOf("$metadata") > -1;

					if (!bIsMetadata) {
						// handler for request error test
						_fnErrResponse(iErrorCode, "request Error", oEntry);
					}
				});

				oMockServer.setRequests(aRequests);
			}
		};

	}
);