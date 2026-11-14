(()=>{
"use strict";
const $=id=>document.getElementById(id);
const escapeHTML=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const safeUrl=v=>{try{const x=new URL(String(v));return x.protocol==="https:"?x.href:"#"}catch{return"#"}};
const sourceLink=(url,label)=>'<a class="source-link" href="'+escapeHTML(safeUrl(url))+'" target="_blank" rel="noopener noreferrer">'+escapeHTML(label)+' ↗</a>';
const translations={
en:{editions:"RECENT EDITIONS",filters:"STORY FILTER",all:"All stories",immediate:"Immediate",strategic:"Strategic",watch:"Watch",editorial:"EDITORIAL STANDARD",standard:"Reputable sources. Clear implications. Relevant decisions.",independent:"Independent public-source research",intelligence:"INTELLIGENCE / DAILY BRIEF",appearance:"Appearance",copy:"Copy link",print:"Print",atlantic:"Publication times in Atlantic Time",aiLabel:"AI disclosure",aiText:"Research, writing, translation and publication are automated using AI. Verify important information against original sources. This is an independent publication without Government of Canada endorsement.",latest:"LATEST EDITION",archived:"ARCHIVED EDITION",brief:"DAILY INTELLIGENCE BRIEF",read:"min read",sources:"source domains",big:"The big picture",three:"KEY OBSERVATIONS",must:"Must read",prioritized:"PRIORITIZED INTELLIGENCE",radar:"On my radar",also:"ALSO WORTH WATCHING",reflection:"FOR REFLECTION",deeper:"WORTH A DEEPER READ",signals:"EMERGING SIGNALS",what:"WHAT HAPPENED",why:"WHY IT MATTERS",takeaway:"MAIN TAKEAWAY",executiveSummary:"Read executive summary",back:"Back to edition",overview:"Executive summary",keyPoints:"Key developments",implications:"Implications for GC hosting",watchLabel:"What to watch",evidence:"Source and limitations",fullSource:"Read full original article",source:"Read original source",detail:"Read the source",search:"Search stories and topics",of:"OF",stories:"STORIES",none:"No articles match the filters.",unavailable:"The briefing archive could not be loaded. Please retry.",empty:"No published editions yet.",latestEdition:"Latest edition",expiredTitle:"This edition has expired",expiredExplanation:"Morning Scoop keeps a rolling five-day window. Older editions and their executive summaries are automatically removed.",latestLink:"Open the latest edition",linkCopied:"Edition link copied",date:"Date",coverage:"Coverage",published:"Published",priority:{Immediate:"Immediate",Strategic:"Strategic",Watch:"Watch"}},
fr:{editions:"ÉDITIONS RÉCENTES",filters:"FILTRE DES ARTICLES",all:"Tous les articles",immediate:"Immédiat",strategic:"Stratégique",watch:"À surveiller",editorial:"NORME RÉDACTIONNELLE",standard:"Sources fiables. Analyses claires. Décisions éclairées.",independent:"Publication indépendante fondée sur des sources publiques",intelligence:"VEILLE / BULLETIN QUOTIDIEN",appearance:"Apparence",copy:"Copier le lien",print:"Imprimer",atlantic:"Heures de publication en heure de l’Atlantique",aiLabel:"Avis sur l’IA",aiText:"La recherche, la rédaction, la traduction et la publication sont automatisées au moyen de l’intelligence artificielle. Vérifiez les renseignements importants auprès des sources originales. Cette publication est indépendante et ne bénéficie d’aucun appui officiel du gouvernement du Canada.",latest:"DERNIÈRE ÉDITION",archived:"ÉDITION ARCHIVÉE",brief:"BULLETIN QUOTIDIEN DE VEILLE",read:"min de lecture",sources:"domaines sources",big:"L’essentiel",three:"OBSERVATIONS CLÉS",must:"À lire",prioritized:"ARTICLES PRIORITAIRES",radar:"À surveiller",also:"AUTRES DÉVELOPPEMENTS",reflection:"POUR RÉFLEXION",deeper:"POUR APPROFONDIR",signals:"SIGNAUX ÉMERGENTS",what:"LES FAITS",why:"POURQUOI C’EST IMPORTANT",takeaway:"À RETENIR",executiveSummary:"Lire le résumé de direction",back:"Retour à l’édition",overview:"Résumé de direction",keyPoints:"Principaux développements",implications:"Conséquences pour l’hébergement du GC",watchLabel:"Points à surveiller",evidence:"Sources et réserves",fullSource:"Lire l’article original au complet",source:"Consulter la source originale",detail:"Consulter la source",search:"Rechercher des articles ou des sujets",of:"SUR",stories:"ARTICLES",none:"Aucun article ne correspond aux filtres.",unavailable:"Impossible de charger les éditions. Veuillez réessayer.",empty:"Aucune édition publiée.",latestEdition:"Dernière édition",expiredTitle:"Cette édition n’est plus disponible",expiredExplanation:"Morning Scoop conserve les cinq derniers jours civils. Les éditions plus anciennes et leurs résumés de direction sont supprimés automatiquement.",latestLink:"Consulter la dernière édition",linkCopied:"Lien vers l’édition copié",date:"Date",coverage:"Période couverte",published:"Publié",priority:{Immediate:"Immédiat",Strategic:"Stratégique",Watch:"À surveiller"}}
};
let archive=[],current=null,filter="All",query="",activeArticle=null,expiredDate=null;
const stored=(k,fallback)=>{try{return localStorage.getItem(k)||fallback}catch{return fallback}};
let lang=stored("morning-scoop-lang","en")==="fr"?"fr":"en";
let theme=stored("morning-scoop-theme","light")==="dark"?"dark":"light";
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const text=()=>translations[lang];
const dateOf=d=>new Date(String(d).slice(0,10)+"T12:00:00Z");
const atlanticDate=()=>{
 const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/Moncton",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
 const get=type=>parts.find(p=>p.type===type).value;
 return get("year")+"-"+get("month")+"-"+get("day");
};
const dayBefore=(date,days)=>{const d=new Date(date+"T12:00:00Z");d.setUTCDate(d.getUTCDate()-days);return d.toISOString().slice(0,10)};
const inRollingWindow=date=>{const today=atlanticDate();return date>=dayBefore(today,4)&&date<=today};
function restoreSelection(params){
 const requested=params.get("date");
 current=requested?(archive.find(e=>e.date===requested)||null):(archive[0]||null);
 expiredDate=requested&&!current?requested:null;
 const index=Number(params.get("article"))-1;
 activeArticle=current&&Number.isInteger(index)&&index>=0&&current.reads?.[index]?.executiveSummary?index:null;
}
const fmtDate=(d,long=false)=>new Intl.DateTimeFormat(lang==="fr"?"fr-CA":"en-CA",long?{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}:{day:"numeric",month:"short",year:"numeric",timeZone:"UTC"}).format(dateOf(d));
const localTime=v=>{if(!v)return"";const date=new Date(v);return Number.isNaN(date.getTime())?"":new Intl.DateTimeFormat(lang==="fr"?"fr-CA":"en-CA",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit",timeZone:"America/Moncton",timeZoneName:"short"}).format(date)};
const full=e=>lang==="fr"?(e.translations?.fr||e):e;
const section=(title,sub)=>'<div class="section-header"><h2>'+escapeHTML(title)+'</h2><small>'+escapeHTML(sub)+'</small></div>';
const getNumSources=e=>new Set([...(e.reads||[]),...(e.radar||[]),...(e.deepRead?[e.deepRead]:[])].map(x=>{try{return new URL(safeUrl(x.url)).hostname}catch{return""}}).filter(Boolean)).size;
const toast=msg=>{const node=$("toast");node.textContent=msg;node.classList.add("show");setTimeout(()=>node.classList.remove("show"),2500)};
function persistURL(){const url=new URL(window.location.href);if(current)url.searchParams.set("date",current.date);url.searchParams.set("lang",lang);if(activeArticle!==null)url.searchParams.set("article",String(activeArticle+1));else url.searchParams.delete("article");history.replaceState(null,"",url)}
function languageButtons(){document.documentElement.lang=lang==="fr"?"fr-CA":"en-CA";$("lang-en").setAttribute("aria-pressed",String(lang==="en"));$("lang-fr").setAttribute("aria-pressed",String(lang==="fr"));for(const e of document.querySelectorAll("[data-i18n]")){const key=e.getAttribute("data-i18n");if(text()[key])e.textContent=text()[key]}}
function renderNav(){const t=text();$("edition-count").textContent=archive.length+" / 5";$("edition-nav").innerHTML=archive.map((e,i)=>'<button type="button" class="edition-button '+(current?.date===e.date?"active":"")+'" data-date="'+escapeHTML(e.date)+'" '+(current?.date===e.date?'aria-current="page"':'')+'><strong>'+escapeHTML(fmtDate(e.date))+'</strong><small>'+escapeHTML(i===0?t.latestEdition:(full(e).headline||"").slice(0,45))+'</small></button>').join("");for(const b of document.querySelectorAll(".edition-button"))b.addEventListener("click",()=>select(b.dataset.date))}
function updateFilters(){for(const b of document.querySelectorAll(".filter")){const active=b.dataset.filter===filter;b.classList.toggle("selected",active);b.setAttribute("aria-pressed",String(active))}}
function renderReads(){
 if(!current)return;
 const e=full(current),t=text(),reads=e.reads||[];
 const shown=reads.filter(r=>(filter==="All"||r.priority===filter)&&[r.title,r.source,r.category,r.what,r.why,r.takeaway,r.executiveSummary?.overview||""].join(" ").toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
 $("story-count").textContent=shown.length+" "+t.of+" "+reads.length+" "+t.stories;
 $("stories").innerHTML=shown.length?shown.map(r=>{
  const n=reads.indexOf(r)+1,priority=["Immediate","Strategic","Watch"].includes(r.priority)?r.priority:"Watch";
  const action=r.executiveSummary?'<button type="button" class="summary-link" data-article="'+n+'">'+escapeHTML(t.executiveSummary)+' <span aria-hidden="true">→</span></button>':sourceLink(r.url,t.source);
  return '<article class="story"><div class="story-head"><span class="story-num">#'+String(n).padStart(2,"0")+'</span><span class="priority priority-'+priority.toLowerCase()+'">'+escapeHTML(t.priority[priority])+'</span></div><h3>'+escapeHTML(r.title)+'</h3><div class="story-source"><strong>'+escapeHTML(r.source)+'</strong><span>'+escapeHTML(fmtDate(r.published))+'</span><span>'+escapeHTML(r.category)+'</span></div><div class="story-content"><div><div class="micro">'+t.what+'</div><p>'+escapeHTML(r.what)+'</p></div><div><div class="micro">'+t.why+'</div><p>'+escapeHTML(r.why)+'</p></div></div><div class="takeaway"><div class="micro">'+t.takeaway+'</div><p>'+escapeHTML(r.takeaway)+'</p></div>'+action+'</article>';
 }).join(""):'<p class="empty">'+escapeHTML(t.none)+'</p>';
 for(const b of document.querySelectorAll(".summary-link"))b.addEventListener("click",()=>openArticle(Number(b.dataset.article)-1));
}
function openArticle(index){
 if(!current||!full(current).reads?.[index]?.executiveSummary)return;
 activeArticle=index;
 const url=new URL(location.href);url.searchParams.set("date",current.date);url.searchParams.set("lang",lang);url.searchParams.set("article",String(index+1));
 history.pushState(null,"",url);
 render();window.scrollTo({top:0,behavior:"instant"});
 $("detail-back")?.focus({preventScroll:true});
}
function closeArticle(){
 activeArticle=null;
 const url=new URL(location.href);url.searchParams.delete("article");history.pushState(null,"",url);
 render();$("must-read")?.scrollIntoView({block:"start",behavior:"instant"});
}
function renderArticleDetail(){
 const t=text(),e=full(current),r=e.reads?.[activeArticle],d=r?.executiveSummary;
 if(!d){activeArticle=null;render();return}
 $("hero").hidden=true;$("content-grid").hidden=true;$("article-detail").hidden=false;
 document.title=r.title+" | Morning Scoop";
 const p=["Immediate","Strategic","Watch"].includes(r.priority)?r.priority:"Watch";
 $("article-detail").innerHTML='<div class="detail-nav"><button id="detail-back" class="back-link" type="button">← '+escapeHTML(t.back)+'</button><span class="smallcap">'+escapeHTML(t.overview)+' · #'+String(activeArticle+1).padStart(2,"0")+'</span></div>'+
 '<article class="detail-paper"><header class="detail-head"><span class="priority priority-'+p.toLowerCase()+'">'+escapeHTML(t.priority[p])+'</span><h1>'+escapeHTML(r.title)+'</h1><div class="story-source"><strong>'+escapeHTML(r.source)+'</strong><span>'+escapeHTML(fmtDate(r.published))+'</span><span>'+escapeHTML(r.category)+'</span></div></header>'+
 '<section class="detail-section"><h2>'+escapeHTML(t.overview)+'</h2><p>'+escapeHTML(d.overview)+'</p></section>'+
 '<section class="detail-section"><h2>'+escapeHTML(t.keyPoints)+'</h2><ul>'+d.keyPoints.map(x=>'<li>'+escapeHTML(x)+'</li>').join("")+'</ul></section>'+
 '<section class="detail-section"><h2>'+escapeHTML(t.implications)+'</h2><p>'+escapeHTML(d.implications)+'</p></section>'+
 '<section class="detail-section"><h2>'+escapeHTML(t.watchLabel)+'</h2><p>'+escapeHTML(d.watch)+'</p></section>'+
 '<aside class="detail-source"><h2>'+escapeHTML(t.evidence)+'</h2><p>'+escapeHTML(d.caveat)+'</p><div class="detail-meta">'+escapeHTML(r.source)+' · '+escapeHTML(fmtDate(r.published))+'</div>'+sourceLink(r.url,t.fullSource)+'</aside></article>';
 $("detail-back").addEventListener("click",closeArticle);
}
function render(){
 if(expiredDate){
  languageButtons();updateFilters();renderNav();
  $("hero").hidden=false;$("content-grid").hidden=true;$("article-detail").hidden=true;
  const t=text();document.title=t.expiredTitle+" | Morning Scoop";
  $("hero").innerHTML='<div class="smallcap">MORNING SCOOP</div><h1>'+escapeHTML(t.expiredTitle)+'</h1><p class="deck">'+escapeHTML(t.expiredExplanation)+'</p><button type="button" id="back-to-latest" class="back-link">'+escapeHTML(t.latestLink)+' →</button>';
  $("back-to-latest").addEventListener("click",()=>select(archive[0]?.date));
  return;
 }
 if(!current){
  languageButtons();renderNav();
  $("hero").hidden=false;$("content-grid").hidden=true;$("article-detail").hidden=true;
  $("hero").innerHTML="<h1>"+escapeHTML(text().empty)+"</h1>";return;
 }const e=full(current),t=text();languageButtons();updateFilters();renderNav();persistURL();if(activeArticle!==null){renderArticleDetail();return}$("article-detail").hidden=true;$("hero").hidden=false;$("content-grid").hidden=false;document.title="Morning Scoop | "+fmtDate(current.date);$("hero").innerHTML='<div class="smallcap">'+escapeHTML(current===archive[0]?t.latest:t.archived)+' · '+escapeHTML(t.brief)+'</div><h1>'+escapeHTML(e.headline)+'</h1><p class="deck">'+escapeHTML(e.deck)+'</p><div class="metadata"><span>'+escapeHTML(fmtDate(e.date,true))+'</span><span>'+escapeHTML(String(e.readMinutes||current.readMinutes||5))+' '+t.read+'</span><span>'+getNumSources(e)+' '+t.sources+'</span>'+(current.publishedAt?'<span>'+t.published+': '+escapeHTML(localTime(current.publishedAt))+'</span>':"")+'</div>';$("big-picture").innerHTML=section(t.big,t.three)+'<div class="big-grid">'+(e.bigPicture||[]).map((x,i)=>'<div class="big-item"><span class="big-num">'+String(i+1).padStart(2,"0")+'</span><div>'+(typeof x==="string"?'<p>'+escapeHTML(x)+'</p>':(x&&typeof x==="object"?'<strong>'+escapeHTML(x.title||"")+'</strong><p>'+escapeHTML(x.detail||"")+'</p>':""))+'</div></div>').join("")+'</div>';$("must-read").innerHTML=section(t.must,t.prioritized)+'<div class="searchrow"><input id="search" type="search" value="'+escapeHTML(query)+'" placeholder="'+escapeHTML(t.search)+'" aria-label="'+escapeHTML(t.search)+'"><small id="story-count"></small></div><div id="stories" class="stories"></div>';$("search").addEventListener("input",ev=>{query=ev.target.value;renderReads()});renderReads();$("radar").innerHTML=(e.radar?.length?section(t.radar,t.also)+(e.radar||[]).map(x=>'<article class="radar-item"><h3>'+escapeHTML(x.title)+'</h3><p>'+escapeHTML(x.detail)+'</p>'+sourceLink(x.url,t.detail)+'</article>').join(""):"");$("insights").innerHTML='<section class="insight"><div class="smallcap">'+t.reflection+'</div><h3>'+escapeHTML(e.question)+'</h3></section>'+(e.deepRead?'<section class="insight"><div class="smallcap">'+t.deeper+'</div><h3>'+escapeHTML(e.deepRead.title)+'</h3><p>'+escapeHTML(e.deepRead.detail)+'</p>'+sourceLink(e.deepRead.url,t.detail)+'</section>':"")+'<section class="insight"><div class="smallcap">'+t.signals+'</div>'+(e.signals||[]).map(s=>'<div class="signal"><strong>'+escapeHTML(s.title)+'</strong><p>'+escapeHTML(s.detail)+'</p></div>').join("")+'</section>'+(e.editorialNote?'<section class="insight"><div class="smallcap">EDITORIAL NOTE</div><p class="editor-note">'+escapeHTML(e.editorialNote)+'</p></section>':"") }
function select(date){current=archive.find(e=>e.date===date)||archive[0]||null;activeArticle=null;expiredDate=null;query="";render();window.scrollTo({top:0,behavior:"smooth"})}
for(const b of document.querySelectorAll(".filter"))b.addEventListener("click",()=>{filter=b.dataset.filter;updateFilters();renderReads()});
$("lang-en").addEventListener("click",()=>{lang="en";save("morning-scoop-lang",lang);render()});
$("lang-fr").addEventListener("click",()=>{lang="fr";save("morning-scoop-lang",lang);render()});
window.addEventListener("popstate",()=>{
 if(!archive.length)return;
 const params=new URLSearchParams(location.search);
 if(["en","fr"].includes(params.get("lang")))lang=params.get("lang");
 restoreSelection(params);render();
});
function setTheme(){document.documentElement.dataset.theme=theme;save("morning-scoop-theme",theme)}setTheme();
$("theme").addEventListener("click",()=>{theme=theme==="dark"?"light":"dark";setTheme()});
$("print").addEventListener("click",()=>window.print());
$("share").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(location.href);toast(text().linkCopied)}catch{toast(location.href)}});
(async()=>{try{const r=await fetch("./data/editions.json",{cache:"no-store"});if(!r.ok)throw Error("HTTP "+r.status);const json=await r.json();if(!Array.isArray(json.editions))throw Error("Invalid archive");archive=json.editions.filter(e=>e.date&&e.translations?.fr&&inRollingWindow(e.date)).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,5);const params=new URLSearchParams(location.search);if(params.get("lang")==="fr"||params.get("lang")==="en")lang=params.get("lang");restoreSelection(params);render();}catch(err){languageButtons();$("hero").innerHTML='<h1>'+escapeHTML(text().unavailable)+'</h1>';console.error("Morning Scoop load failed:",err)}})();
})();