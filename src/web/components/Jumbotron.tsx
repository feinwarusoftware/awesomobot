export default function Jumbotron({ image, children = null }) {
  return (
    <div className="jumbotron-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="1920"
        height="1082.129"
        viewBox="0 0 1920 1082.129"
        className="jumbotron-image"
      >
        <defs>
          <pattern id="a" width="1" height="1" viewBox="0 0 1920 1082.129">
            <image
              preserveAspectRatio="xMidYMid slice"
              width="100%"
              xlinkHref={image}
            ></image>
          </pattern>
        </defs>
        <path
          fill="url(#a)"
          d="M0 0h1920v1082.129L0 877.653z"
        ></path>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1920"
          height="1082.129"
          viewBox="0 0 1920 1082.129"
          className="jumbotron-gradient"
        >
          <defs>
            <linearGradient
              id="b"
              x1="0.5"
              x2="0.5"
              y2="1"
              gradientUnits="objectBoundingBox"
            >
              <stop offset="0" stopColor="#f26d85" stopOpacity="0"></stop>
              <stop offset="1" stopColor="#a13045"></stop>
            </linearGradient>
          </defs>
          <path
            fill="url(#b)"
            d="M0 0h1920v1082.129L0 877.653z"
          ></path>
        </svg>
      </svg>
      {children}
    </div>
  );
}
