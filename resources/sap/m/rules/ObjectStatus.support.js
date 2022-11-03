/*!
 * OpenUI5
 * (c) Copyright 2009-2022 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/support/library"],function(t){"use strict";var e=t.Categories,i=t.Severity,s=t.Audiences;var r={id:"objectStatusActive",audiences:[s.Control],categories:[e.Usage],enabled:true,minversion:"*",title:"ObjectStatus: active property",description:"Checks if active property is set to true but no icon or text are set.",resolution:"Set text or icon when active property is true",resolutionurls:[{text:"API Reference: sap.m.ObjectStatus",href:"https://sdk.openui5.org/api/sap.m.ObjectStatus"}],check:function(t,e,s){s.getElementsByClassName("sap.m.ObjectStatus").forEach(function(e){var s=e.getId(),r=e.getMetadata().getElementName();if(e.getActive()&&!e.getText()&&!e.getIcon()){t.addIssue({severity:i.Medium,details:"ObjectStatus '"+r+"' ("+s+") sets active to true but no icon or text.",context:{id:s}})}})}};return[r]},true);