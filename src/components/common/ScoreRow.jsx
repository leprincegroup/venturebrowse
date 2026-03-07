export default function ScoreRow({n,s,c,anim}){
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
