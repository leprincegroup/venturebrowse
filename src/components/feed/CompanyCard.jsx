import Sparkline from "../common/Sparkline";
import Tag from "../common/Tag";

export default function CompanyCard({co, watched, onSelect, onToggleWatch}){
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
