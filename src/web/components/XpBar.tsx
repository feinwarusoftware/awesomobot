import getLevelData from "../utils/getLevelData";

const XpBar = ({ xp }: { xp: number }) => {
  const { level, progress } = getLevelData(xp);
  const percentRemaining = Math.ceil(100 - progress);
  const percentIsInside = progress > 10 ? "inside" : "outside";
  return (
    <div className="xp-bar">
      <div className="text">
        <p>Level {level}</p>
        <p>
          {percentRemaining}% left until level {level + 1}
        </p>
      </div>
      <div className="outer">
        <div className="inner" style={{ width: `${progress}%` }}>
          <p className={`value ${percentIsInside}`}>
            {`${Math.floor(progress)}%`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default XpBar;
