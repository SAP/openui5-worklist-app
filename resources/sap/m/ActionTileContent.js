/*!
* OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
*/
sap.ui.define(["./library","sap/m/TileContent","sap/m/ActionTileContentRenderer"],function(t,e,r){"use strict";var i=t.Priority;var a=e.extend("sap.m.ActionTileContent",{metadata:{library:"sap.m",aggregations:{attributes:{type:"sap.m.CustomAttribute",multiple:true,singularName:"attribute"}}},renderer:{apiVersion:2,render:function(t,e){r.render(t,e)}}});a.prototype.getAltText=function(){var t="";var e=sap.ui.getCore().getLibraryResourceBundle("sap.m").getText("TEXT_CONTENT_PRIORITY");var r=this.getPriorityText();var a=this.getAggregation("attributes");if(this.getPriority()!==i.None&&r){t+=r+" "+e+"\n"}for(var n=0;n<a.length&&n<4;n++){t+=a[n].getLabel()+"\n"+a[n].getValue()+"\n"}return t.trim()};return a});