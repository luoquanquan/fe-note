window.addEventListener("DOMContentLoaded",(()=>{const e=CONFIG.algolia;let t=instantsearch({appId:e.appID,apiKey:e.apiKey,indexName:e.indexName,searchFunction:e=>{document.querySelector("#search-input input").value&&e.search()}});window.pjax&&t.on("render",(()=>{window.pjax.refresh(document.getElementById("algolia-hits"))})),[instantsearch.widgets.searchBox({container:"#search-input",placeholder:e.labels.input_placeholder}),instantsearch.widgets.stats({container:"#algolia-stats",templates:{body:t=>`${e.labels.hits_stats.replace(/\$\{hits}/,t.nbHits).replace(/\$\{time}/,t.processingTimeMS)}\n            <span class="algolia-powered">\n              <img src="${CONFIG.root}images/algolia_logo.svg" alt="Algolia">\n            </span>\n            <hr>`}}),instantsearch.widgets.hits({container:"#algolia-hits",hitsPerPage:e.hits.per_page||10,templates:{item:e=>`<a href="${e.permalink?e.permalink:CONFIG.root+e.path}" class="algolia-hit-item-link">${e._highlightResult.title.value}</a>`,empty:t=>`<div id="algolia-hits-empty">\n              ${e.labels.hits_empty.replace(/\$\{query}/,t.query)}\n            </div>`},cssClasses:{item:"algolia-hit-item"}}),instantsearch.widgets.pagination({container:"#algolia-pagination",scrollTo:!1,showFirstLast:!1,labels:{first:'<i class="fa fa-angle-double-left"></i>',last:'<i class="fa fa-angle-double-right"></i>',previous:'<i class="fa fa-angle-left"></i>',next:'<i class="fa fa-angle-right"></i>'},cssClasses:{root:"pagination",item:"pagination-item",link:"page-number",active:"current",disabled:"disabled-item"}})].forEach(t.addWidget,t),t.start(),document.querySelector(".popup-trigger").addEventListener("click",(()=>{document.body.style.overflow="hidden",document.querySelector(".search-pop-overlay").style.display="block",document.querySelector(".popup").style.display="block",document.querySelector("#search-input input").focus()}));const a=()=>{document.body.style.overflow="",document.querySelector(".search-pop-overlay").style.display="none",document.querySelector(".popup").style.display="none"};document.querySelector(".search-pop-overlay").addEventListener("click",a),document.querySelector(".popup-btn-close").addEventListener("click",a),window.addEventListener("pjax:success",a),window.addEventListener("keyup",(e=>{27===e.which&&a()}))}));