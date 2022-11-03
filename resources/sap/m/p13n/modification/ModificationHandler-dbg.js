/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/Object",
	"sap/ui/core/util/reflection/JsControlTreeModifier"
], function(BaseObject, JsControlTreeModifier) {
	"use strict";

	var oModificationHandler;

	/**
	 * @class This class offers modification capabilities without persistence.
     * It should be used as the persistence layer in the {@link sap.m.p13n.Engine#register Engine#register} process.
	 *
	 * @author SAP SE
	 * @public
     * @experimental Since 1.104.
	 * @alias sap.m.p13n.modification.ModificationHandler
	 */
	var ModificationHandler = BaseObject.extend("sap.m.p13n.modification.ModificationHandler");

	var mInitialState = new WeakMap();

	/**
	 * Should implement the appliance of changes
	 *
	 * @param {array} aChanges An array of changes
	 * @param {object} oModificationPayload An object providing a modification handler specific payload
	 * @returns {Promise} Returns a <code>Promise</code> reflecting change processing
	 */
	ModificationHandler.prototype.processChanges = function(aChanges, oModificationPayload){

		var aChangeAppliance = [];

		aChanges.forEach(function(oChange){
			var oChangeContent = oChange.changeSpecificData.content;
			var oControl = oChange.selectorElement;
			var sChangeType = oChange.changeSpecificData.changeType;
			// var oItem = sap.ui.getCore().byId(oChangeContent.name);
			// var sTargetAggregation = oChangeContent.targetAggregation;
			// var oSelector = oChange.selectorElement;
			// var oContent = oChange.changeSpecificData.content;

			var oTransientChange = {
				getContent: function() {
					return oChangeContent;
				},

				getChangeType: function() {
					return sChangeType;
				},

				getControl: function() {
					return oControl;
				},

				setRevertData: function() {
				}
			};

			var oPromise = new Promise(function(resolve){
				sap.ui.require(["sap/m/flexibility/EngineFlex"], function(EngineFlex){
					var pAppliance = EngineFlex[sChangeType].changeHandler.applyChange(oTransientChange, oControl, {
						modifier: JsControlTreeModifier
					});

					resolve(pAppliance);
				});
			});

			aChangeAppliance.push(oPromise);
		});

		return Promise.all(aChangeAppliance);
	};

	/**
	 * Should implement a function that returns a promise resolving
	 * after the current pending changes have been applied.
	 *
	 * @private
	 * @param {object} mPropertyBag A propertybag containing modification specific configuration
	 * @param {sap.ui.core.Element} mPropertyBag.element The according element which should be checked
	 * @param {object} oModificationPayload An object providing a modification handler specific payload
	 * @returns {Promise} Returns a <code>Promise</code> reflecting change appliance

	 */
	ModificationHandler.prototype.waitForChanges = function(mPropertyBag, oModificationPayload) {
		return Promise.resolve();
	};

	/**
	 * Should implement a function that returns a promise resolving
	 * after the current pending changes have been reset.
	 *
	 * @private
	 * @param {object} mPropertyBag A propertybag containing modification specific configuration
	 * @param {sap.ui.core.Element} mPropertyBag.selector The according element which should be checked
	 * @param {object} oModificationPayload An object providing a modification handler specific payload
	 * @returns {Promise} Returns a <code>Promise</code> reflecting the reset execution
	 */
	ModificationHandler.prototype.reset = function(mPropertyBag, oModificationPayload) {
		var oControl = mPropertyBag.selector;
		return sap.m.p13n.Engine.getInstance().applyState(oControl, mInitialState.get(oControl), true);
	};

	ModificationHandler.prototype.initialize = function(oControl) {
		var pInitial, oInitialState;

		pInitial = sap.m.p13n.Engine.getInstance().retrieveState(oControl)
		.then(function(oRetrievedState){
			oInitialState = oRetrievedState;
			mInitialState.set(oControl, oInitialState);
		});

		return pInitial;
	};

	/**
	 * Should implement a function that returns information ont modification support
	 *
	 * @private
	 * @param {object} mPropertyBag A propertybag containing modification specific configuration
	 * @param {sap.ui.core.Element} mPropertyBag.selector The according element which should be checked
	 * @param {object} oModificationPayload An object providing a modification handler specific payload
 	 * @returns {boolean} reflects the modification support state
	 */
	ModificationHandler.prototype.isModificationSupported = function(mPropertyBag, oModificationPayload){
		return false;
	};

	/**
	 * Called after the initial registration during the <code>Engine#register</code> process.
	 *
	 * @private
	 * @param {sap.ui.core.Control} oControl The initialized control instance
	 * @returns {Promise} Returns a <code>Promise</code> after initialization
	 */
	ModificationHandler.prototype.initialize = function(oControl) {
		return Promise.resolve();
	};

	ModificationHandler.getInstance = function() {
		if (!oModificationHandler){
			oModificationHandler = new ModificationHandler();
		}
		return oModificationHandler;
	};

	return ModificationHandler;
});