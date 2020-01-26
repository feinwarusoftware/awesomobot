export default function FeaturedScript({
  id,
  name,
  author,
  image,
  usage,
  likes,
  servers,
  verifiedScript,
  verifiedAuthor,
  addFn,
}) {
  return (
  <div className="featured-script" style={{ backgroundImage: `url(${image})` }}>
    <div className="gradient" />
    <div className="fill" />
    <div className="content">
      <h4>{name}</h4>
      <h5>by {author} {verifiedAuthor && <sup><i className="fas fa-check-circle" /></sup>}</h5>
      <div className="overflow-content">
        <code>{usage}</code>
        <button className="btn-outline green" onClick={() => addFn()}>Add this script</button>
        <button className="btn-outline">View details</button>

        <div className="likes-servers">
          <p><i className="fas fa-heart" /> {likes} likes</p>
          <p><i className="fas fa-server" /> {servers} servers</p>
        </div>
      </div>
    </div>
  </div>
  );
}
