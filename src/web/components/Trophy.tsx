const Trophy = ({ color, text, children }) => {
  return (
    <div className="trophy" style={{ borderColor: color }}>
      <div className="icon">{children}</div>
      <p style={{ color }}>{text}</p>
    </div>
  );
};

export default Trophy;
