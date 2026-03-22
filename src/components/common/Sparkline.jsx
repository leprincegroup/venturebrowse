const RH_GREEN = "#00C805";
const RH_RED = "#FF5000";

export default function Sparkline({data, color, w=80, h=24}){
  if(!data||data.length<2) return null;
  const mn=Math.min(...data),mx=Math.max(...data),r=mx-mn||1;
  const pts=data.map((v,i)=>[(i/(data.length-1))*w, h-((v-mn)/r)*(h-4)-2]);
  const d=pts.map((p,i)=>(i===0?"M":"L")+p[0]+","+p[1]).join(" ");
  const [lx,ly]=pts[pts.length-1];
  const c = color === "var(--g)" ? RH_GREEN : color === "var(--r)" ? RH_RED : color || (data[data.length-1] >= data[0] ? RH_GREEN : RH_RED);
  return(
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" style={{overflow:"visible"}}>
      <path d={d} fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={lx} cy={ly} r="2.5" fill={c}/>
    </svg>
  );
}
