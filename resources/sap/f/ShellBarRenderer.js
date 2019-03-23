/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Renderer"],function(e){"use strict";return{render:function(e,r){e.write("<div");e.addClass("sapFShellBar");e.writeControlData(r);e.writeClasses();e.write(">");e.renderControl(r._getOverflowToolbar());e.write("</div>")}}},true);