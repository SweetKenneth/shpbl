/**
 * The closing track — "Built to Last" — appended to Volume VI by the reader
 * proxy in src/routes/read.$slug.ts. This module is server-only string
 * templating: the sealed volume HTML is a raw document, not the React app,
 * so the player, lyrics and Pulse calls ship as plain HTML/CSS/JS.
 *
 * No third-party scripts, no embeds, no cookies. Never autoplays.
 */

export const CLOSING_TRACK_SLUG = "volume-06-the-drift-watch";
export const CLOSING_TRACK_ANCHOR = `/read/${CLOSING_TRACK_SLUG}#built-to-last`;

const LYRICS = `[Intro — instrumental, 8 bars, piano and drums build]

[Verse 1]
Blue light at 2 a.m., no team on the call,
three thousand hours and my name on it all.
No board, no seed, no co-sign, no crew,
just a stubborn kind of patience and the work I could do.
Took the vowels out of able, left the bones in the name,
CMPSBL, RSLVBL, same grammar, same flame.
Forty primitives humming under everything I ship,
and I don't say a word 'til the database says it.

[Pre-Chorus]
So I ran the count again...
twelve thousand? No.
Four forty-six.
Print it. Let it go.

[Chorus]
Built to last, built to last,
count it up or don't say it, don't move that fast.
Knowledge is power, legacy is wealth,
nobody checks me, so I check myself. (oh-oh)
Built to last, built to last,
the floor don't guess and the floor don't crack.
Same in, same out, watch it come back.
Built to last. Built to last.

[Post-Chorus]
(Demote it, demote it, never promote it)
Built to last.
(Demote it, demote it, never promote it)
Built to last.

[Verse 2]
Substrate, not features, own the floor, not the paint,
let 'em build on your bones, that's the difference in the play.
Two-sixty-six tables, got receipts on every one;
if I can't run the query then the claim don't come.
Ship the crystal, keep the vault right where it stayed:
one sealed file, zero deps, gets paid.
Six little worlds and they all speak they own slang,
one manifest running underneath the whole thing.

[Chorus]
Built to last, built to last,
count it up or don't say it, don't move that fast.
Knowledge is power, legacy is wealth,
nobody checks me, so I check myself. (oh-oh)
Built to last, built to last,
the floor don't guess and the floor don't crack.
Same in, same out, watch it come back.
Built to last. Built to last.

[Post-Chorus]
(Demote it, demote it, never promote it)
Built to last.
(Demote it, demote it, never promote it)
Built to last.

[Bridge]
Five orders. Zero paid. I said it out loud.
Wrote it in my own book, didn't dress it up proud.
Building's unblocked; it's the distribution that's slow,
so I keep it on the page where I can't not know.
A garden for a cat that came in from the cold,
a switch that hands the keys when the story gets old,
two kids and a namespace, that's the whole estate.
The work itself's the goal. The rest can wait.

[Beat Break — instrumental, 8 bars, drums and synth]

[Verse 3]
Stage one write the manual, stage two tear it apart;
the diff between the drafts is the realest part.
I don't need a witness, I keep my own receipts,
hash it, seal it, ledger, repeat.
Somebody's gonna read this when I'm long gone,
so I wrote the whole map, not just the song.
Every name, every number, every reason why,
built to be inherited. That's the alibi.

[Final Chorus — full stack, gang vocals, ad-libs]
Built to last, built to last, (yeah)
count it up or don't say it, don't move that fast. (say it)
Knowledge is power, legacy is wealth,
nobody checks me, so I check myself. (oh-oh)
Built to last, built to last, (built it)
the floor don't guess and the floor don't crack. (never)
Same in, same out, watch it come back.
Built to last. Built to last.

[Post-Chorus]
(Demote it, demote it, never promote it)
Built to last.
(Demote it, demote it, never promote it)
Built to last.

[Outro — beat drops to piano]
Demote the claim.
Ship the crystal.
Built to last.
(built to last... built to last...)`;

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const STYLE = `
#built-to-last{margin:64px 0 0;scroll-margin-top:20px}
#built-to-last .bt-card{position:relative;border:2.5px solid var(--ink);
  border-left:9px solid var(--yellow);border-radius:6px;background:#fff;
  padding:26px 22px 22px;overflow:hidden}
#built-to-last .bt-spectrum{height:3px;border-radius:2px;margin:0 0 18px;
  background:linear-gradient(90deg,var(--magenta),var(--cyan),var(--orange),
  var(--pink),var(--lime),var(--yellow));max-width:220px}
#built-to-last .bt-eyebrow{font-family:var(--mono);font-size:11px;font-weight:600;
  letter-spacing:.26em;text-transform:uppercase;color:var(--ink-faint);margin:0 0 8px}
#built-to-last h2.bt-title{font-family:var(--display);font-size:46px;line-height:.95;
  letter-spacing:1px;text-transform:uppercase;margin:0 0 8px;border:0;padding:0}
#built-to-last .bt-sub{font-size:17px;font-weight:600;margin:0 0 10px}
#built-to-last .bt-desc{color:var(--ink-dim);margin:0 0 20px}
#built-to-last .bt-credit{font-family:var(--mono);font-size:11px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--ink-faint);margin:0 0 16px}
#built-to-last .bt-controls{display:flex;align-items:center;gap:14px;flex-wrap:wrap}
#built-to-last button{font-family:var(--mono);cursor:pointer;background:var(--ink);
  color:var(--paper);border:2px solid var(--ink);border-radius:4px}
#built-to-last .bt-play{width:56px;height:56px;font-size:16px;line-height:1;
  display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto}
#built-to-last .bt-play:hover{background:var(--paper);color:var(--ink)}
#built-to-last .bt-time{font-family:var(--mono);font-size:12px;color:var(--ink-dim);
  min-width:96px}
#built-to-last input[type=range]{-webkit-appearance:none;appearance:none;height:6px;
  background:var(--border);border:1px solid var(--border-strong);border-radius:4px;
  width:100%;margin:0}
#built-to-last input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;
  width:18px;height:18px;border-radius:50%;background:var(--ink);
  border:2px solid var(--paper);cursor:pointer}
#built-to-last input[type=range]::-moz-range-thumb{width:16px;height:16px;
  border-radius:50%;background:var(--ink);border:2px solid var(--paper);cursor:pointer}
#built-to-last .bt-seekwrap{flex:1 1 220px;min-width:180px}
#built-to-last .bt-volwrap{display:flex;align-items:center;gap:8px;width:150px}
#built-to-last .bt-volwrap label{font-family:var(--mono);font-size:11px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--ink-faint)}
#built-to-last :focus-visible{outline:3px solid var(--cyan);outline-offset:3px}
#built-to-last .bt-lyrics{margin:22px 0 0;border-top:2px solid var(--ink);padding-top:14px}
#built-to-last .bt-lyrics summary{font-family:var(--mono);font-size:12px;font-weight:600;
  letter-spacing:.2em;text-transform:uppercase;cursor:pointer;list-style:none}
#built-to-last .bt-lyrics summary::-webkit-details-marker{display:none}
#built-to-last .bt-lyrics pre{font-family:var(--body);font-size:15.5px;line-height:1.75;
  white-space:pre-wrap;margin:16px 0 0;color:var(--ink-dim)}
#built-to-last .bt-close{margin:18px 0 0;font-style:italic;color:var(--ink-dim)}
#built-to-last .bt-note{font-family:var(--mono);font-size:11px;color:var(--ink-faint);
  margin:10px 0 0;letter-spacing:.04em}
@media (max-width:520px){
  #built-to-last h2.bt-title{font-size:36px}
  #built-to-last .bt-volwrap{width:100%}
}
@media print{
  #built-to-last .bt-controls,#built-to-last .bt-note{display:none}
  #built-to-last .bt-lyrics pre{display:block}
}
`;

export function closingTrackHtml(audioUrl: string): string {
  const script = `
(function(){
  var root=document.getElementById('built-to-last');
  if(!root) return;
  var audio=root.querySelector('audio');
  var play=root.querySelector('.bt-play');
  var seek=root.querySelector('.bt-seek');
  var vol=root.querySelector('.bt-vol');
  var cur=root.querySelector('.bt-cur');
  var dur=root.querySelector('.bt-dur');
  var lyrics=root.querySelector('.bt-lyrics');
  var seeking=false, completed=false, seekSent=false, lyricsSent=false;

  function sid(){
    try{
      var k='shpbl:sid', v=sessionStorage.getItem(k);
      if(!v){v=(crypto.randomUUID?crypto.randomUUID():String(Math.random())).replace(/-/g,'').slice(0,24);
        sessionStorage.setItem(k,v);}
      return v;
    }catch(e){return 'no-storage';}
  }
  function device(){var w=window.innerWidth;return w<768?'mobile':(w<1100?'tablet':'desktop');}
  function pulse(event,props){
    try{
      if(localStorage.getItem('shpbl:analytics-off')==='1') return;
    }catch(e){}
    if(navigator.webdriver) return;
    var body=JSON.stringify({event:event,path:location.pathname,sessionId:sid(),
      device:device(),standalone:window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,
      props:props||{}});
    try{
      if(navigator.sendBeacon){
        navigator.sendBeacon('/api/public/pulse',new Blob([body],{type:'application/json'}));
        return;
      }
    }catch(e){}
    fetch('/api/public/pulse',{method:'POST',headers:{'content-type':'application/json'},
      body:body,keepalive:true}).catch(function(){});
  }

  function fmt(s){
    if(!isFinite(s)) return '--:--';
    s=Math.max(0,Math.floor(s));
    return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  }
  function setPlayLabel(playing){
    play.textContent=playing?'❚❚':'▶';
    play.setAttribute('aria-label',(playing?'Pause':'Play')+' Built to Last');
    play.setAttribute('aria-pressed',playing?'true':'false');
  }

  audio.addEventListener('loadedmetadata',function(){
    dur.textContent=fmt(audio.duration);
    seek.max=isFinite(audio.duration)?String(audio.duration):'100';
  });
  audio.addEventListener('timeupdate',function(){
    if(!seeking){seek.value=String(audio.currentTime);}
    cur.textContent=fmt(audio.currentTime);
    seek.setAttribute('aria-valuetext',fmt(audio.currentTime)+' of '+fmt(audio.duration));
    if(!completed&&audio.duration&&audio.currentTime/audio.duration>=0.95){
      completed=true; pulse('closing_track_complete',{});
    }
  });
  audio.addEventListener('play',function(){setPlayLabel(true);pulse('closing_track_play',{});cacheAudio();});
  audio.addEventListener('pause',function(){
    setPlayLabel(false);
    if(!audio.ended) pulse('closing_track_pause',{at:Math.round(audio.currentTime)});
  });
  audio.addEventListener('ended',function(){setPlayLabel(false);});

  play.addEventListener('click',function(){
    if(audio.paused){ audio.play().catch(function(){}); } else { audio.pause(); }
  });
  seek.addEventListener('input',function(){seeking=true;cur.textContent=fmt(Number(seek.value));});
  function commitSeek(){
    seeking=false; audio.currentTime=Number(seek.value);
    if(!seekSent){seekSent=true;pulse('closing_track_seek',{});}
  }
  seek.addEventListener('change',commitSeek);
  if(vol){
    // iOS Safari exposes audio.volume read-only; hide the slider when unsupported.
    try{ audio.volume=0.5; }catch(e){}
    if(Math.abs(audio.volume-0.5)>0.01){
      var vw=root.querySelector('.bt-volwrap'); if(vw) vw.style.display='none';
    } else {
      audio.volume=1;
      vol.addEventListener('input',function(){audio.volume=Number(vol.value);});
    }
  }
  if(lyrics){
    lyrics.addEventListener('toggle',function(){
      if(lyrics.open&&!lyricsSent){lyricsSent=true;pulse('closing_track_lyrics_open',{});}
    });
  }

  // Cache the mp3 on demand — never in the install precache.
  //
  // Safari streams media with Range requests, and a 206 is not cacheable, so the
  // service worker can never populate this cache from playback alone. One plain
  // GET stores the full 200; the SW's rangeRequests strategy slices it from then
  // on. Only worth the extra ~5 MB when a worker is actually there to serve it.
  var cached=false;
  function cacheAudio(){
    if(cached||!('caches' in window)) return;
    if(!navigator.serviceWorker||!navigator.serviceWorker.controller) return;
    var conn=navigator.connection||navigator.mozConnection||navigator.webkitConnection;
    if(conn&&(conn.saveData||/(^|-)2g$/.test(conn.effectiveType||''))) return;
    cached=true;
    setTimeout(function(){
      caches.open('shpbl-audio').then(function(c){
        return c.match(${JSON.stringify(audioUrl)},{ignoreVary:true}).then(function(hit){
          if(hit) return;
          return fetch(${JSON.stringify(audioUrl)},{credentials:'same-origin'}).then(function(r){
            if(r&&r.status===200) return c.put(${JSON.stringify(audioUrl)},r);
          });
        });
      }).then(function(){
        var note=root.querySelector('.bt-note');
        if(note) note.textContent='Saved for offline listening on this device · lyrics double as the transcript';
      }).catch(function(){});
    },4000);
  }

  setPlayLabel(false);
  if('IntersectionObserver' in window){
    var seen=false;
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting&&!seen){seen=true;pulse('closing_track_view',{});io.disconnect();}
      });
    },{threshold:0.35});
    io.observe(root);
  } else { pulse('closing_track_view',{}); }
})();
`;

  return `<style>${STYLE}</style>
<section id="built-to-last" aria-labelledby="bt-heading">
<div class="bt-card">
  <div class="bt-spectrum" aria-hidden="true"></div>
  <p class="bt-eyebrow">The Closing Track</p>
  <h2 class="bt-title" id="bt-heading">Built to Last</h2>
  <p class="bt-sub">A yapFM original drawn from The Strategic Master Library.</p>
  <p class="bt-desc">Six volumes reduced to one song: the truth ladder, the substrate, the crystal, the inheritance plan, and the standing rules that keep a solo founder honest.</p>
  <p class="bt-credit">yapFM Original · Kenneth E. Sweet Jr. · 2026</p>

  <audio preload="metadata" src="${audioUrl}" title="Built to Last — yapFM / Kenneth E. Sweet Jr."></audio>
  <div class="bt-controls">
    <button type="button" class="bt-play" aria-label="Play Built to Last" aria-pressed="false">▶</button>
    <span class="bt-time"><span class="bt-cur">0:00</span> / <span class="bt-dur">--:--</span></span>
    <span class="bt-seekwrap">
      <label class="bt-visually-hidden" for="bt-seek" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Seek within Built to Last</label>
      <input class="bt-seek" id="bt-seek" type="range" min="0" max="100" step="0.1" value="0" aria-label="Seek within Built to Last">
    </span>
    <span class="bt-volwrap">
      <label for="bt-vol">Vol</label>
      <input class="bt-vol" id="bt-vol" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volume">
    </span>
  </div>

  <details class="bt-lyrics">
    <summary>Read the lyrics +</summary>
    <pre>${escape(LYRICS)}</pre>
  </details>

  <p class="bt-close">The library ends where it began: nobody checks me, so I check myself.</p>
  <p class="bt-note">Never autoplays · first-party audio · lyrics double as the transcript</p>
</div>
  <script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: "Built to Last",
    byArtist: { "@type": "MusicGroup", name: "yapFM", member: { "@type": "Person", name: "Kenneth E. Sweet Jr." } },
    inAlbum: { "@type": "MusicAlbum", name: "The Strategic Master Library \u2014 Volume Edition" },
    datePublished: "2026",
    genre: "Alternative Hip-Hop / Founder Anthem",
    audio: { "@type": "AudioObject", contentUrl: audioUrl, encodingFormat: "audio/mpeg" },
    isFamilyFriendly: true,
  })}</script>
</section>
<script>${script}</script>
`;
}
