const SOURCE_ICONS = {
  reddit:    "◈",
  tiktok:    "◆",
  google:    "○",
  instagram: "△",
  amazon:    "⬡",
};

const SOURCE_LABELS = {
  reddit:    "Reddit",
  tiktok:    "TikTok",
  google:    "Google Trends",
  instagram: "Instagram",
  amazon:    "Amazon",
};

const SENTIMENT_CLASS = {
  positive: "sv-g",
  neutral:  "sv-a",
  negative: "sv-r",
};

export default function TrendCard({ trend }) {
  const icon     = SOURCE_ICONS[trend.source]  || "◆";
  const srcLabel = SOURCE_LABELS[trend.source] || trend.source;
  const sentCls  = SENTIMENT_CLASS[trend.sentiment] || "sv-a";

  const growthColor = trend.growth_rate >= 150
    ? "#9b2c2c"
    : trend.growth_rate >= 80
    ? "#1a7a52"
    : "#8a5e0a";

  return (
    <div className="tcard">
      <div className="tcard-top">
        <div className="tcard-meta">
          <span className="tcard-src">{icon} {srcLabel}</span>
          {trend.category && <span className="fchip" style={{fontSize:10,padding:"2px 8px"}}>{trend.category}</span>}
          {trend.is_white_space && (
            <span className="tcard-ws">◇ White Space</span>
          )}
        </div>
        <div className="tcard-score">
          <span style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink4)"}}>Score</span>
          <span style={{fontFamily:"var(--mono)",fontSize:14,fontWeight:700,color:"var(--ink)"}}>{trend.trend_score}</span>
        </div>
      </div>

      <div className="tcard-keyword">{trend.keyword}</div>

      <div className="tcard-stats">
        <div className="tcard-stat">
          <div className="cml">Growth</div>
          <div className="cmv g" style={{color:growthColor,fontWeight:700}}>+{trend.growth_rate}%</div>
        </div>
        {trend.posts_count > 0 && (
          <div className="tcard-stat">
            <div className="cml">Posts</div>
            <div className="cmv">{trend.posts_count >= 1000 ? `${(trend.posts_count/1000).toFixed(0)}K` : trend.posts_count}</div>
          </div>
        )}
        {trend.engagement > 0 && (
          <div className="tcard-stat">
            <div className="cml">Engagement</div>
            <div className="cmv">
              {trend.engagement >= 1000000
                ? `${(trend.engagement/1000000).toFixed(1)}M`
                : trend.engagement >= 1000
                ? `${(trend.engagement/1000).toFixed(0)}K`
                : trend.engagement}
            </div>
          </div>
        )}
        <div className="tcard-stat">
          <div className="cml">Sentiment</div>
          <div className={`cmv ${sentCls}`} style={{textTransform:"capitalize"}}>{trend.sentiment}</div>
        </div>
      </div>

      {trend.summary && (
        <p className="tcard-summary">{trend.summary}</p>
      )}
    </div>
  );
}
