import { useState, useEffect } from "react";
import { fetchBrief } from "../../lib/fetchBrief";
import Sparkline from "../common/Sparkline";
import ScoreRow from "../common/ScoreRow";
import Tag from "../common/Tag";

export default function CompanyPanel({co, onClose, watched, onToggleWatch}){
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
