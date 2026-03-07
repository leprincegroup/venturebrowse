import { useState, useEffect, useMemo } from "react";
import "./styles/global.css";
import { ACT_ICONS, FILTERS, TABS, SORTS } from "./lib/constants";
import { useAuth } from "./contexts/AuthContext";
import useCompanies from "./hooks/useCompanies";
import useSignals from "./hooks/useSignals";
import useInvestors from "./hooks/useInvestors";
import useCategories from "./hooks/useCategories";
import useTicker from "./hooks/useTicker";
import useSOTD from "./hooks/useSOTD";
import useProfile from "./hooks/useProfile";
import Sparkline from "./components/common/Sparkline";
import Tag from "./components/common/Tag";
import ScoreRow from "./components/common/ScoreRow";
import Toast from "./components/common/Toast";
import ActBars from "./components/investors/ActBars";
import CompanyCard from "./components/feed/CompanyCard";
import CompanyPanel from "./components/panel/CompanyPanel";
import AuthModal from "./components/auth/AuthModal";
import UserMenu from "./components/auth/UserMenu";
import SubmitModal from "./components/submit/SubmitModal";
import AdminQueue from "./components/admin/AdminQueue";

export default function App(){
  const { user } = useAuth();
  const [tab,setTab] = useState("Signal Feed");
  const [filter,setFilter] = useState("All");
  const [search,setSearch] = useState("");
  const [sort,setSort] = useState("momentum");
  const [sel,setSel] = useState(null);
  const [anim,setAnim] = useState(false);
  const [showAllActivity,setShowAllActivity] = useState(false);
  const [toast,setToast] = useState(null);
  const [showAuth,setShowAuth] = useState(false);
  const [showSubmit,setShowSubmit] = useState(false);

  // Supabase data hooks
  const { data: COS, loading: cosLoading } = useCompanies();
  const { data: ACTIVITY } = useSignals();
  const { data: INVESTORS } = useInvestors();
  const { data: CATS } = useCategories();
  const { data: TICKER_DATA } = useTicker();
  const { data: SOTD } = useSOTD();
  const { data: profile } = useProfile();
  const isAdmin = profile?.role === "admin";

  // Safe defaults while loading
  const companies = COS || [];
  const activity = ACTIVITY || [];
  const investors = INVESTORS || [];
  const cats = CATS || [];
  const tickerData = TICKER_DATA || [];
  const sotd = SOTD || null;

  const [watchlist,setWatchlist] = useState(()=>{
    try{return JSON.parse(localStorage.getItem("vb_watchlist")||"[]");}catch{return [];}
  });

  useEffect(()=>{const t=setTimeout(()=>setAnim(true),200);return()=>clearTimeout(t);},[]);

  function toggleWatch(id){
    setWatchlist(prev=>{
      const has=prev.includes(id);
      const next=has?prev.filter(x=>x!==id):[...prev,id];
      localStorage.setItem("vb_watchlist",JSON.stringify(next));
      const co=companies.find(c=>c.id===id);
      showToastMsg(has?`${co?.name} removed from watchlist`:`${co?.name} added to watchlist`);
      return next;
    });
  }

  function showToastMsg(msg){
    setToast(msg);
    setTimeout(()=>setToast(null),2200);
  }

  const shown = useMemo(() => {
    return companies.filter(c=>{
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
  }, [companies, filter, search, sort]);

  const watchedCos = useMemo(() => companies.filter(c=>watchlist.includes(c.id)), [companies, watchlist]);
  const visibleActivity = showAllActivity ? activity : activity.slice(0,4);

  const today = new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});

  // Keep selected company synced with fresh data
  useEffect(() => {
    if (sel && companies.length) {
      const fresh = companies.find(c => c.id === sel.id);
      if (fresh && fresh !== sel) setSel(fresh);
    }
  }, [companies]);

  return(
    <>
      {/* Ticker */}
      <div className="ticker">
        <div className="t-track">
          {[...tickerData,...tickerData].map((t,i)=>(
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
          {[...TABS, ...(isAdmin ? ["Admin"] : [])].map(t=>(
            <button key={t} className={`ntab${tab===t?" on":""}`} onClick={()=>setTab(t)}>
              {t}
              {t==="Watchlist"&&watchlist.length>0&&(
                <span style={{marginLeft:5,background:"var(--ink)",color:"#fff",borderRadius:100,padding:"1px 7px",fontSize:11,fontWeight:600,fontFamily:"var(--mono)"}}>{watchlist.length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="nav-r">
          {user ? (
            <>
              <button className="ghost" onClick={()=>setShowSubmit(true)}>Submit startup</button>
              <UserMenu/>
            </>
          ) : (
            <>
              <button className="ghost" onClick={()=>setShowAuth(true)}>Sign in</button>
              <button className="pill" onClick={()=>setShowAuth(true)}>Get access →</button>
            </>
          )}
        </div>
      </nav>

      <div className="wrap">

        {tab==="Signal Feed"&&<>
          {/* Signal of the Day */}
          {sotd&&(
            <div className="sotd">
              <div className="eyebrow">Signal of the Day — {today}</div>
              <div className="sotd-grid">
                <div>
                  <h1 className="sotd-title">{sotd.name} — <em>{sotd.italic}</em> signal</h1>
                  <div className="sotd-meta">{sotd.tags.map((t,i)=><Tag key={i} l={t.l} t={t.t}/>)}</div>
                  <p className="sotd-desc">{sotd.desc}</p>
                  <div className="sotd-sigs">
                    {sotd.sigs.map((s,i)=>(
                      <div className="sig" key={i}>
                        <span className="sig-l">{s.l}</span>
                        <span className={`sig-v ${s.c}`}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sotd-acts">
                    <button className="pill" onClick={()=>{if(companies[0])setSel(companies[0]);}}>View Intelligence Brief →</button>
                    <button className="pill-o" onClick={()=>{if(companies[0])toggleWatch(companies[0].id);}}>
                      {companies[0]&&watchlist.includes(companies[0].id)?"✓ Saved":"Save to Watchlist"}
                    </button>
                  </div>
                </div>
                <div>
                  <div className="scard">
                    <div className="scard-ttl">Signal Breakdown</div>
                    {sotd.scores.map((s,i)=><ScoreRow key={i} n={s.n} s={s.s} c={s.c} anim={anim}/>)}
                    <button className="dive" onClick={()=>{if(companies[0])setSel(companies[0]);}}>✦ Generate AI Brief</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Activity Feed */}
          <div className="act-section">
            <div className="act-hdr">
              <div className="act-title"><span className="live-dot"/>Latest Signals</div>
              <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink4)"}}>Updated 12 min ago</span>
            </div>
            <div className="act-list">
              {visibleActivity.map(a=>(
                <div className="act-item" key={a.id} onClick={()=>{const c=companies.find(x=>x.id===a.coId);if(c)setSel(c);}}>
                  <div className={`act-sev ${a.severity}`}/>
                  <div className={`act-ico ${a.type}`}>{ACT_ICONS[a.type]||"◆"}</div>
                  <div className="act-body">
                    <span className="act-co">{a.co}</span>
                    <span className="act-txt">{a.text}</span>
                  </div>
                  <span className="act-time">{a.time}</span>
                </div>
              ))}
              {!showAllActivity&&activity.length>4&&(
                <button className="act-more" onClick={()=>setShowAllActivity(true)}>
                  Show {activity.length-4} more signals ↓
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
            {cosLoading ? (
              <div style={{padding:"60px 0",textAlign:"center"}}>
                <div style={{fontSize:14,color:"var(--ink3)",fontWeight:300}}>Loading companies…</div>
              </div>
            ) : (
              <div className="cgrid">
                {shown.map(co=>(
                  <CompanyCard key={co.id} co={co} watched={watchlist.includes(co.id)} onSelect={setSel} onToggleWatch={toggleWatch}/>
                ))}
              </div>
            )}
            {!cosLoading&&shown.length===0&&(
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
              <button className="pill-o" onClick={()=>user?setShowSubmit(true):setShowAuth(true)}>I'm a founder →</button>
            </div>
            <div className="igrid">
              {investors.map((inv,i)=>(
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
              {cats.map((c,i)=>(
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

        {tab==="Admin"&&isAdmin&&<AdminQueue/>}

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

      {sel&&<CompanyPanel co={sel} onClose={()=>setSel(null)} watched={watchlist.includes(sel.id)} onToggleWatch={toggleWatch}/>}
      {showAuth&&<AuthModal onClose={()=>setShowAuth(false)}/>}
      {showSubmit&&<SubmitModal onClose={()=>setShowSubmit(false)} onNeedAuth={()=>{setShowSubmit(false);setShowAuth(true);}}/>}
      {toast&&<Toast msg={toast}/>}
    </>
  );
}
