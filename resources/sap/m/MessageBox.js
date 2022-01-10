/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Button","./Dialog","./Text","./FormattedText","./Link","./VBox","sap/ui/core/IconPool","sap/ui/core/ElementMetadata","sap/ui/core/library","sap/ui/core/Control","sap/m/library","sap/ui/thirdparty/jquery"],function(e,t,i,n,o,s,a,l,r,c,u,d){"use strict";var f=u.DialogType;var O=u.DialogRoleType;var g=r.TextDirection;var p=u.ButtonType;var T=u.TitleAlignment;var I={};I.Action={OK:"OK",CANCEL:"CANCEL",YES:"YES",NO:"NO",ABORT:"ABORT",RETRY:"RETRY",IGNORE:"IGNORE",CLOSE:"CLOSE",DELETE:"DELETE"};I.Icon={NONE:undefined,INFORMATION:"INFORMATION",WARNING:"WARNING",ERROR:"ERROR",SUCCESS:"SUCCESS",QUESTION:"QUESTION"};(function(){var r=I.Action,u=I.Icon;var S=function(){if(I._rb!==sap.ui.getCore().getLibraryResourceBundle("sap.m")){I._rb=sap.ui.getCore().getLibraryResourceBundle("sap.m")}};I.show=function(C,R){var E,N,x,A=null,y=[],h,M,B,m,L,_,b,v={id:l.uid("mbox"),initialFocus:null,textDirection:g.Inherit,verticalScrolling:true,horizontalScrolling:true,details:"",contentWidth:null},F={INFORMATION:"sapMMessageBoxInfo",WARNING:"sapMMessageBoxWarning",ERROR:"sapMMessageBoxError",SUCCESS:"sapMMessageBoxSuccess",QUESTION:"sapMMessageBoxQuestion",STANDARD:"sapMMessageBoxStandard"},w={INFORMATION:a.getIconURI("information"),WARNING:a.getIconURI("alert"),ERROR:a.getIconURI("error"),SUCCESS:a.getIconURI("sys-enter-2"),QUESTION:a.getIconURI("sys-help-2")};S();if(typeof R==="string"||arguments.length>2){M=arguments[1];B=arguments[2];m=arguments[3];L=arguments[4];_=arguments[5];b=arguments[6];R={icon:M,title:B,actions:m,onClose:L,id:_,styleClass:b}}if(R&&R.hasOwnProperty("details")){v.icon=u.INFORMATION;v.emphasizedAction=r.OK;v.actions=[r.OK,r.CANCEL];R=d.extend({},v,R)}R=d.extend({},v,R);if(typeof R.actions!=="undefined"&&!Array.isArray(R.actions)){if(R.emphasizedAction!==null){R.emphasizedAction=R.actions}R.actions=[R.actions]}if(!R.actions||R.actions.length===0){R.emphasizedAction=r.OK;R.actions=[r.OK]}function G(t,i){var n;if(I.Action.hasOwnProperty(t)){n=I._rb.getText("MSGBOX_"+t)}var o=new e({id:l.uid("mbox-btn-"),text:n||t,type:i,press:function(){A=t;E.close()}});return o}var K;for(h=0;h<R.actions.length;h++){K=R.emphasizedAction===R.actions[h]?p.Emphasized:p.Default;y.push(G(R.actions[h],K))}function D(e,t){var i,a,l=new s({items:[t]});if(!e.details){return l}if(typeof e.details=="object"){e.details="<pre>"+JSON.stringify(e.details,null,"\t").replace(/{/gi,"&#x007B;")+"</pre>"}i=(new n).setVisible(false).setHtmlText(e.details);a=new o({text:I._rb.getText("MSGBOX_LINK_TITLE"),press:function(){var e=E.getInitialFocus();E.addAriaLabelledBy(i);i.setVisible(true);a.setVisible(false);E._setInitialFocus();if(!e||e===a.getId()){y[0].focus()}}});a.addStyleClass("sapMMessageBoxLinkText");i.addStyleClass("sapMMessageBoxDetails");l.addItem(a);l.addItem(i);return l}function U(){if(typeof R.onClose==="function"){R.onClose(A)}E.detachAfterClose(U);E.destroy()}function z(){var e=0;var t=null;if(R.initialFocus){if(R.initialFocus instanceof c){t=R.initialFocus}if(typeof R.initialFocus==="string"){for(e=0;e<y.length;e++){if(I.Action.hasOwnProperty(R.initialFocus)){if(I._rb.getText("MSGBOX_"+R.initialFocus).toLowerCase()===y[e].getText().toLowerCase()){t=y[e];break}}else{if(R.initialFocus.toLowerCase()===y[e].getText().toLowerCase()){t=y[e];break}}}}}return t}if(typeof C==="string"){x=new i({textDirection:R.textDirection}).setText(C).addStyleClass("sapMMsgBoxText");N=x}else if(C instanceof c){x=C.addStyleClass("sapMMsgBoxText")}if(R&&R.hasOwnProperty("details")&&R.details!==""){x=D(R,x)}E=new t({id:R.id,type:f.Message,title:R.title,titleAlignment:T.Auto,content:x,icon:w[R.icon],initialFocus:z(),verticalScrolling:R.verticalScrolling,horizontalScrolling:R.horizontalScrolling,afterClose:U,buttons:y,ariaLabelledBy:N?N.getId():undefined,contentWidth:R.contentWidth,closeOnNavigation:R.closeOnNavigation}).addStyleClass("sapMMessageBox");E.setProperty("role",O.AlertDialog);if(F[R.icon]){E.addStyleClass(F[R.icon])}else{E.addStyleClass(F.STANDARD)}if(R.styleClass){E.addStyleClass(R.styleClass)}E.open()};I.alert=function(e,t){S();var i={icon:u.NONE,title:I._rb.getText("MSGBOX_TITLE_ALERT"),emphasizedAction:t&&t.actions?null:r.OK,actions:r.OK,id:l.uid("alert"),initialFocus:null},n,o,s,a;if(typeof t==="function"||arguments.length>2){n=arguments[1];o=arguments[2];s=arguments[3];a=arguments[4];t={onClose:n,title:o,id:s,styleClass:a}}t=d.extend({},i,t);return I.show(e,t)};I.confirm=function(e,t){S();var i={icon:u.QUESTION,title:I._rb.getText("MSGBOX_TITLE_CONFIRM"),emphasizedAction:t&&t.actions?null:r.OK,actions:[r.OK,r.CANCEL],id:l.uid("confirm"),initialFocus:null},n,o,s,a;if(typeof t==="function"||arguments.length>2){n=arguments[1];o=arguments[2];s=arguments[3];a=arguments[4];t={onClose:n,title:o,id:s,styleClass:a}}t=d.extend({},i,t);return I.show(e,t)};I.error=function(e,t){S();var i={icon:u.ERROR,title:I._rb.getText("MSGBOX_TITLE_ERROR"),emphasizedAction:null,actions:r.CLOSE,id:l.uid("error"),initialFocus:null};t=d.extend({},i,t);return I.show(e,t)};I.information=function(e,t){S();var i={icon:u.INFORMATION,title:I._rb.getText("MSGBOX_TITLE_INFO"),emphasizedAction:t&&t.actions?null:r.OK,actions:r.OK,id:l.uid("info"),initialFocus:null};t=d.extend({},i,t);return I.show(e,t)};I.warning=function(e,t){S();var i={icon:u.WARNING,title:I._rb.getText("MSGBOX_TITLE_WARNING"),emphasizedAction:t&&t.actions?null:r.OK,actions:r.OK,id:l.uid("warning"),initialFocus:null};t=d.extend({},i,t);return I.show(e,t)};I.success=function(e,t){S();var i={icon:u.SUCCESS,title:I._rb.getText("MSGBOX_TITLE_SUCCESS"),emphasizedAction:t&&t.actions?null:r.OK,actions:r.OK,id:l.uid("success"),initialFocus:null};t=d.extend({},i,t);return I.show(e,t)}})();return I},true);