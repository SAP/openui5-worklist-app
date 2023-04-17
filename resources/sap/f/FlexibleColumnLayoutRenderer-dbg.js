/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["sap/ui/Device", "sap/m/library"],
	function (Device, mobileLibrary) {
		"use strict";

		var FCLRenderer = {
			apiVersion: 2
		};

		FCLRenderer.render = function (oRm, oControl) {

			var sBackgroundDesign = oControl.getBackgroundDesign(),
				oLandmarkInfo = oControl.getLandmarkInfo();

			oRm.openStart("div", oControl);
			oRm.class("sapFFCL");

			if (sBackgroundDesign !== mobileLibrary.BackgroundDesign.Transparent) {
				oRm.class("sapFFCLBackgroundDesign" + sBackgroundDesign);
			}

			oRm.openEnd();

			FCLRenderer.renderBeginColumn(oRm, oControl, oLandmarkInfo);
			FCLRenderer.renderMidColumn(oRm, oControl, oLandmarkInfo);
			FCLRenderer.renderEndColumn(oRm, oControl, oLandmarkInfo);

			oRm.close("div");
		};

		FCLRenderer.renderBeginColumn = function (oRm, oControl, oLandmarkInfo) {
			var oBeginColumnBackArrow = oControl.getAggregation("_beginColumnBackArrow");

			// Begin column
			oRm.openStart("div", oControl.getId() + "-beginColumn");
			oRm.accessibilityState(oControl, oControl._formatColumnLandmarkInfo(oLandmarkInfo, "FirstColumn"));
			oRm.class("sapFFCLColumn");
			oRm.class("sapFFCLColumnBegin");
			oRm.class("sapFFCLColumnActive");
			oRm.openEnd();

			// Begin column content
			FCLRenderer.renderColumnContentWrapper(oRm);

			oRm.close("div");

			// Arrow - collapse begin
			FCLRenderer.renderArrow(oRm, oBeginColumnBackArrow, oLandmarkInfo, oControl);
		};

		FCLRenderer.renderMidColumn = function (oRm, oControl, oLandmarkInfo) {
			var oMidColumnForwardArrow = oControl.getAggregation("_midColumnForwardArrow"),
				oMidColumnBackArrow = oControl.getAggregation("_midColumnBackArrow");

			// Arrow - expand begin
			FCLRenderer.renderArrow(oRm, oMidColumnForwardArrow, oLandmarkInfo, oControl);
			// Mid column
			oRm.openStart("div", oControl.getId() + "-midColumn");
			oRm.accessibilityState(oControl, oControl._formatColumnLandmarkInfo(oLandmarkInfo, "MiddleColumn"));
			oRm.class("sapFFCLColumn");
			oRm.class("sapFFCLColumnMid");
			oRm.openEnd();

			// Mid column content
			FCLRenderer.renderColumnContentWrapper(oRm);
			oRm.close("div");
			// Arrow - expand end
			FCLRenderer.renderArrow(oRm, oMidColumnBackArrow, oLandmarkInfo, oControl);

		};

		FCLRenderer.renderEndColumn = function (oRm, oControl, oLandmarkInfo) {
			var oEndColumnForwardArrow = oControl.getAggregation("_endColumnForwardArrow");

			// Arrow - right
			FCLRenderer.renderArrow(oRm, oEndColumnForwardArrow, oLandmarkInfo, oControl);
			// End column
			oRm.openStart("div", oControl.getId() + "-endColumn");
			oRm.accessibilityState(oControl, oControl._formatColumnLandmarkInfo(oLandmarkInfo, "LastColumn"));
			oRm.class("sapFFCLColumn");
			oRm.class("sapFFCLColumnEnd");
			oRm.openEnd();

			// End column content
			FCLRenderer.renderColumnContentWrapper(oRm);

			oRm.close("div");

		};

		FCLRenderer.renderArrow = function (oRm, oArrow, oLandmarkInfo, oFCL) {
			if (!Device.system.phone) {
				oRm.openStart("div");
				oRm.accessibilityState(oArrow, oFCL._formatArrowLandmarkInfo(oLandmarkInfo, oArrow.sParentAggregationName));
				oRm.class("sapFFCLArrow");
				oRm.class("sapContrastPlus");
				oRm.openEnd();
				oRm.renderControl(oArrow);
				oRm.close("div");
			}
		};

		FCLRenderer.renderColumnContentWrapper = function (oRm) {
			oRm.openStart("div");
			oRm.class("sapFFCLColumnContent");
			oRm.openEnd();
			oRm.close("div");
		};

		return FCLRenderer;

	}, /* bExport= */ true);
