/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/support/library"],function(e){"use strict";var t=e.Categories,r=e.Severity,i=e.Audiences;var a={id:"objectMarkerAdditionalInfo",audiences:[i.Control],categories:[t.Usage],enabled:true,minversion:"*",title:"ObjectMarker: additionalInfo property",description:"Checks if additionalInfo property is used but no type is set",resolution:"Set type of the ObjectMarker",resolutionurls:[{text:"API Reference: sap.m.ObjectMarker",href:"https://sdk.openui5.org/api/sap.m.ObjectMarker"}],check:function(e,t,i){i.getElementsByClassName("sap.m.ObjectMarker").forEach(function(t){var i=t.getId(),a=t.getMetadata().getElementName();if(t.getAdditionalInfo()&&!t.getType()){e.addIssue({severity:r.Medium,details:"ObjectMarker '"+a+"' ("+i+") sets additionalInfo but has no type.",context:{id:i}})}})}};return[a]},true);