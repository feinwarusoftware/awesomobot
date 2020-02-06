import Router from "next/router";
import Link from "next/link";

export default function Script({
  id,
  name,
  author,
  authorId,
  image,
  likes,
  servers,
  verifiedScript,
  verifiedAuthor
}) {
  return (
    <div className="script" style={{ backgroundImage: `url(${image})` }}>
      <div className="gradient" />
      <div className="fill" />
      <div className="content">
        <h4>{name}</h4>
        <h5>
          by <Link href={authorId === "feinwaru-devs" ? "https://github.com/feinwarusoftware" : `/dashboard/profile/${authorId}`}>{author}</Link>{" "}
          {verifiedAuthor && (
            <sup>
              <i className="fas fa-check-circle" />
            </sup>
          )}
        </h5>
        <div className="overflow-content">
          <div className="likes-servers">
            <p>
              <i className="fas fa-heart" /> {likes} likes
            </p>
            <p>
              <i className="fas fa-server" /> {servers} servers
            </p>
          </div>
          <button
            className="btn-outline pink"
            onClick={() => console.log("lol")}
          >
            Like this script
          </button>
          <button className="btn-outline" onClick={() => Router.push("/dashboard/script/[id]", `/dashboard/script/${id}`).then(() => window.scrollTo(0, 0))}>View details</button>
        </div>
      </div>
    </div>
  );
}
