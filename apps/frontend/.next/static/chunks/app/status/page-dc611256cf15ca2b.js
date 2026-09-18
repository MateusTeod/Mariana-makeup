(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[357],{1122:function(e,t,n){Promise.resolve().then(n.bind(n,662))},662:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return StatusPage}});var r=n(2115),s=n(6398);function StatusPage(){let[e,t]=(0,s.useState)("Loading...");return(0,s.useEffect)(()=>{fetch("http://localhost:3001/api/status").then(e=>e.json()).then(e=>t(e.message)).catch(()=>t("Error connecting to backend"))},[]),(0,r.jsxs)("div",{style:{padding:"2rem",textAlign:"center"},children:[(0,r.jsx)("h1",{children:"System Status"}),(0,r.jsx)("p",{children:e})]})}},6969:function(e,t,n){"use strict";/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(6398),s=Symbol.for("react.element"),o=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,u=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function q(e,t,n){var r,o={},i=null,f=null;for(r in void 0!==n&&(i=""+n),void 0!==t.key&&(i=""+t.key),void 0!==t.ref&&(f=t.ref),t)c.call(t,r)&&!a.hasOwnProperty(r)&&(o[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===o[r]&&(o[r]=t[r]);return{$$typeof:s,type:e,key:i,ref:f,props:o,_owner:u.current}}t.Fragment=o,t.jsx=q,t.jsxs=q},2115:function(e,t,n){"use strict";e.exports=n(6969)}},function(e){e.O(0,[461,871,744],function(){return e(e.s=1122)}),_N_E=e.O()}]);