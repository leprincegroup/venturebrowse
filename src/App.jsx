import { useState, useEffect } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --w:#ffffff;--off:#f7f6f2;--off2:#eeece6;
    --ink:#0d0d0b;--ink2:#3a3a35;--ink3:#7a7a70;--ink4:#aeada5;
    --bd:#e4e2db;--bd2:#cccabf;
    --g:#1a7a52;--gl:#e8f4ee;
    --a:#8a5e0a;--al:#fdf2dc;
    --r:#9b2c2c;--rl:#fef0f0;
    --b:#1a3f7a;--bl:#e6edf8;
    --serif:'Instrument Serif',Georgia,serif;
    --sans:'DM Sans',system-ui,sans-serif;
    --mono:'JetBrains Mono',monospace;
  }
  html{scroll-behavior:smooth}
  body{background:var(--w);color:var(--ink);font-family:var(--sans);-webkit-font-smoothing:antialiased;overflow-x:hidden}
  ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ccc;border-radius:2px}

  /* TICKER */
  .ticker{background:var(--ink);height:32px;overflow:hidden;display:flex;align-items:center}
  .t-track{display:flex;animation:tick 60s linear infinite;white-space:nowrap}
  @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  .t-item{display:inline-flex;align-items:center;gap:8px;padding:0 24px;height:32px;font-family:var(--mono);font-size:11px;color:rgba(255,255,255,.45);border-right:1px solid rgba(255,255,255,.08)}
  .t-name{color:rgba(255,255,255,.88);font-weight:500}
  .t-up{color:#4ade80}.t-dn{color:#f87171}

  /* NAV */
  nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-bottom:1px solid var(--bd);height:60px;padding:0 40px;display:flex;align-items:center;justify-content:space-between}
  .logo{cursor:pointer;display:flex;align-items:center;height:20px}
  .logo svg{height:18px;width:auto}
  .nav-tabs{display:flex;gap:2px}
  .ntab{padding:7px 15px;font-size:14px;color:var(--ink3);cursor:pointer;border:none;background:none;font-family:var(--sans);border-radius:6px;transition:color .15s}
  .ntab:hover{color:var(--ink)}.ntab.on{color:var(--ink);font-weight:500}
  .nav-r{display:flex;align-items:center;gap:10px}
  .ghost{padding:8px 16px;border:none;background:none;color:var(--ink3);font-size:14px;cursor:pointer;font-family:var(--sans)}
  .ghost:hover{color:var(--ink)}
  .pill{padding:9px 22px;border-radius:100px;background:var(--ink);color:#fff;font-size:14px;font-weight:500;cursor:pointer;border:none;font-family:var(--sans);letter-spacing:-.01em;transition:opacity .15s}
  .pill:hover{opacity:.82}
  .pill-o{padding:8px 20px;border-radius:100px;background:transparent;color:var(--ink);border:1.5px solid var(--ink);font-size:14px;font-weight:500;cursor:pointer;font-family:var(--sans);transition:all .15s}
  .pill-o:hover{background:var(--ink);color:#fff}

  /* LAYOUT */
  .wrap{max-width:1200px;margin:0 auto;padding:0 40px 80px}

  /* TAG */
  .tag{display:inline-flex;align-items:center;padding:3px 10px;border-radius:100px;font-size:12px;font-weight:500;border:1px solid;font-family:var(--sans)}
  .tg{background:var(--gl);color:var(--g);border-color:rgba(26,122,82,.2)}
  .ta{background:var(--al);color:var(--a);border-color:rgba(138,94,10,.2)}
  .tr{background:var(--rl);color:var(--r);border-color:rgba(155,44,44,.2)}
  .tb{background:var(--bl);color:var(--b);border-color:rgba(26,63,122,.2)}
  .tm{background:var(--off);color:var(--ink3);border-color:var(--bd)}

  /* EYEBROW */
  .eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink4);margin-bottom:20px;display:flex;align-items:center;gap:8px}
  .eyebrow::before{content:'';width:18px;height:1px;background:var(--ink4)}

  /* SOTD */
  .sotd{padding:52px 0 44px;border-bottom:1px solid var(--bd)}
  .sotd-grid{display:grid;grid-template-columns:1fr 320px;gap:64px;align-items:start}
  .sotd-title{font-family:var(--serif);font-size:50px;line-height:1.07;letter-spacing:-.01em;color:var(--ink);margin-bottom:12px}
  .sotd-title em{font-style:italic;color:var(--ink3)}
  .sotd-meta{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:18px}
  .sotd-desc{font-size:15px;line-height:1.72;color:var(--ink2);max-width:500px;margin-bottom:28px;font-weight:300}
  .sotd-sigs{display:flex;gap:36px;margin-bottom:28px}
  .sig{display:flex;flex-direction:column;gap:4px}
  .sig-l{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4)}
  .sig-v{font-family:var(--mono);font-size:20px;font-weight:600}
  .sv-g{color:var(--g)}.sv-a{color:var(--a)}.sv-i{color:var(--ink)}
  .sotd-acts{display:flex;gap:10px}

  /* SCORE CARD */
  .scard{background:var(--off);border:1px solid var(--bd);border-radius:14px;padding:24px}
  .scard-ttl{font-family:var(--mono);font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);margin-bottom:18px}
  .srow{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--bd)}
  .srow:last-of-type{border:none}
  .srow-name{font-size:13px;color:var(--ink2)}
  .srow-r{display:flex;align-items:center;gap:10px}
  .sbar-bg{width:60px;height:3px;background:var(--bd2);border-radius:2px;overflow:hidden}
  .sbar-fill{height:100%;border-radius:2px;transition:width 1s cubic-bezier(.22,1,.36,1)}
  .sf-g{background:var(--g)}.sf-a{background:var(--a)}
  .snum{font-family:var(--mono);font-size:13px;font-weight:600;color:var(--ink);width:22px;text-align:right}
  .dive{width:100%;margin-top:18px;padding:11px;border-radius:100px;background:var(--ink);color:#fff;font-size:13px;font-weight:500;cursor:pointer;border:none;font-family:var(--sans);display:flex;align-items:center;justify-content:center;gap:6px;transition:opacity .15s}
  .dive:hover{opacity:.8}

  /* FEED */
  .feed{padding:44px 0 0}
  .feed-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
  .sec-title{font-family:var(--serif);font-size:32px;color:var(--ink);letter-spacing:-.01em}
  .filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px;align-items:center}
  .fchip{padding:6px 14px;border:1px solid var(--bd);border-radius:100px;background:none;color:var(--ink3);font-size:13px;cursor:pointer;font-family:var(--sans);transition:all .15s}
  .fchip:hover{border-color:var(--ink);color:var(--ink)}
  .fchip.on{background:var(--ink);color:#fff;border-color:var(--ink)}
  .srch{display:flex;align-items:center;gap:8px;background:var(--off);border:1px solid var(--bd);border-radius:100px;padding:7px 16px}
  .srch input{background:none;border:none;outline:none;font-size:13px;color:var(--ink);font-family:var(--sans);width:180px}
  .srch input::placeholder{color:var(--ink4)}

  /* GRID */
  .cgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
  .ccard{background:var(--w);padding:26px;cursor:pointer;transition:all .2s}
  .ccard:hover{background:var(--off);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.04)}
  .ctop{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px}
  .clogo{width:38px;height:38px;border-radius:9px;border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:13px;font-weight:600;color:var(--ink);background:var(--off);flex-shrink:0}
  .mbadge{display:flex;flex-direction:column;align-items:flex-end;gap:3px}
  .mnum{font-family:var(--mono);font-size:26px;font-weight:600;line-height:1}
  .mlbl{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);margin-top:2px}
  .cname{font-size:15px;font-weight:600;letter-spacing:-.02em;margin-bottom:5px}
  .ctag{font-size:13px;color:var(--ink3);line-height:1.5;margin-bottom:16px;font-weight:300}
  .ctags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:14px}
  .cmetrics{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border-top:1px solid var(--bd);margin:0 -26px -26px}
  .cmet{background:var(--w);padding:11px 13px}
  .ccard:hover .cmet{background:var(--off)}
  .cml{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);margin-bottom:3px}
  .cmv{font-family:var(--mono);font-size:13px;font-weight:600;color:var(--ink)}
  .cmv.g{color:var(--g)}.cmv.a{color:var(--a)}

  /* INV */
  .igrid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
  .icard{background:var(--w);padding:26px;cursor:pointer;transition:background .15s}
  .icard:hover{background:var(--off)}
  .itop{display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap}
  .iav{width:42px;height:42px;border-radius:10px;border:1px solid var(--bd);display:flex;align-items:center;justify-content:center;font-family:var(--mono);font-size:13px;font-weight:600;background:var(--off);flex-shrink:0}
  .iname{font-size:15px;font-weight:600;letter-spacing:-.02em}
  .itype{font-size:12px;color:var(--ink3);font-weight:300;margin-top:1px}
  .istats{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--bd);padding-top:14px;margin-top:8px}
  .isl{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);margin-bottom:3px}
  .isv{font-family:var(--mono);font-size:15px;font-weight:600;color:var(--ink)}
  .iact{display:flex;align-items:flex-end;gap:3px;height:26px;margin-top:12px}
  .abar{flex:1;border-radius:2px;background:var(--bd);min-height:2px}
  .abar.hi{background:var(--ink)}.abar.md{background:var(--ink3)}

  /* CAT */
  .kgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
  .kcard{background:var(--w);padding:26px;cursor:pointer;transition:background .15s}
  .kcard:hover{background:var(--off)}
  .kicon{font-size:22px;margin-bottom:12px}
  .kname{font-size:15px;font-weight:600;letter-spacing:-.02em;margin-bottom:5px}
  .ksub{font-size:12px;color:var(--ink3);margin-bottom:16px;line-height:1.5;font-weight:300}
  .kstats{display:flex;gap:20px;border-top:1px solid var(--bd);padding-top:12px}
  .ksv{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--ink)}
  .ksl{font-size:10px;color:var(--ink4);margin-top:2px}
  .kgrow{color:var(--g)}

  /* PANEL */
  .overlay{position:fixed;inset:0;background:rgba(13,13,11,.35);z-index:200;display:flex;justify-content:flex-end;animation:fi .2s ease;backdrop-filter:blur(2px)}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  .panel{background:var(--w);width:520px;height:100vh;overflow-y:auto;border-left:1px solid var(--bd);animation:si .28s cubic-bezier(.22,1,.36,1);display:flex;flex-direction:column}
  @keyframes si{from{transform:translateX(28px);opacity:0}to{transform:translateX(0);opacity:1}}
  .phdr{padding:26px 26px 18px;border-bottom:1px solid var(--bd);display:flex;align-items:flex-start;justify-content:space-between}
  .pco{font-family:var(--serif);font-size:24px;color:var(--ink);margin-bottom:3px}
  .psub{font-size:13px;color:var(--ink3);font-weight:300}
  .xcl{width:30px;height:30px;border-radius:100px;border:1px solid var(--bd);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;color:var(--ink3);font-size:18px;transition:all .15s;flex-shrink:0}
  .xcl:hover{border-color:var(--ink);color:var(--ink)}
  .pbody{padding:26px;flex:1}
  .pstl{font-family:var(--mono);font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ink4);margin-bottom:14px}
  .pmets{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:11px;overflow:hidden;margin-bottom:26px}
  .pmet{background:var(--off);padding:15px}
  .pml{font-family:var(--mono);font-size:10px;letter-spacing:.08em;text-transform:uppercase;color:var(--ink4);margin-bottom:5px}
  .pmv{font-family:var(--mono);font-size:22px;font-weight:600;color:var(--ink)}
  .pmv.g{color:var(--g)}
  .aibtn{width:100%;padding:11px;border-radius:100px;background:var(--ink);color:#fff;font-size:14px;font-weight:500;font-family:var(--sans);cursor:pointer;border:none;margin-bottom:16px;transition:opacity .15s;display:flex;align-items:center;justify-content:center;gap:7px}
  .aibtn:hover{opacity:.8}.aibtn:disabled{opacity:.45;cursor:not-allowed}
  .aiout{background:var(--off);border:1px solid var(--bd);border-radius:11px;padding:18px}
  .aithink{display:flex;align-items:center;gap:10px;color:var(--ink3);font-size:13px}
  .dots{display:flex;gap:4px}
  .dots span{width:5px;height:5px;background:var(--ink3);border-radius:50%;animation:bl 1.2s ease-in-out infinite}
  .dots span:nth-child(2){animation-delay:.2s}.dots span:nth-child(3){animation-delay:.4s}
  @keyframes bl{0%,60%,100%{opacity:.2;transform:scale(.8)}30%{opacity:1;transform:scale(1)}}
  .aitxt{font-size:13.5px;line-height:1.78;color:var(--ink2);white-space:pre-wrap;font-weight:300}
  .aitxt strong{color:var(--ink);font-weight:600}

  /* UPGRADE */
  .upgr{margin-top:60px;padding:52px;background:var(--ink);border-radius:18px;display:flex;align-items:center;justify-content:space-between;gap:40px}
  .upgr h3{font-family:var(--serif);font-size:36px;color:#fff;margin-bottom:10px;line-height:1.12}
  .upgr p{font-size:15px;color:rgba(255,255,255,.5);font-weight:300;max-width:400px;line-height:1.65}
  .upgr-acts{display:flex;gap:10px;flex-shrink:0}
  .bw{padding:10px 26px;border-radius:100px;background:#fff;color:var(--ink);font-size:14px;font-weight:500;cursor:pointer;border:none;font-family:var(--sans);white-space:nowrap;transition:opacity .15s}
  .bw:hover{opacity:.9}
  .bwo{padding:9px 24px;border-radius:100px;background:transparent;color:rgba(255,255,255,.65);border:1.5px solid rgba(255,255,255,.22);font-size:14px;font-weight:500;cursor:pointer;font-family:var(--sans);white-space:nowrap;transition:all .15s}
  .bwo:hover{color:#fff;border-color:rgba(255,255,255,.55)}

  .hr{height:1px;background:var(--bd);margin:52px 0}

  /* SPARKLINE */
  .spark{display:inline-block;vertical-align:middle}

  /* LIVE DOT */
  .live-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;display:inline-block;animation:pulse 2s ease-in-out infinite;margin-right:6px}
  @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(74,222,128,.4)}50%{opacity:.7;box-shadow:0 0 0 4px rgba(74,222,128,0)}}

  /* ACTIVITY FEED */
  .act-section{padding:36px 0 0}
  .act-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .act-title{font-family:var(--serif);font-size:24px;color:var(--ink);display:flex;align-items:center;gap:10px}
  .act-list{border:1px solid var(--bd);border-radius:14px;overflow:hidden}
  .act-item{display:flex;align-items:flex-start;gap:12px;padding:14px 20px;border-bottom:1px solid var(--bd);background:var(--w);transition:background .15s;cursor:pointer}
  .act-item:last-child{border-bottom:none}
  .act-item:hover{background:var(--off)}
  .act-ico{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;font-weight:600}
  .act-ico.hiring{background:var(--gl);color:var(--g)}
  .act-ico.traffic{background:var(--bl);color:var(--b)}
  .act-ico.funding{background:var(--al);color:var(--a)}
  .act-ico.product{background:var(--off2);color:var(--ink3)}
  .act-ico.investor{background:var(--rl);color:var(--r)}
  .act-ico.signal{background:var(--al);color:var(--a)}
  .act-ico.event{background:var(--bl);color:var(--b)}
  .act-body{flex:1;min-width:0}
  .act-co{font-weight:600;font-size:13px;color:var(--ink)}
  .act-txt{font-size:13px;color:var(--ink2);font-weight:300}
  .act-time{font-family:var(--mono);font-size:11px;color:var(--ink4);flex-shrink:0;margin-top:2px}
  .act-sev{width:5px;height:5px;border-radius:50%;flex-shrink:0;margin-top:9px}
  .act-sev.high{background:var(--g)}.act-sev.medium{background:var(--a)}.act-sev.low{background:var(--ink4)}
  .act-more{padding:11px 20px;text-align:center;font-size:13px;color:var(--ink3);cursor:pointer;background:var(--off);font-family:var(--sans);border:none;width:100%;transition:color .15s;border-top:1px solid var(--bd)}
  .act-more:hover{color:var(--ink)}

  /* WATCHLIST BTN */
  .wl-btn{width:28px;height:28px;border-radius:100px;border:1px solid var(--bd);background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;color:var(--ink4);transition:all .18s;flex-shrink:0;line-height:1}
  .wl-btn:hover{border-color:var(--r);color:var(--r);background:var(--rl)}
  .wl-btn.on{background:var(--rl);border-color:rgba(155,44,44,.3);color:var(--r)}

  /* TOAST */
  .toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%);background:var(--ink);color:#fff;padding:10px 24px;border-radius:100px;font-size:13px;font-weight:500;z-index:300;animation:toastin .3s cubic-bezier(.22,1,.36,1);box-shadow:0 8px 30px rgba(0,0,0,.18);display:flex;align-items:center;gap:8px}
  @keyframes toastin{from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}

  /* PANEL TABS */
  .ptabs{display:flex;gap:0;border-bottom:1px solid var(--bd)}
  .ptab{flex:1;padding:12px 0;text-align:center;font-size:13px;color:var(--ink3);cursor:pointer;border:none;background:none;font-family:var(--sans);border-bottom:2px solid transparent;transition:all .15s}
  .ptab:hover{color:var(--ink)}
  .ptab.on{color:var(--ink);font-weight:500;border-bottom-color:var(--ink)}

  /* FUNDING TIMELINE */
  .ftl{position:relative;padding-left:22px}
  .ftl::before{content:'';position:absolute;left:5px;top:8px;bottom:8px;width:1px;background:var(--bd)}
  .ftl-item{position:relative;padding:0 0 20px;display:flex;justify-content:space-between;align-items:flex-start}
  .ftl-item:last-child{padding-bottom:0}
  .ftl-dot{width:11px;height:11px;border-radius:50%;border:2px solid var(--bd);background:var(--w);position:absolute;left:-22px;top:4px;z-index:1}
  .ftl-dot.latest{background:var(--g);border-color:var(--g)}
  .ftl-type{font-weight:600;font-size:13px;color:var(--ink)}
  .ftl-detail{font-size:12px;color:var(--ink3);font-weight:300;margin-top:2px}
  .ftl-amt{font-family:var(--mono);font-size:14px;font-weight:600;color:var(--ink);flex-shrink:0}

  /* COMPETITORS */
  .comp-list{display:flex;flex-direction:column;gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:11px;overflow:hidden}
  .comp-item{display:flex;align-items:center;justify-content:space-between;padding:11px 14px;background:var(--w);font-size:13px}
  .comp-name{font-weight:500;color:var(--ink)}
  .comp-type{font-size:12px;color:var(--ink4);font-weight:300}

  /* SORT */
  .sort-sep{width:1px;height:16px;background:var(--bd);margin:0 6px}
  .sbtn{padding:5px 12px;border:1px solid var(--bd);border-radius:100px;background:none;color:var(--ink3);font-size:12px;cursor:pointer;font-family:var(--mono);transition:all .15s;letter-spacing:.02em}
  .sbtn:hover{border-color:var(--ink);color:var(--ink)}
  .sbtn.on{background:var(--ink);color:#fff;border-color:var(--ink)}

  /* SIGNAL ITEMS (panel) */
  .sig-item{display:flex;gap:12px;padding:13px 0;border-bottom:1px solid var(--bd)}
  .sig-item:last-child{border:none}
  .sig-time{font-family:var(--mono);font-size:10px;color:var(--ink4);width:48px;flex-shrink:0;padding-top:2px}
  .sig-txt{font-size:13px;color:var(--ink2);font-weight:300;line-height:1.55}

  /* INFO ROWS */
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 20px}
  .info-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid var(--bd)}
  .info-l{font-size:13px;color:var(--ink3);font-weight:300}
  .info-v{font-size:13px;font-weight:500;color:var(--ink)}

  /* WATCHLIST CARD */
  .wl-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--bd);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
  .wl-card{background:var(--w);padding:22px;cursor:pointer;transition:all .2s;display:flex;flex-direction:column;gap:12px}
  .wl-card:hover{background:var(--off)}
  .wl-card-top{display:flex;align-items:center;gap:12px}
  .wl-card-r{display:flex;align-items:center;gap:10px;margin-left:auto}
  .wl-remove{padding:5px 12px;border-radius:100px;border:1px solid var(--bd);background:none;color:var(--ink3);font-size:12px;cursor:pointer;font-family:var(--sans);transition:all .15s}
  .wl-remove:hover{border-color:var(--r);color:var(--r);background:var(--rl)}
  .wl-mets{display:flex;gap:20px}
  .wl-met-l{font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4)}
  .wl-met-v{font-family:var(--mono);font-size:14px;font-weight:600}
  .wl-met-v.g{color:var(--g)}

  /* LARGE SPARK */
  .spark-lg{margin:12px 0 24px;padding:16px;background:var(--off);border:1px solid var(--bd);border-radius:11px}

  @media(max-width:1100px){.cgrid{grid-template-columns:repeat(2,1fr)}.sotd-grid{grid-template-columns:1fr}.wl-grid{grid-template-columns:1fr}}
  @media(max-width:768px){.cgrid,.kgrid{grid-template-columns:1fr}.igrid{grid-template-columns:1fr}.wl-grid{grid-template-columns:1fr}.wrap{padding:0 20px 60px}nav{padding:0 20px}.upgr{flex-direction:column;padding:32px}.nav-tabs{display:none}.panel{width:100%}}
`;

const TICKER_DATA = [
  {name:"Deel",v:"$12.4B",d:"+4.2%",up:true},{name:"Harvey AI",v:"$1.5B",d:"+31%",up:true},
  {name:"Rippling",v:"$13.5B",d:"+2.8%",up:true},{name:"Supabase",v:"$200M",d:"+18%",up:true},
  {name:"Anduril",v:"$8.5B",d:"-1.2%",up:false},{name:"Figma",v:"$20B",d:"+5.7%",up:true},
  {name:"Linear",v:"$800M",d:"+12%",up:true},{name:"Scale AI",v:"$13.8B",d:"+8.6%",up:true},
  {name:"Vercel",v:"$3.25B",d:"+7.4%",up:true},{name:"Perplexity",v:"$9B",d:"+22%",up:true},
];

const SOTD = {
  name:"Amplemarket",italic:"pre-raise",
  tags:[{l:"Pre-Raise Signal",t:"tg"},{l:"Hiring +340%",t:"ta"},{l:"Traffic +180%",t:"tb"}],
  desc:"AI-native sales platform replacing legacy outbound stacks. Hiring velocity up 340% in 60 days — 11 senior AEs and 4 ML engineers added. Web traffic surged 180% in Q1. Three enterprise contract wins surfaced in public LinkedIn activity.",
  sigs:[{l:"Momentum",v:"94/100",c:"sv-i"},{l:"Hiring Δ",v:"+340%",c:"sv-g"},{l:"Traffic Δ",v:"+180%",c:"sv-g"},{l:"Raise ETA",v:"~60d",c:"sv-a"}],
  scores:[{n:"Hiring Signal",s:9.4,c:"sf-g"},{n:"Traffic Growth",s:8.1,c:"sf-g"},{n:"Funding Proximity",s:8.8,c:"sf-g"},{n:"Category Strength",s:7.2,c:"sf-a"},{n:"Team Quality",s:9.0,c:"sf-g"}],
};

const COS = [
  {
    id:1,name:"Supabase",tag:"Open-source Firebase alternative gaining enterprise momentum fast",
    logo:"SB",m:91,mc:"#1a7a52",
    metrics:[{l:"Hiring Δ",v:"+220%",c:"g"},{l:"Traffic Δ",v:"+94%",c:"g"},{l:"Stage",v:"Series C"}],
    tags:[{l:"Pre-Raise",t:"tg"},{l:"Dev Tools",t:"tm"}],cat:"Dev Tools",
    hq:"Singapore",founded:2020,employees:"~180",raised:"$116M",
    hiring_num:220,traffic_num:94,
    spark:[45,52,48,55,60,58,65,72,75,80,85,91],
    competitors:["Firebase","PlanetScale","Neon"],
    rounds:[
      {type:"Series C",amount:"$80M",date:"2023",lead:"Felicis Ventures"},
      {type:"Series B",amount:"$30M",date:"2022",lead:"Coatue Management"},
      {type:"Seed",amount:"$6M",date:"2020",lead:"Y Combinator"},
    ],
    signals:[
      {text:"Added 8 enterprise security features to dashboard",time:"4h ago"},
      {text:"VP Engineering from Stripe started this week",time:"2d ago"},
      {text:"Database connections API traffic up 3x",time:"5d ago"},
      {text:"Launched SOC2 compliance documentation page",time:"1w ago"},
    ],
    scores:[{n:"Hiring Signal",s:9.2,c:"sf-g"},{n:"Traffic Growth",s:8.8,c:"sf-g"},{n:"Funding Proximity",s:8.5,c:"sf-g"},{n:"Category Strength",s:7.8,c:"sf-a"},{n:"Team Quality",s:8.6,c:"sf-g"}],
  },
  {
    id:2,name:"Drata",tag:"Compliance automation riding the SOC2 demand surge in the SMB market",
    logo:"DR",m:88,mc:"#1a7a52",
    metrics:[{l:"Hiring Δ",v:"+180%",c:"g"},{l:"Traffic Δ",v:"+120%",c:"g"},{l:"Stage",v:"Series B"}],
    tags:[{l:"Pre-Raise",t:"tg"},{l:"Security",t:"tm"}],cat:"Security",
    hq:"San Diego",founded:2020,employees:"~300",raised:"$328M",
    hiring_num:180,traffic_num:120,
    spark:[40,45,50,55,60,65,68,72,78,82,85,88],
    competitors:["Vanta","Secureframe","Thoropass"],
    rounds:[
      {type:"Series B",amount:"$200M",date:"2022",lead:"ICONIQ Growth"},
      {type:"Series A",amount:"$25M",date:"2021",lead:"GGV Capital"},
      {type:"Seed",amount:"$3.2M",date:"2020",lead:"Cowboy Ventures"},
    ],
    signals:[
      {text:"CEO engaged with 3 Series C fundraising posts",time:"6h ago"},
      {text:"Removed 'Series B' from careers page header",time:"1d ago"},
      {text:"14 new compliance roles posted on LinkedIn",time:"3d ago"},
      {text:"Partnership with AWS Marketplace announced",time:"1w ago"},
    ],
    scores:[{n:"Hiring Signal",s:8.5,c:"sf-g"},{n:"Traffic Growth",s:8.8,c:"sf-g"},{n:"Funding Proximity",s:9.0,c:"sf-g"},{n:"Category Strength",s:8.2,c:"sf-g"},{n:"Team Quality",s:7.8,c:"sf-a"}],
  },
  {
    id:3,name:"Attio",tag:"Modern CRM built for VC funds and fast-moving operator teams globally",
    logo:"AT",m:85,mc:"#1a7a52",
    metrics:[{l:"Hiring Δ",v:"+145%",c:"g"},{l:"Traffic Δ",v:"+88%",c:"g"},{l:"Stage",v:"Series A"}],
    tags:[{l:"Pre-Raise",t:"tg"},{l:"CRM",t:"tm"}],cat:"CRM",
    hq:"London",founded:2019,employees:"~75",raised:"$31M",
    hiring_num:145,traffic_num:88,
    spark:[30,35,38,42,48,55,60,65,70,75,80,85],
    competitors:["Affinity","HubSpot","Folk"],
    rounds:[
      {type:"Series A",amount:"$23.5M",date:"2023",lead:"Redpoint Ventures"},
      {type:"Seed",amount:"$7.5M",date:"2021",lead:"Balderton Capital"},
    ],
    signals:[
      {text:"Added Enterprise pricing tier to website",time:"8h ago"},
      {text:"Hired Head of Revenue from Notion",time:"3d ago"},
      {text:"API docs page views up 240%",time:"5d ago"},
      {text:"Launched Salesforce migration tool",time:"2w ago"},
    ],
    scores:[{n:"Hiring Signal",s:8.0,c:"sf-g"},{n:"Traffic Growth",s:7.8,c:"sf-a"},{n:"Funding Proximity",s:8.5,c:"sf-g"},{n:"Category Strength",s:7.0,c:"sf-a"},{n:"Team Quality",s:8.8,c:"sf-g"}],
  },
  {
    id:4,name:"Causal",tag:"Financial modeling platform replacing Excel for modern finance teams",
    logo:"CA",m:78,mc:"#8a5e0a",
    metrics:[{l:"Hiring Δ",v:"+85%",c:"g"},{l:"Traffic Δ",v:"+40%",c:"g"},{l:"Stage",v:"Series A"}],
    tags:[{l:"Growing",t:"ta"},{l:"Fintech",t:"tm"}],cat:"Fintech",
    hq:"London",founded:2019,employees:"~40",raised:"$20M",
    hiring_num:85,traffic_num:40,
    spark:[35,38,40,42,45,50,55,58,62,68,72,78],
    competitors:["Runway","Mosaic","Pigment"],
    rounds:[
      {type:"Series A",amount:"$16M",date:"2022",lead:"Coatue Management"},
      {type:"Seed",amount:"$4.2M",date:"2020",lead:"Passion Capital"},
    ],
    signals:[
      {text:"CTO confirmed as speaker at CFO Summit 2026",time:"2d ago"},
      {text:"Launched integrations with NetSuite and Xero",time:"5d ago"},
      {text:"4 senior finance hires from Stripe and Brex",time:"1w ago"},
    ],
    scores:[{n:"Hiring Signal",s:7.2,c:"sf-a"},{n:"Traffic Growth",s:6.5,c:"sf-a"},{n:"Funding Proximity",s:7.8,c:"sf-a"},{n:"Category Strength",s:7.5,c:"sf-a"},{n:"Team Quality",s:8.0,c:"sf-g"}],
  },
  {
    id:5,name:"Perplexity",tag:"Answer engine scaling beyond search into enterprise knowledge layers",
    logo:"PX",m:96,mc:"#9b2c2c",
    metrics:[{l:"Hiring Δ",v:"+410%",c:"g"},{l:"Traffic Δ",v:"+320%",c:"g"},{l:"Stage",v:"Series C"}],
    tags:[{l:"Viral",t:"tr"},{l:"AI",t:"tb"}],cat:"AI",
    hq:"San Francisco",founded:2022,employees:"~200",raised:"$500M+",
    hiring_num:410,traffic_num:320,
    spark:[20,30,40,55,65,72,78,82,88,92,94,96],
    competitors:["Google Search","OpenAI","You.com"],
    rounds:[
      {type:"Series C",amount:"$250M",date:"2024",lead:"IVP"},
      {type:"Series B",amount:"$73.6M",date:"2024",lead:"IVP"},
      {type:"Series A",amount:"$25.6M",date:"2023",lead:"NEA"},
      {type:"Seed",amount:"$3.1M",date:"2022",lead:"Elad Gil"},
    ],
    signals:[
      {text:"Posted 12 ML engineering roles in 48 hours",time:"2h ago"},
      {text:"Shipped 6 new API endpoints to developer docs",time:"1d ago"},
      {text:"Enterprise plan page views up 5x this week",time:"3d ago"},
      {text:"Mobile app hit #1 in Productivity on App Store",time:"1w ago"},
    ],
    scores:[{n:"Hiring Signal",s:9.8,c:"sf-g"},{n:"Traffic Growth",s:9.6,c:"sf-g"},{n:"Funding Proximity",s:7.5,c:"sf-a"},{n:"Category Strength",s:9.2,c:"sf-g"},{n:"Team Quality",s:9.4,c:"sf-g"}],
  },
  {
    id:6,name:"Coda",tag:"Doc-database hybrid gaining traction from enterprise Notion migration",
    logo:"CO",m:72,mc:"#8a5e0a",
    metrics:[{l:"Hiring Δ",v:"+62%",c:"g"},{l:"Traffic Δ",v:"+28%",c:"g"},{l:"Stage",v:"Series D"}],
    tags:[{l:"Steady",t:"ta"},{l:"Productivity",t:"tm"}],cat:"Productivity",
    hq:"Mountain View",founded:2014,employees:"~400",raised:"$636M",
    hiring_num:62,traffic_num:28,
    spark:[55,58,55,60,58,62,60,64,65,68,70,72],
    competitors:["Notion","Airtable","Monday.com"],
    rounds:[
      {type:"Series D",amount:"$100M",date:"2021",lead:"General Catalyst"},
      {type:"Series C",amount:"$80M",date:"2019",lead:"IVP"},
      {type:"Series B",amount:"$60M",date:"2018",lead:"Greylock"},
    ],
    signals:[
      {text:"Launched AI doc assistant in beta",time:"3d ago"},
      {text:"Enterprise customer count crossed 2,500",time:"1w ago"},
      {text:"Hired VP of AI from Google DeepMind",time:"2w ago"},
    ],
    scores:[{n:"Hiring Signal",s:6.8,c:"sf-a"},{n:"Traffic Growth",s:5.5,c:"sf-a"},{n:"Funding Proximity",s:6.0,c:"sf-a"},{n:"Category Strength",s:7.2,c:"sf-a"},{n:"Team Quality",s:7.5,c:"sf-a"}],
  },
];

const INVESTORS = [
  {name:"Benchmark",type:"Tier 1 VC · San Francisco",init:"BM",stats:[{l:"Active Deals",v:"3"},{l:"Avg Check",v:"$8M"},{l:"Last Deal",v:"14d"}],focus:[{l:"Dev Tools",t:"tm"},{l:"AI",t:"tm"}],badge:{l:"Actively Deploying",t:"tg"},act:[3,5,4,7,6,8,9,7,8,10,9,8]},
  {name:"a16z Growth",type:"Multi-stage · Menlo Park",init:"A6",stats:[{l:"Active Deals",v:"6"},{l:"Avg Check",v:"$25M"},{l:"Last Deal",v:"3d"}],focus:[{l:"AI",t:"tm"},{l:"Enterprise",t:"tm"}],badge:{l:"High Velocity",t:"tg"},act:[6,8,9,8,10,9,8,10,9,10,9,10]},
  {name:"Slow Ventures",type:"Micro VC · Remote-first",init:"SV",stats:[{l:"Active Deals",v:"1"},{l:"Avg Check",v:"$250K"},{l:"Last Deal",v:"42d"}],focus:[{l:"Consumer",t:"tm"},{l:"DTC",t:"tm"}],badge:{l:"Selective",t:"ta"},act:[7,4,3,2,5,3,2,1,4,2,3,1]},
  {name:"General Catalyst",type:"Multi-stage · Cambridge",init:"GC",stats:[{l:"Active Deals",v:"4"},{l:"Avg Check",v:"$15M"},{l:"Last Deal",v:"8d"}],focus:[{l:"Health",t:"tm"},{l:"Climate",t:"tm"}],badge:{l:"Active",t:"tg"},act:[5,6,7,8,6,7,8,9,7,8,9,8]},
];

const CATS = [
  {icon:"◈",name:"AI Infrastructure",sub:"Model serving, vector DBs, AI ops platforms",count:847,growth:"+124%"},
  {icon:"◇",name:"B2B SaaS",sub:"Enterprise workflow, CRM, vertical software",count:2341,growth:"+38%"},
  {icon:"○",name:"DTC / Consumer",sub:"Direct brands, subscription, CPG plays",count:1204,growth:"+22%"},
  {icon:"△",name:"Cybersecurity",sub:"Identity, compliance, threat intelligence",count:412,growth:"+91%"},
  {icon:"□",name:"Health & Wellness",sub:"Digital health, diagnostics, longevity",count:623,growth:"+67%"},
  {icon:"⬡",name:"Climate Tech",sub:"Energy, carbon markets, grid infrastructure",count:389,growth:"+145%"},
];

const ACTIVITY = [
  {id:1,co:"Perplexity",coId:5,type:"hiring",text:"Posted 12 ML engineering roles in 48 hours",time:"2h ago",severity:"high"},
  {id:2,co:"Supabase",coId:1,type:"traffic",text:"Web traffic surged 94% month-over-month",time:"4h ago",severity:"high"},
  {id:3,co:"Drata",coId:2,type:"funding",text:"CEO engaged with 3 Series C fundraising posts on LinkedIn",time:"6h ago",severity:"medium"},
  {id:4,co:"Attio",coId:3,type:"product",text:"Added Enterprise pricing tier to website — pricing page restructured",time:"8h ago",severity:"medium"},
  {id:5,co:"Benchmark",coId:null,type:"investor",text:"Partner visited Supabase Singapore office (LinkedIn check-in)",time:"12h ago",severity:"low"},
  {id:6,co:"Perplexity",coId:5,type:"product",text:"Shipped 6 new API endpoints to developer documentation",time:"1d ago",severity:"medium"},
  {id:7,co:"Drata",coId:2,type:"signal",text:"Removed 'Series B' from careers page header — raise imminent?",time:"1d ago",severity:"high"},
  {id:8,co:"Causal",coId:4,type:"event",text:"CTO confirmed as keynote speaker at CFO Summit 2026",time:"2d ago",severity:"low"},
];

const ACT_ICONS = {hiring:"⬆",traffic:"◈",funding:"◎",product:"◇",investor:"△",signal:"◆",event:"□"};

const FILTERS = ["All","AI","Dev Tools","Fintech","Security","CRM","Productivity"];
const TABS = ["Signal Feed","Investors","Categories","Watchlist"];
const SORTS = [{k:"momentum",l:"Momentum"},{k:"hiring",l:"Hiring Δ"},{k:"traffic",l:"Traffic Δ"},{k:"name",l:"A → Z"}];

async function fetchBrief(co, onChunk, onDone) {
  const prompt = `You are VentureBrowse's intelligence engine. Write a sharp, opinionated venture brief. Senior analyst tone. Zero filler.

Company: ${co.name} | Category: ${co.cat} | Momentum: ${co.m}/100
Hiring Δ: ${co.metrics[0].v} | Traffic Δ: ${co.metrics[1].v} | Stage: ${co.metrics[2].v}
HQ: ${co.hq} | Founded: ${co.founded} | Team: ${co.employees} | Raised: ${co.raised}
Competitors: ${co.competitors.join(", ")}

Use these exact bold headers:

**SIGNAL SUMMARY**
2-3 sentences on why this company is showing up in signals now.

**STRUCTURAL TAILWIND**
1-2 sentences on the macro force this company is riding.

**DEAL INTELLIGENCE**
Raise timing, check size estimate, likely investors.

**WATCH LIST**
2 specific things to monitor in 30-60 days.

Under 260 words. No marketing language.`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,stream:true,messages:[{role:"user",content:prompt}]})
    });
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    while(true){
      const {done,value} = await reader.read();
      if(done) break;
      buf += dec.decode(value,{stream:true});
      const lines = buf.split("\n"); buf = lines.pop();
      for(const ln of lines){
        if(!ln.startsWith("data: ")) continue;
        const d = ln.slice(6).trim();
        if(d==="[DONE]"){onDone();return;}
        try{const j=JSON.parse(d);if(j.type==="content_block_delta"&&j.delta?.text)onChunk(j.delta.text);}catch{}
      }
    }
    onDone();
  } catch {
    const mock = `**SIGNAL SUMMARY**
${co.name} is generating unusually strong momentum signals — hiring is up ${co.metrics[0].v} and web traffic surged ${co.metrics[1].v} in the trailing 90 days. This pattern typically precedes a funding event by 45-75 days.

**STRUCTURAL TAILWIND**
${co.cat} is experiencing a category-wide acceleration as enterprises consolidate tooling budgets around fewer, more capable platforms. ${co.name}'s positioning in ${co.hq} gives it access to both talent density and a growing customer base.

**DEAL INTELLIGENCE**
Based on hiring patterns and leadership LinkedIn activity, a raise appears likely within 60 days. Expected round: ${co.metrics[2].v === "Series C" ? "Series D" : co.metrics[2].v === "Series B" ? "Series C" : co.metrics[2].v === "Series A" ? "Series B" : "Growth"} at 2-3x current valuation. ${co.competitors[0]} and ${co.competitors[1]} competitive dynamics will influence terms.

**WATCH LIST**
1. Monitor leadership team LinkedIn activity for investor meetings and board member additions in the next 30 days.
2. Track careers page for executive-level hires (CFO, CRO) which typically signal pre-raise operational maturity.`;
    onChunk(mock);
    onDone();
  }
}

/* ───── COMPONENTS ───── */

function Sparkline({data, color="var(--g)", w=80, h=24}){
  if(!data||data.length<2) return null;
  const mn=Math.min(...data),mx=Math.max(...data),r=mx-mn||1;
  const pts=data.map((v,i)=>[(i/(data.length-1))*w, h-((v-mn)/r)*(h-4)-2]);
  const d=pts.map((p,i)=>(i===0?"M":"L")+p[0]+","+p[1]).join(" ");
  const [lx,ly]=pts[pts.length-1];
  return(
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" style={{overflow:"visible"}}>
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lx} cy={ly} r="2.5" fill={color}/>
    </svg>
  );
}

function Tag({l,t}){ return <span className={`tag ${t}`}>{l}</span>; }

function ScoreRow({n,s,c,anim}){
  return(
    <div className="srow">
      <span className="srow-name">{n}</span>
      <div className="srow-r">
        <div className="sbar-bg"><div className={`sbar-fill ${c}`} style={{width:anim?`${s*10}%`:"0%"}}/></div>
        <span className="snum">{s.toFixed(1)}</span>
      </div>
    </div>
  );
}

function ActBars({data}){
  const mx = Math.max(...data);
  return(
    <div className="iact">
      {data.map((v,i)=>{
        const h = Math.max(2,(v/mx)*26);
        const cls = v>=mx*.75?"hi":v>=mx*.4?"md":"";
        return <div key={i} className={`abar ${cls}`} style={{height:h}}/>;
      })}
    </div>
  );
}

function Toast({msg}){
  return <div className="toast">{msg}</div>;
}

function CompanyCard({co, watched, onSelect, onToggleWatch}){
  return(
    <div className="ccard" onClick={()=>onSelect(co)}>
      <div className="ctop">
        <div className="clogo">{co.logo}</div>
        <div style={{display:"flex",alignItems:"start",gap:8}}>
          <button className={`wl-btn${watched?" on":""}`} onClick={e=>{e.stopPropagation();onToggleWatch(co.id);}} title={watched?"Remove from watchlist":"Add to watchlist"}>
            {watched?"♥":"♡"}
          </button>
          <div className="mbadge">
            <Sparkline data={co.spark} color={co.mc} w={48} h={20}/>
            <span className="mnum" style={{color:co.mc}}>{co.m}</span>
            <span className="mlbl">Momentum</span>
          </div>
        </div>
      </div>
      <div className="cname">{co.name}</div>
      <div className="ctag">{co.tag}</div>
      <div className="ctags">{co.tags.map((t,i)=><Tag key={i} l={t.l} t={t.t}/>)}</div>
      <div className="cmetrics">
        {co.metrics.map((m,i)=>(
          <div className="cmet" key={i}>
            <div className="cml">{m.l}</div>
            <div className={`cmv${m.c?" "+m.c:""}`}>{m.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Panel({co, onClose, watched, onToggleWatch}){
  const [ptab,setPtab] = useState("overview");
  const [st,setSt] = useState("idle");
  const [txt,setTxt] = useState("");
  const [anim,setAnim] = useState(false);
  useEffect(()=>{const t=setTimeout(()=>setAnim(true),100);return()=>clearTimeout(t);},[]);
  useEffect(()=>{setPtab("overview");setSt("idle");setTxt("");},[co.id]);

  function gen(){
    setSt("loading");setTxt("");
    fetchBrief(co,chunk=>setTxt(p=>p+chunk),()=>setSt("done"));
  }

  const render = t => {
    const parts = t.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p,i)=>p.startsWith("**")&&p.endsWith("**")?<strong key={i}>{p.slice(2,-2)}</strong>:<span key={i}>{p}</span>);
  };

  return(
    <div className="overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="panel">
        <div className="phdr">
          <div>
            <div className="pco">{co.name}</div>
            <div className="psub">{co.cat} · {co.metrics[2].v} · {co.hq}</div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <button className={`wl-btn${watched?" on":""}`} onClick={()=>onToggleWatch(co.id)}>
              {watched?"♥":"♡"}
            </button>
            <button className="xcl" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="ptabs">
          {[{k:"overview",l:"Overview"},{k:"signals",l:"Signals"},{k:"brief",l:"AI Brief"}].map(t=>(
            <button key={t.k} className={`ptab${ptab===t.k?" on":""}`} onClick={()=>setPtab(t.k)}>{t.l}</button>
          ))}
        </div>

        <div className="pbody">
          {ptab==="overview"&&<>
            <div className="pstl">Key Metrics</div>
            <div className="pmets">
              {co.metrics.map((m,i)=>(
                <div className="pmet" key={i}>
                  <div className="pml">{m.l}</div>
                  <div className={`pmv${m.c?" "+m.c:""}`}>{m.v}</div>
                </div>
              ))}
              <div className="pmet">
                <div className="pml">Momentum</div>
                <div className="pmv" style={{color:co.mc}}>{co.m}</div>
              </div>
            </div>

            <div className="pstl">Company Info</div>
            <div className="info-grid" style={{marginBottom:26}}>
              <div className="info-row"><span className="info-l">Founded</span><span className="info-v">{co.founded}</span></div>
              <div className="info-row"><span className="info-l">HQ</span><span className="info-v">{co.hq}</span></div>
              <div className="info-row"><span className="info-l">Team</span><span className="info-v">{co.employees}</span></div>
              <div className="info-row"><span className="info-l">Total Raised</span><span className="info-v">{co.raised}</span></div>
            </div>

            <div className="pstl" style={{marginBottom:12}}>Signal Scores</div>
            <div style={{marginBottom:26}}>
              {co.scores.map((s,i)=><ScoreRow key={i} n={s.n} s={s.s} c={s.c} anim={anim}/>)}
            </div>

            <div className="pstl">Funding History</div>
            <div className="ftl" style={{marginBottom:26}}>
              {co.rounds.map((r,i)=>(
                <div className="ftl-item" key={i}>
                  <div className={`ftl-dot${i===0?" latest":""}`}/>
                  <div>
                    <div className="ftl-type">{r.type}</div>
                    <div className="ftl-detail">{r.date} · Led by {r.lead}</div>
                  </div>
                  <div className="ftl-amt">{r.amount}</div>
                </div>
              ))}
            </div>

            <div className="pstl">Competitive Landscape</div>
            <div className="comp-list">
              {co.competitors.map((c,i)=>(
                <div className="comp-item" key={i}>
                  <span className="comp-name">{c}</span>
                  <span className="comp-type">Competitor</span>
                </div>
              ))}
            </div>
          </>}

          {ptab==="signals"&&<>
            <div className="pstl">Momentum Trend</div>
            <div className="spark-lg">
              <Sparkline data={co.spark} color={co.mc} w={420} h={80}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10}}>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink4)"}}>12 months ago</span>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink4)"}}>Today</span>
              </div>
            </div>

            <div className="pstl">Recent Signals</div>
            <div style={{marginBottom:26}}>
              {co.signals.map((s,i)=>(
                <div className="sig-item" key={i}>
                  <span className="sig-time">{s.time}</span>
                  <span className="sig-txt">{s.text}</span>
                </div>
              ))}
            </div>

            <div className="pstl" style={{marginBottom:12}}>Signal Scores</div>
            <div>
              {co.scores.map((s,i)=><ScoreRow key={i} n={s.n} s={s.s} c={s.c} anim={anim}/>)}
            </div>
          </>}

          {ptab==="brief"&&<>
            <div className="pstl">AI Intelligence Brief</div>
            <button className="aibtn" onClick={gen} disabled={st==="loading"}>
              {st==="loading"?<><div className="dots"><span/><span/><span/></div>Generating…</>:st==="done"?"↻ Regenerate Brief":"✦ Generate Intelligence Brief"}
            </button>

            {(st==="loading"||st==="done")&&(
              <div className="aiout">
                {st==="loading"&&txt===""
                  ?<div className="aithink"><div className="dots"><span/><span/><span/></div>Analysing signals…</div>
                  :<div className="aitxt">{render(txt)}</div>}
              </div>
            )}

            {st==="idle"&&(
              <div style={{padding:"32px 0",textAlign:"center"}}>
                <div style={{fontSize:24,marginBottom:10,color:"var(--ink4)"}}>✦</div>
                <div style={{fontSize:14,color:"var(--ink3)",fontWeight:300,lineHeight:1.6,maxWidth:300,margin:"0 auto"}}>
                  Generate an AI-powered intelligence brief with signal analysis, deal intelligence, and actionable recommendations.
                </div>
              </div>
            )}
          </>}

          <div style={{marginTop:24,display:"flex",gap:6,flexWrap:"wrap"}}>
            {co.tags.map((t,i)=><Tag key={i} l={t.l} t={t.t}/>)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App(){
  const [tab,setTab] = useState("Signal Feed");
  const [filter,setFilter] = useState("All");
  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("momentum");
  const [sel,setSel] = useState(null);
  const [anim,setAnim] = useState(false);
  const [showAllActivity,setShowAllActivity] = useState(false);
  const [toast,setToast] = useState(null);

  const [watchlist,setWatchlist] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("vb_watchlist")||"[]");}catch{return [];}
  });

  useEffect(()=>{const t=setTimeout(()=>setAnim(true),200);return()=>clearTimeout(t);},[]);

  function toggleWatch(id){
    setWatchlist(prev=>{
      const has=prev.includes(id);
      const next=has?prev.filter(x=>x!==id):[...prev,id];
      localStorage.setItem("vb_watchlist",JSON.stringify(next));
      const co=COS.find(c=>c.id===id);
      showToast(has?`${co?.name} removed from watchlist`:`${co?.name} added to watchlist`);
      return next;
    });
  }

  function showToast(msg){
    setToast(msg);
    setTimeout(()=>setToast(null),2200);
  }

  const shown = COS.filter(c=>{
    if(filter!=="All"&&c.cat!==filter) return false;
    if(search&&!c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>{
    if(sort==="momentum") return b.m-a.m;
    if(sort==="hiring") return b.hiring_num-a.hiring_num;
    if(sort==="traffic") return b.traffic_num-a.traffic_num;
    if(sort==="name") return a.name.localeCompare(b.name);
    return 0;
  });

  const watchedCos = COS.filter(c=>watchlist.includes(c.id));
  const visibleActivity = showAllActivity ? ACTIVITY : ACTIVITY.slice(0,4);

  const today = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});

  return(
    <>
      <style>{STYLES}</style>

      {/* Ticker */}
      <div className="ticker">
        <div className="t-track">
          {[...TICKER_DATA,...TICKER_DATA].map((t,i)=>(
            <div className="t-item" key={i}>
              <span className="t-name">{t.name}</span>
              <span style={{color:"rgba(255,255,255,.2)"}}>·</span>
              <span>{t.v}</span>
              <span className={t.up?"t-up":"t-dn"}>{t.d}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav>
        <div className="logo"><img src="/logo.svg" alt="VentureBrowse" style={{height:18}}/></div>
        <div className="nav-tabs">
          {TABS.map(t=>(
            <button key={t} className={`ntab${tab===t?" on":""}`} onClick={()=>setTab(t)}>
              {t}
              {t==="Watchlist"&&watchlist.length>0&&(
                <span style={{marginLeft:5,background:"var(--ink)",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:11,fontWeight:600,fontFamily:"var(--mono)"}}>{watchlist.length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="nav-r">
          <button className="ghost">Sign in</button>
          <button className="pill">Get access →</button>
        </div>
      </nav>

      <div className="wrap">

        {tab==="Signal Feed"&&<>
          {/* Signal of the Day */}
          <div className="sotd">
            <div className="eyebrow">Signal of the Day — {today}</div>
            <div className="sotd-grid">
              <div>
                <h1 className="sotd-title">{SOTD.name} — <em>{SOTD.italic}</em> signal</h1>
                <div className="sotd-meta">{SOTD.tags.map((t,i)=><Tag key={i} l={t.l} t={t.t}/>)}</div>
                <p className="sotd-desc">{SOTD.desc}</p>
                <div className="sotd-sigs">
                  {SOTD.sigs.map((s,i)=>(
                    <div className="sig" key={i}>
                      <span className="sig-l">{s.l}</span>
                      <span className={`sig-v ${s.c}`}>{s.v}</span>
                    </div>
                  ))}
                </div>
                <div className="sotd-acts">
                  <button className="pill" onClick={()=>setSel(COS[0])}>View Intelligence Brief →</button>
                  <button className="pill-o" onClick={()=>toggleWatch(COS[0].id)}>
                    {watchlist.includes(COS[0].id)?"✓ Saved":"Save to Watchlist"}
                  </button>
                </div>
              </div>
              <div>
                <div className="scard">
                  <div className="scard-ttl">Signal Breakdown</div>
                  {SOTD.scores.map((s,i)=><ScoreRow key={i} n={s.n} s={s.s} c={s.c} anim={anim}/>)}
                  <button className="dive" onClick={()=>setSel(COS[0])}>✦ Generate AI Brief</button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="act-section">
            <div className="act-hdr">
              <div className="act-title"><span className="live-dot"/>Latest Signals</div>
              <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink4)"}}>Updated 12 min ago</span>
            </div>
            <div className="act-list">
              {visibleActivity.map(a=>(
                <div className="act-item" key={a.id} onClick={()=>{const c=COS.find(x=>x.id===a.coId);if(c)setSel(c);}}>
                  <div className={`act-sev ${a.severity}`}/>
                  <div className={`act-ico ${a.type}`}>{ACT_ICONS[a.type]||"◆"}</div>
                  <div className="act-body">
                    <span className="act-co">{a.co}</span>
                    <span className="act-txt">{a.text}</span>
                  </div>
                  <span className="act-time">{a.time}</span>
                </div>
              ))}
              {!showAllActivity&&ACTIVITY.length>4&&(
                <button className="act-more" onClick={()=>setShowAllActivity(true)}>
                  Show {ACTIVITY.length-4} more signals ↓
                </button>
              )}
              {showAllActivity&&(
                <button className="act-more" onClick={()=>setShowAllActivity(false)}>
                  Show less ↑
                </button>
              )}
            </div>
          </div>

          {/* Feed */}
          <div className="feed">
            <div className="feed-hdr">
              <h2 className="sec-title">Live Signal Feed</h2>
              <div className="srch">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#aeada5" strokeWidth="1.4"/><path d="M9.5 9.5l3 3" stroke="#aeada5" strokeWidth="1.4" strokeLinecap="round"/></svg>
                <input placeholder="Search companies…" value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
            </div>
            <div className="filters">
              {FILTERS.map(f=><button key={f} className={`fchip${filter===f?" on":""}`} onClick={()=>setFilter(f)}>{f}</button>)}
              <div className="sort-sep"/>
              {SORTS.map(s=><button key={s.k} className={`sbtn${sort===s.k?" on":""}`} onClick={()=>setSort(s.k)}>{s.l}</button>)}
            </div>
            <div className="cgrid">
              {shown.map(co=>(
                <CompanyCard key={co.id} co={co} watched={watchlist.includes(co.id)} onSelect={setSel} onToggleWatch={toggleWatch}/>
              ))}
            </div>
            {shown.length===0&&(
              <div style={{padding:"60px 0",textAlign:"center",border:"1px solid var(--bd)",borderRadius:14,marginTop:-1}}>
                <div style={{fontSize:22,color:"var(--ink4)",marginBottom:10}}>◇</div>
                <div style={{fontSize:15,color:"var(--ink3)",fontWeight:300}}>No companies match your filters.</div>
                <button className="fchip" style={{marginTop:14}} onClick={()=>{setFilter("All");setSearch("");}}>Clear filters</button>
              </div>
            )}
          </div>
        </>}

        {tab==="Investors"&&(
          <div className="feed">
            <div className="feed-hdr">
              <div>
                <h2 className="sec-title">Investor Intelligence</h2>
                <p style={{color:"var(--ink3)",fontSize:14,marginTop:6,fontWeight:300}}>Who is actually deploying capital right now — not who says they are.</p>
              </div>
              <button className="pill-o">I'm a founder →</button>
            </div>
            <div className="igrid">
              {INVESTORS.map((inv,i)=>(
                <div className="icard" key={i}>
                  <div className="itop">
                    <div className="iav">{inv.init}</div>
                    <div style={{flex:1}}>
                      <div className="iname">{inv.name}</div>
                      <div className="itype">{inv.type}</div>
                    </div>
                    <Tag l={inv.badge.l} t={inv.badge.t}/>
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {inv.focus.map((f,j)=><Tag key={j} l={f.l} t={f.t}/>)}
                  </div>
                  <div className="istats">
                    {inv.stats.map((s,j)=>(
                      <div key={j}><div className="isl">{s.l}</div><div className="isv">{s.v}</div></div>
                    ))}
                  </div>
                  <ActBars data={inv.act}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="Categories"&&(
          <div className="feed">
            <div className="feed-hdr">
              <div>
                <h2 className="sec-title">Category Browse</h2>
                <p style={{color:"var(--ink3)",fontSize:14,marginTop:6,fontWeight:300}}>Map any vertical in minutes. Data updated weekly.</p>
              </div>
            </div>
            <div className="kgrid">
              {CATS.map((c,i)=>(
                <div className="kcard" key={i}>
                  <div className="kicon">{c.icon}</div>
                  <div className="kname">{c.name}</div>
                  <div className="ksub">{c.sub}</div>
                  <div className="kstats">
                    <div><div className="ksv">{c.count.toLocaleString()}</div><div className="ksl">Companies</div></div>
                    <div><div className="ksv kgrow">{c.growth}</div><div className="ksl">YoY growth</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==="Watchlist"&&(
          <div className="feed">
            <div className="feed-hdr">
              <div>
                <h2 className="sec-title">Watchlist</h2>
                {watchedCos.length>0&&<p style={{color:"var(--ink3)",fontSize:14,marginTop:6,fontWeight:300}}>Tracking {watchedCos.length} {watchedCos.length===1?"company":"companies"} · Signals checked every 15 min</p>}
              </div>
            </div>
            {watchedCos.length>0?(
              <div className="wl-grid">
                {watchedCos.map(co=>(
                  <div className="wl-card" key={co.id} onClick={()=>setSel(co)}>
                    <div className="wl-card-top">
                      <div className="clogo">{co.logo}</div>
                      <div>
                        <div className="cname" style={{marginBottom:2}}>{co.name}</div>
                        <div style={{fontSize:12,color:"var(--ink3)",fontWeight:300}}>{co.cat} · {co.hq}</div>
                      </div>
                      <div className="wl-card-r">
                        <Sparkline data={co.spark} color={co.mc} w={56} h={22}/>
                        <span className="mnum" style={{color:co.mc,fontSize:22}}>{co.m}</span>
                        <button className="wl-remove" onClick={e=>{e.stopPropagation();toggleWatch(co.id);}}>Remove</button>
                      </div>
                    </div>
                    <div className="wl-mets">
                      {co.metrics.map((m,i)=>(
                        <div key={i}>
                          <div className="wl-met-l">{m.l}</div>
                          <div className={`wl-met-v${m.c?" "+m.c:""}`}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                    {co.signals.length>0&&(
                      <div style={{fontSize:12,color:"var(--ink3)",fontWeight:300,borderTop:"1px solid var(--bd)",paddingTop:10}}>
                        <span style={{fontWeight:500,color:"var(--ink2)"}}>Latest:</span> {co.signals[0].text}
                        <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink4)",marginLeft:8}}>{co.signals[0].time}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ):(
              <div style={{padding:"80px 0",textAlign:"center",borderRadius:14,border:"1px solid var(--bd)"}}>
                <div style={{fontSize:28,marginBottom:14,color:"var(--ink4)"}}>◇</div>
                <div style={{fontFamily:"var(--serif)",fontSize:22,color:"var(--ink2)",marginBottom:8}}>Your watchlist is empty</div>
                <div style={{fontSize:14,color:"var(--ink3)",fontWeight:300}}>Save companies from the feed to track their signals here.</div>
                <button className="pill" style={{marginTop:22}} onClick={()=>setTab("Signal Feed")}>Browse the feed →</button>
              </div>
            )}
          </div>
        )}

        <div className="hr"/>

        {/* Upgrade */}
        <div className="upgr">
          <div>
            <h3>Private market intelligence,<br/><em style={{fontStyle:"italic"}}>finally</em> accessible.</h3>
            <p>Pre-raise signals, real investor deployment data, and AI-generated briefs — for $149/mo instead of $30,000/year.</p>
          </div>
          <div className="upgr-acts">
            <button className="bwo">See pricing</button>
            <button className="bw">Start free →</button>
          </div>
        </div>
      </div>

      {sel&&<Panel co={sel} onClose={()=>setSel(null)} watched={watchlist.includes(sel.id)} onToggleWatch={toggleWatch}/>}
      {toast&&<Toast msg={toast}/>}
    </>
  );
}
