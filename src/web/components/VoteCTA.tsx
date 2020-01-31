const VoteCTA = () => {
  const randomIntervals = [...new Array(8)].map(() => ({
    style: { animationDelay: `-${Math.floor(Math.random() * 10000)}ms` }
  }));

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  return (
    <div className="vote-cta">
      <img
        {...randomIntervals[0]}
        src="https://cdn.discordapp.com/embed/avatars/1.png"
      />
      <img
        {...randomIntervals[1]}
        src="https://cdn.discordapp.com/embed/avatars/2.png"
      />
      <img
        {...randomIntervals[2]}
        src="https://cdn.discordapp.com/embed/avatars/3.png"
      />
      <i {...randomIntervals[3]} className="fal fa-trophy" />
      <i {...randomIntervals[4]} className="fal fa-square" />
      <i {...randomIntervals[5]} className="fal fa-star" />
      <i {...randomIntervals[6]} className="fal fa-times" />
      <i {...randomIntervals[7]} className="fal fa-circle" />
      <h1 className="white text-right mb-0">
        <span className="outline outline-1">VOTE FOR YOUR</span>
        <br />
        FAVOURITE <span className="outline outline-1">OF</span>{" "}
        {monthNames[new Date().getMonth()]}
      </h1>
    </div>
  );
};

export default VoteCTA;
