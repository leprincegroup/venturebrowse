export default function ActBars({data}){
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
