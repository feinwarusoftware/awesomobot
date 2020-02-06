const Trophy = ({ name }) => {

  const trophies = {
    "feinwaru-dev": {
      text: "Feinwaru Developer",
      color: "#ff594f",
      icon: require("../static/img/feinwaru_f.svg")
    },
    "translator": {
      text: "Translator",
      color: "#4844C1",
      icon: <i className="fas fa-language" style={{color: "#4844C1"}} />
    }
  }

  const trophy = trophies[name];

  if (!trophy) return null;

  return (
    <div className="trophy" style={{ borderColor: trophy.color }}>
<div className="icon">{trophy.icon}</div>
  <p style={{ color: trophy.color }}>{trophy.text}</p>
    </div>
  );
};

export default Trophy;
