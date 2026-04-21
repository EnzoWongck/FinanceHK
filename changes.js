const fs = require('fs');
const FILE = 'C:/Users/user/Documents/GitHub/FinanceHK/index.html';
let html = fs.readFileSync(FILE, 'utf8');
let ok = true;

function replace(desc, from, to) {
  if (!html.includes(from)) { console.log('NOT FOUND:', desc); ok = false; return; }
  html = html.replace(from, to);
  console.log('OK:', desc);
}

// ── CHANGE 1A: venue input → select dropdown ─────────────────────────────────
replace('venue select dropdown',
  '      <div class="form-group"><label>場地/類型</label><input id="poker-venue" placeholder="例：Live / 網上"></div>',
  '      <div class="form-group"><label>類型</label><select id="poker-venue"><option value="Live">Live</option><option value="Online">Online</option></select></div>'
);

// ── CHANGE 1B: 收回 → 兌現 ───────────────────────────────────────────────────
replace('收回 → 兌現',
  '<label>收回 (HKD)</label><input id="poker-cashout"',
  '<label>兌現 (HKD)</label><input id="poker-cashout"'
);

// ── CHANGE 1C: openPokerModal default Live ───────────────────────────────────
replace('openPokerModal default Live',
  "document.getElementById('poker-venue').value='';",
  "document.getElementById('poker-venue').value='Live';"
);

// ── CHANGE 1D: editPoker default Live ────────────────────────────────────────
replace('editPoker default Live',
  "document.getElementById('poker-venue').value=p.venue||'';",
  "document.getElementById('poker-venue').value=p.venue||'Live';"
);

// ── CHANGE 1E: renderPoker with badge ────────────────────────────────────────
replace('renderPoker with Live/Online badge',
`  el.innerHTML=sorted.map(p=>{
    const pnl=p.cashout-p.buyin;
    return \`<div class="row-item">
      <div class="row-header">
        <div><div class="row-title">\${p.venue||'撲克'}</div><div class="row-sub">\${p.date}\${p.note?' · '+p.note:''}</div></div>
        <div style="display:flex;align-items:center;gap:8px">
          <div style="text-align:right">
            <div class="row-amount \${pnl>=0?'amount-pos':'amount-neg'}">\${pnl>=0?'+':'-'}\${fmt(Math.abs(pnl))}</div>
            <div class="row-sub">買:\${fmt(p.buyin)} 回:\${fmt(p.cashout)}</div>
          </div>
          <button class="btn btn-sm btn-ghost" onclick="editPoker('\${p.id}')">編輯</button>
          <button class="btn-icon-del" onclick="deletePoker('\${p.id}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
        </div>
      </div>
    </div>\`;
  }).join('');`,

`  el.innerHTML=sorted.map(function(p){
    var pnl=p.cashout-p.buyin;
    var sq=String.fromCharCode(39);
    var venue=p.venue||'Live';
    var vbadge='<span class="badge badge-poker" style="font-size:10px;margin-right:4px">'+venue+'</span>';
    var trash='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
    return '<div class="row-item"><div class="row-header">'
      +'<div><div class="row-title">'+vbadge+(p.note?p.note:'')+'</div>'
      +'<div class="row-sub">'+p.date+'</div></div>'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<div style="text-align:right">'
      +'<div class="row-amount '+(pnl>=0?'amount-pos':'amount-neg')+'">'+(pnl>=0?'+':'-')+fmt(Math.abs(pnl))+'</div>'
      +'<div class="row-sub">買:'+fmt(p.buyin)+' 兌:'+fmt(p.cashout)+'</div>'
      +'</div>'
      +'<button class="btn btn-sm btn-ghost" onclick="editPoker('+sq+p.id+sq+')">編輯</button>'
      +'<button class="btn-icon-del" onclick="deletePoker('+sq+p.id+sq+')">'+trash+'</button>'
      +'</div></div></div>';
  }).join('');`
);

// ── CHANGE 2A: DEFAULT_INC with correct casing ───────────────────────────────
replace('DEFAULT_INC poker cats',
  "const DEFAULT_INC=['Poker (live)','Poker (online)',",
  "const DEFAULT_INC=['Poker (Live)','Poker (Online)',"
);

// ── CHANGE 2B: DEFAULT_EXP with 2 loss cats ──────────────────────────────────
replace('DEFAULT_EXP poker loss cats',
  "const DEFAULT_EXP=['Poker Loss','購物',",
  "const DEFAULT_EXP=['Poker Loss (Live)','Poker Loss (Online)','購物',"
);

// ── CHANGE 2C: initCats with migration ───────────────────────────────────────
replace('initCats migration',
  "function initCats(){if(ld(K.incCats)===null)sv(K.incCats,[...DEFAULT_INC]);if(ld(K.expCats)===null)sv(K.expCats,[...DEFAULT_EXP])}",
  `function initCats(){
  if(ld(K.incCats)===null)sv(K.incCats,[...DEFAULT_INC]);
  if(ld(K.expCats)===null)sv(K.expCats,[...DEFAULT_EXP]);
  var inc=getIncCats(),incChanged=false;
  [['Poker (live)','Poker (Live)'],['Poker (online)','Poker (Online)']].forEach(function(p){
    var i=inc.indexOf(p[0]);if(i>=0){inc[i]=p[1];incChanged=true;}
  });
  if(!inc.includes('Poker (Live)')){inc.unshift('Poker (Live)');incChanged=true;}
  if(!inc.includes('Poker (Online)')){inc.splice(inc.indexOf('Poker (Live)')+1,0,'Poker (Online)');incChanged=true;}
  if(incChanged)sv(K.incCats,inc);
  var exp=getExpCats(),expChanged=false;
  var ol=exp.indexOf('Poker Loss');
  if(ol>=0){exp.splice(ol,1,'Poker Loss (Live)','Poker Loss (Online)');expChanged=true;}
  if(!exp.includes('Poker Loss (Live)')){exp.unshift('Poker Loss (Live)');expChanged=true;}
  if(!exp.includes('Poker Loss (Online)')){exp.splice(exp.indexOf('Poker Loss (Live)')+1,0,'Poker Loss (Online)');expChanged=true;}
  if(expChanged)sv(K.expCats,exp);
}`
);

// ── CHANGE 2D: syncPokerTxn with 4 categories ────────────────────────────────
replace('syncPokerTxn 4 cats',
`  if(pnl!==0){
    const vLow=(session.venue||'').toLowerCase();
    const isOnline=vLow.includes('online')||vLow.includes('網上');
    const isProfit=pnl>0;
    txns.push({
      id:session.txnId,
      date:session.date,
      amount:Math.abs(pnl),
      category:isProfit?(isOnline?'Poker (online)':'Poker (live)'):'Poker Loss',
      note:(isProfit?'撲克盈利':'撲克虧損')+(session.venue?' - '+session.venue:''),
      type:isProfit?'income':'expense',
      pokerLinked:true
    });
  }`,
`  if(pnl!==0){
    var isOnline=(session.venue||'').toLowerCase()==='online';
    var isProfit=pnl>0;
    var cat=isProfit?(isOnline?'Poker (Online)':'Poker (Live)'):(isOnline?'Poker Loss (Online)':'Poker Loss (Live)');
    txns.push({
      id:session.txnId,
      date:session.date,
      amount:Math.abs(pnl),
      category:cat,
      note:(isProfit?'撲克盈利':'撲克虧損')+' - '+(session.venue||'Live'),
      type:isProfit?'income':'expense',
      pokerLinked:true
    });
  }`
);

// ── CHANGE 3A: drag handle CSS ───────────────────────────────────────────────
replace('drag handle CSS',
  '.deleted-cat{color:var(--text2);font-style:italic;font-size:13px}',
  `.deleted-cat{color:var(--text2);font-style:italic;font-size:13px}
.drag-handle{color:var(--text2);font-size:16px;cursor:grab;padding:0 8px 0 0;user-select:none;flex-shrink:0;touch-action:none}
.drag-handle:active{cursor:grabbing}
.cat-row.dnd-over{background:var(--bg2);border-color:var(--primary);box-shadow:inset 0 -2px 0 var(--primary)}`
);

// ── CHANGE 3B: renderSettings + DnD functions ────────────────────────────────
replace('renderSettings + DnD',
`function renderSettings(){
  const renderCats=(type,cats)=>cats.map(c=>\`<div class="cat-row">
    <input class="cat-name" value="\${c}" data-type="\${type}" data-old="\${c}"
      onblur="renameCat(this)"
      onkeydown="if(event.key==='Enter'){this.blur()}else if(event.key==='Escape'){this.value=this.dataset.old;this.blur()}">
    <button class="btn-icon-del" onclick="deleteCat('\${type}','\${c}')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
  </div>\`).join('');
  document.getElementById('inc-cats-list').innerHTML=renderCats('income',getIncCats());
  document.getElementById('exp-cats-list').innerHTML=renderCats('expense',getExpCats());
}`,
`function renderSettings(){
  var sq=String.fromCharCode(39);
  var trashSVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
  function buildCats(type,cats){
    return cats.map(function(c,i){
      return '<div class="cat-row" draggable="true" data-type="'+type+'" data-index="'+i+'" data-name="'+c+'"'
        +' ondragstart="dndStart(event)" ondragover="dndOver(event)" ondrop="dndDrop(event)" ondragend="dndEnd(event)">'
        +'<span class="drag-handle" ontouchstart="tDragStart(event)" ontouchmove="tDragMove(event)" ontouchend="tDragEnd(event)">☰</span>'
        +'<input class="cat-name" value="'+c+'" data-type="'+type+'" data-old="'+c+'"'
        +' onblur="renameCat(this)"'
        +' onkeydown="if(event.key==='+sq+'Enter'+sq+'){this.blur()}else if(event.key==='+sq+'Escape'+sq+'){this.value=this.dataset.old;this.blur()}">'
        +'<button class="btn-icon-del" onclick="deleteCat('+sq+type+sq+','+sq+c+sq+')">'+trashSVG+'</button>'
        +'</div>';
    }).join('');
  }
  document.getElementById('inc-cats-list').innerHTML=buildCats('income',getIncCats());
  document.getElementById('exp-cats-list').innerHTML=buildCats('expense',getExpCats());
}

var _dndSrc=null;
function dndStart(e){_dndSrc=e.currentTarget;e.dataTransfer.effectAllowed='move';setTimeout(function(){if(_dndSrc)_dndSrc.style.opacity='0.4';},0);}
function dndOver(e){e.preventDefault();document.querySelectorAll('.cat-row').forEach(function(r){r.classList.remove('dnd-over');});if(e.currentTarget!==_dndSrc)e.currentTarget.classList.add('dnd-over');}
function dndDrop(e){
  e.preventDefault();
  var tgt=e.currentTarget;
  if(!_dndSrc||tgt===_dndSrc||tgt.dataset.type!==_dndSrc.dataset.type)return;
  var isInc=_dndSrc.dataset.type==='income';
  var cats=isInc?getIncCats():getExpCats();
  cats.splice(parseInt(tgt.dataset.index),0,cats.splice(parseInt(_dndSrc.dataset.index),1)[0]);
  sv(isInc?K.incCats:K.expCats,cats);renderSettings();updTxnCats();
}
function dndEnd(){document.querySelectorAll('.cat-row').forEach(function(r){r.style.opacity='1';r.classList.remove('dnd-over');});_dndSrc=null;}

var _tSrc=null,_tGhost=null,_tType=null,_tIdx=null;
function tDragStart(e){
  e.preventDefault();
  var row=e.currentTarget.closest('.cat-row');
  _tType=row.dataset.type;_tIdx=parseInt(row.dataset.index);_tSrc=row;
  var r=row.getBoundingClientRect();
  _tGhost=row.cloneNode(true);
  _tGhost.style.cssText='position:fixed;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;opacity:.75;pointer-events:none;z-index:999;background:var(--bg3);border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,.4);';
  document.body.appendChild(_tGhost);row.style.opacity='0.35';
}
function tDragMove(e){
  e.preventDefault();if(!_tGhost)return;
  var t=e.touches[0];_tGhost.style.top=(t.clientY-24)+'px';
  document.querySelectorAll('.cat-row').forEach(function(r){r.classList.remove('dnd-over');});
  var el=document.elementFromPoint(t.clientX,t.clientY);
  var over=el&&el.closest('.cat-row');
  if(over&&over!==_tSrc&&over.dataset.type===_tType)over.classList.add('dnd-over');
}
function tDragEnd(e){
  e.preventDefault();
  if(_tGhost){document.body.removeChild(_tGhost);_tGhost=null;}
  if(_tSrc)_tSrc.style.opacity='1';
  var over=document.querySelector('.cat-row.dnd-over');
  if(over&&_tSrc&&over!==_tSrc){
    var isInc=_tType==='income';
    var cats=isInc?getIncCats():getExpCats();
    cats.splice(parseInt(over.dataset.index),0,cats.splice(_tIdx,1)[0]);
    sv(isInc?K.incCats:K.expCats,cats);renderSettings();updTxnCats();
  } else {document.querySelectorAll('.cat-row').forEach(function(r){r.classList.remove('dnd-over');});}
  _tSrc=null;
}`
);

if (ok) {
  fs.writeFileSync(FILE, html, 'utf8');
  fs.writeFileSync('C:/Users/user/index.html', html, 'utf8');
  console.log('\nAll done. Size:', Math.round(html.length/1024) + 'KB');
} else {
  console.log('\nSome replacements failed — file NOT saved.');
}
