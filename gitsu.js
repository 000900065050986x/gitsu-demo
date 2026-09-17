(function(){
var TABS=[
  ["files","Files"],["code","Code"],["kit","Kit AI"],
  ["git","Git"],["terminal","Terminal"],["share","Share"]
];
var MENUS={
  files:["Open folder…","New file","New window","Save all"],
  code:["Open editor","Go to file","Format document","Command palette"],
  kit:["New chat","Agents","Add context","History"],
  git:["Status","Commit…","Push / Pull","Branches"],
  terminal:["New terminal","Clear","Kill session"],
  share:["Copy link","Export project","Invite reviewer"]
};
var ICONS=["\ud83e\udd8a","\u25a3","\u2318","\u2726","\u25ce","\u232c","\u1a12","\u2b22"];
var THEMES=["night","dawn","forest"];
var DEFAULT_FILES={
  "README.md":"# aurora-sync\n\nPrivate vault for GitSU.\nKiT the Branchfox keeps watch on the working tree.\n",
  "Cargo.toml":"[package]\nname = \"aurora-sync\"\nversion = \"0.1.0\"\nedition = \"2021\"\n",
  "src/main.rs":"fn main() {\n    println!(\"GitSU \u00b7 KiT the Branchfox\");\n}\n",
  "src/vault.rs":"pub struct Vault {\n    pub sealed: bool,\n}\n\nimpl Vault {\n    pub fn open() -> Self { Self { sealed: false } }\n}\n"
};
var KEY="gitsu.v2";
function load(){
  try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}
}
function save(s){
  var dump={
    screen:s.screen,page:s.page,theme:s.theme,icon:s.icon,file:s.file,
    files:s.files,dirty:s.dirty,kit:s.kit,term:s.term,github:s.github,mcp:s.mcp
  };
  try{localStorage.setItem(KEY,JSON.stringify(dump))}catch(e){}
}
var stored=load();
var S={
  boot:1,screen:stored.screen||"files",menu:null,edge:0,tools:0,page:stored.page||"ws",
  theme:stored.theme||"night",icon:stored.icon||"\ud83e\udd8a",
  files:stored.files||JSON.parse(JSON.stringify(DEFAULT_FILES)),
  file:stored.file||"src/main.rs",dirty:stored.dirty||false,
  find:"",toast:null,github:!!stored.github,mcp:!!stored.mcp,
  kit:stored.kit||[
    {who:"kit",text:"I'll take this as lead. Plan: research \u2192 code \u2192 review \u2192 test."}
  ],
  prompt:"",
  term:stored.term||"GitSU terminal \u2014 type help.\nfox \u203a "
};
document.documentElement.setAttribute("data-theme",S.theme==="night"?"":S.theme);
function toast(msg){S.toast=msg;paint();setTimeout(function(){S.toast=null;paint();},1600);}
function listFiles(){return Object.keys(S.files)}
function kitReply(q){
  var lower=(q||"").toLowerCase();
  if(/commit|git/.test(lower)) return "Working tree on aurora-sync / main. I can draft a commit message after you save.";
  if(/test|review/.test(lower)) return "Review pass: vault.rs is sealed-by-default. Add a unit test around Vault::open next.";
  if(/theme|icon/.test(lower)) return "Open the edge chip \u2192 Settings to swap theme and KiT icon.";
  return "Noted. I'll keep KiT on lead and stage research \u2192 code \u2192 review for: "+q;
}
function runTerm(line){
  var cmd=line.trim(); var out="";
  if(cmd==="help") out="commands: help, ls, status, whoami, clear, theme, kit";
  else if(cmd==="ls") out=listFiles().join("\n");
  else if(cmd==="status") out=(S.dirty?"modified: "+S.file:"working tree clean")+"\nbranch main";
  else if(cmd==="whoami") out="Thomas James \u00b7 OP Thomas \u00b7 GitSU";
  else if(cmd==="clear"){S.term="fox \u203a ";return;}
  else if(cmd==="theme") out="theme="+S.theme;
  else if(cmd==="kit") out="KiT online \u00b7 Branchfox";
  else if(!cmd) out="";
  else out="fox: command not found: "+cmd;
  S.term += cmd+"\n"+(out?out+"\n":"")+"fox \u203a ";
}
function commitSim(){S.dirty=false;toast("Committed on main (local)");}
function formatDoc(){
  if(S.files[S.file]){
    S.files[S.file]=S.files[S.file].replace(/[ \t]+$/gm,"").replace(/\n{3,}/g,"\n\n");
    S.dirty=true;toast("Formatted "+S.file);
  }
}
function newFile(){
  var n="src/note-"+Date.now().toString().slice(-4)+".md";
  S.files[n]="# note\n"; S.file=n;S.screen="code";S.page="ws";S.dirty=true;toast("Created "+n);
}
function bootArt(){
  return [
"            /\\   /\\",
"           /  \\_/  \\",
"          /  KiT    \\",
"         /  BRANCHFOX\\",
"         \\   ^^^^    /",
"          \\________/"
  ].join("\n");
}
function paint(){
  document.documentElement.setAttribute("data-theme",S.theme==="night"?"":S.theme);
  if(S.boot){
    document.getElementById("app").innerHTML='<div class="boot"><pre>'+bootArt()+'</pre><div class="title">GITSU</div><div class="sub">KiT THE BRANCHFOX</div></div>';
    return;
  }
  var h='<div class="shell"><div class="top"><div class="bar">';
  h+='<button class="logo" data-a="boot" title="Replay boot">'+S.icon+'</button><div class="tabs">';
  TABS.forEach(function(t){
    h+='<div class="tab"><button class="tabb '+(S.screen===t[0]&&S.page==="ws"?"on":"")+'" data-a="tab" data-v="'+t[0]+'">'+t[1]+'</button>';
    if(S.menu===t[0]){h+='<div class="dd" data-keep="1">';MENUS[t[0]].forEach(function(m){h+='<button data-a="item" data-v="'+m+'">'+m+'</button>';});h+='</div>';}
    h+='</div>';
  });
  h+='</div><div class="right"><button class="search" data-a="find">\u2315 \u2318K</button><button class="iconbtn" data-a="toast" data-v="No alerts">\ud83d\udd14</button><button class="avatar" data-a="go" data-v="account">TJ</button></div></div></div><div class="work">';
  if(S.page==="settings"){
    h+='<h2>Settings</h2><p class="k">Display \u00b7 Themes \u00b7 Icons \u00b7 MCP. App menu also opens this.</p><p class="k">Theme</p><div class="rowbtns">';
    THEMES.forEach(function(t){h+='<button data-a="theme" data-v="'+t+'" class="'+(S.theme===t?"primary btn":"btn")+'">'+t+'</button>';});
    h+='</div><p class="k">KiT icon</p><div class="icons">';
    ICONS.forEach(function(ic){h+='<button data-a="icon" data-v="'+ic+'" class="'+(S.icon===ic?"on":"")+'">'+ic+'</button>';});
    h+='</div><div class="rowbtns"><button data-a="toggle" data-v="mcp">MCP '+(S.mcp?"on":"off")+'</button><button data-a="toggle" data-v="github">GitHub '+(S.github?"signed in":"not signed in")+'</button></div>';
  } else if(S.page==="account"){
    h+='<h2>Account</h2><p>Thomas James \u00b7 thomas@local</p><p class="k">Logout lives only here. ORCID 0009-0006-5050-986X</p><div class="rowbtns"><button data-a="toast" data-v="Session stays on device">Stay signed in</button><button data-a="toast" data-v="Local session cleared">Logout</button></div>';
  } else if(S.screen==="files"){
    h+='<h2>aurora-sync</h2><p class="k">Your private vault \u00b7 '+(S.dirty?"unsaved changes":"clean")+'</p>';
    h+='<input placeholder="Find a file\u2026" value="'+esc(S.find)+'" data-a="findbox" style="width:100%;background:#0d1117;border:1px solid var(--line);border-radius:8px;padding:8px;margin:8px 0">';
    h+='<div class="rowbtns"><button data-a="newfile">New file</button><button data-a="toast" data-v="Whole project staged locally">Whole project</button><button data-a="tab" data-v="share">Share\u2026</button></div><div class="tree">';
    listFiles().filter(function(f){return !S.find||f.toLowerCase().indexOf(S.find.toLowerCase())>=0;}).forEach(function(f){
      h+='<button data-a="open" data-v="'+esc(f)+'" class="'+(S.file===f?"on":"")+'">\ud83d\udcc4 '+esc(f)+(S.dirty&&S.file===f?' <span class="badge">\u25cf</span>':'')+'</button>';
    });
    h+='</div>';
  } else if(S.screen==="code"){
    h+='<p class="k">aurora-sync/'+esc(S.file)+'</p><textarea class="ed" data-a="edit">'+esc(S.files[S.file]||"")+'</textarea><div class="rowbtns"><button data-a="save">Save</button><button data-a="format">Format</button><button data-a="tab" data-v="kit">Ask KiT</button></div>';
  } else if(S.screen==="kit"){
    h+='<p class="k">KiT \u00b7 '+S.icon+' the Branchfox</p><div class="chat">';
    S.kit.forEach(function(m){h+='<div class="bubble '+(m.who==="kit"?"kit":"")+'">'+(m.who==="kit"?S.icon+" ":"You \u00b7 ")+esc(m.text)+'</div>';});
    h+='</div><div class="rowbtns"><button data-a="preset" data-v="Plan then code this file">Plan then code this file</button><button data-a="preset" data-v="Hand this to Researcher then Coder">Hand this to Researcher then Coder</button></div><div class="composer"><input placeholder="Tell KiT what you want\u2026" data-a="prompt" value="'+esc(S.prompt)+'"><button class="btn primary" data-a="send">Send</button></div>';
  } else if(S.screen==="git"){
    h+='<h2>Git</h2><p class="k">aurora-sync \u00b7 main \u00b7 '+(S.github?"GitHub connected":"GitHub not signed in")+'</p><p>'+(S.dirty?"modified: "+esc(S.file):"working tree clean")+'</p><div class="rowbtns"><button data-a="commit">Commit\u2026</button><button data-a="toast" data-v="'+(S.github?"Pushed to origin/main":"Sign in first")+'">Push / Pull</button><button data-a="toast" data-v="On branch main">Branches</button></div>';
  } else if(S.screen==="terminal"){
    h+='<p class="k">fox \u203a device shell</p><textarea class="ed term" data-a="term" spellcheck="false">'+esc(S.term)+'</textarea><div class="rowbtns"><button data-a="termclear">Clear</button><button data-a="toast" data-v="Session kept">Kill session</button></div>';
  } else {
    h+='<h2>Share</h2><p class="k">Scoped share. Import '+(S.github?"ready":"off until GitHub sign-in")+'.</p><div class="rowbtns"><button data-a="copy">Copy link</button><button data-a="export">Export project</button></div><p class="k">Demo pages live in this file. Full source can ride with aurora-sync.</p>';
  }
  h+='</div>';
  if(S.edge){h+='<div class="scrim" data-a="x"></div><aside class="edge"><p class="k">Swipe any edge \u00b7 drag the tab</p><h3>App menu</h3><button data-a="go" data-v="account">Account</button><button data-a="go" data-v="settings">Settings</button><button data-a="go" data-v="settings">Display</button><button data-a="go" data-v="settings">Icons</button><button data-a="toggle" data-v="github">GitHub</button><button data-a="tab" data-v="files">Workspace</button></aside>';}
  if(S.tools){h+='<div class="scrim" data-a="x"></div><div class="tools"><div class="k" style="text-align:center;letter-spacing:.22em">CODING TOOLS</div><div class="grid"><button data-a="newfile">New file</button><button data-a="save">Save</button><button data-a="find">Find</button><button data-a="tab" data-v="terminal">Terminal</button><button data-a="tab" data-v="kit">KiT</button><button data-a="commit">Commit</button><button data-a="toast" data-v="Wrap on">Wrap</button><button data-a="format">Format</button><button data-a="run">Run file</button></div></div>';}
  h+='<button class="handle gold" data-a="edge" title="App menu">\u25a3</button><button class="fab" data-a="fab" title="Coding tools">'+S.icon+'</button>';
  h+='<div class="status"><span class="pill ok">On this device</span><span class="pill">Thomas Ross</span><span class="pill '+(S.github?"ok":"")+'">'+(S.github?"GitHub signed in":"GitHub not signed in")+'</span><span class="pill '+(S.mcp?"ok":"")+'">MCP '+(S.mcp?"on":"off")+'</span>';
  if(S.dirty) h+='<span class="pill warn">unsaved</span>';
  h+='</div></div>';
  if(S.toast) h+='<div class="toast">'+esc(S.toast)+'</div>';
  document.getElementById("app").innerHTML=h; bindLive(); save(S);
}
function esc(s){
  return String(s==null?"":s).replace(/[&<>"']/g,function(c){return ({"&":"&","<":"<",">":">","\"":""","'":"&#39;"})[c];});
}
function bindLive(){
  var find=document.querySelector("[data-a=findbox]");
  if(find){find.addEventListener("input",function(){S.find=find.value;});find.addEventListener("keydown",function(e){if(e.key==="Enter"){paint();}});}
  var ed=document.querySelector("textarea[data-a=edit]");
  if(ed){ed.addEventListener("input",function(){S.files[S.file]=ed.value;S.dirty=true;});}
  var pr=document.querySelector("[data-a=prompt]");
  if(pr){pr.addEventListener("input",function(){S.prompt=pr.value;});pr.addEventListener("keydown",function(e){if(e.key==="Enter"){sendKit();e.preventDefault();}});}
  var term=document.querySelector("textarea[data-a=term]");
  if(term){term.addEventListener("keydown",function(e){
    if(e.key==="Enter"){
      var lines=term.value.split("\n"); var last=lines[lines.length-1].replace(/^fox \u203a\s?/,"");
      S.term=term.value.replace(/\n$/,""); if(!/fox \u203a\s*$/.test(S.term)) S.term+="\n";
      runTerm(last); e.preventDefault(); paint();
      var t2=document.querySelector("textarea[data-a=term]"); if(t2){t2.scrollTop=t2.scrollHeight;t2.focus();}
    }
  });}
}
function sendKit(){
  var q=(S.prompt||"").trim(); if(!q) return;
  S.kit.push({who:"you",text:q}); S.kit.push({who:"kit",text:kitReply(q)}); S.prompt=""; toast("KiT replied");
}
function handle(a,v){
  if(a==="tab"){S.menu=(S.menu===v)?null:v;S.screen=v;S.page="ws";S.tools=0;S.edge=0;}
  else if(a==="item"){
    S.menu=null;
    if(v==="New file") newFile();
    else if(v==="Format document") formatDoc();
    else if(v==="Clear"){S.term="fox \u203a ";S.screen="terminal";}
    else if(v==="Status"||v==="Commit\u2026"||v==="Push / Pull"||v==="Branches"){S.screen="git";S.page="ws";if(v==="Commit\u2026")commitSim();}
    else if(v==="New chat"){S.kit=[{who:"kit",text:"New thread. I am KiT."}];S.screen="kit";}
    else if(v==="Copy link"||v==="Export project"||v==="Invite reviewer"){S.screen="share";}
    else {S.screen="code";S.page="ws";}
  }
  else if(a==="open"){S.menu=null;S.file=v;S.screen="code";S.page="ws";}
  else if(a==="fab"){S.tools=!S.tools;S.menu=null;S.edge=0;}
  else if(a==="edge"){S.edge=!S.edge;S.menu=null;S.tools=0;}
  else if(a==="x"){S.edge=0;S.tools=0;S.menu=null;}
  else if(a==="go"){S.page=v;S.edge=0;S.menu=null;}
  else if(a==="boot"){S.boot=1;paint();setTimeout(function(){S.boot=0;paint();},900);return;}
  else if(a==="find"){S.screen="files";S.page="ws";S.tools=0;}
  else if(a==="tool"){S.tools=0;S.screen=v||"code";S.page="ws";}
  else if(a==="theme"){S.theme=v;}
  else if(a==="icon"){S.icon=v;}
  else if(a==="toggle"){ if(v==="mcp") S.mcp=!S.mcp; if(v==="github") S.github=!S.github; }
  else if(a==="save"){S.dirty=false;toast("Saved "+S.file);}
  else if(a==="format") formatDoc();
  else if(a==="newfile") newFile();
  else if(a==="commit") commitSim();
  else if(a==="send") sendKit();
  else if(a==="preset"){S.prompt=v;sendKit();}
  else if(a==="termclear") S.term="fox \u203a ";
  else if(a==="run"){S.screen="terminal";S.page="ws";S.tools=0;S.term+="run "+S.file+"\nGitSU \u00b7 KiT the Branchfox\nexit 0\nfox \u203a ";toast("Ran "+S.file);}
  else if(a==="copy"){var url=location.href; if(navigator.clipboard) navigator.clipboard.writeText(url).catch(function(){}); toast("Copied "+url);}
  else if(a==="export"){var blob=new Blob([JSON.stringify({files:S.files,file:S.file},null,2)],{type:"application/json"}); var ael=document.createElement("a"); ael.href=URL.createObjectURL(blob);ael.download="aurora-sync.json";ael.click(); toast("Exported aurora-sync.json");}
  else if(a==="toast") toast(v||"OK");
  paint();
}
document.getElementById("app").addEventListener("click",function(e){
  var b=e.target.closest("[data-a]");
  if(!b){ if(!e.target.closest("[data-keep]")){S.menu=null;S.edge=0;S.tools=0;paint();} return; }
  handle(b.getAttribute("data-a"),b.getAttribute("data-v"));
});
var sx=0;
document.addEventListener("touchstart",function(e){sx=e.changedTouches[0].clientX;},{passive:true});
document.addEventListener("touchend",function(e){
  var x=e.changedTouches[0].clientX;
  if(sx<24 && x-sx>50){S.edge=1;S.tools=0;S.menu=null;paint();}
  if(sx<80 && S.edge && sx-x>50){S.edge=0;paint();}
},{passive:true});
setTimeout(function(){S.boot=0;paint();},1300);
paint();
})();
