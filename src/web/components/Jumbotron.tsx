export default function Jumbotron({
  image,
  children = null,
  overlap = 0,
  gradient = true,
  height = 1082.129,
  blur = false
}) {
  return (
    <div
      className="jumbotron-container"
      style={{ height: `${height}px`, marginBottom: `-${overlap}px` }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        preserveAspectRatio="xMidYMax slice"
        width="1920"
        height={height}
        viewBox="0 0 1920 1082.129"
        className="jumbotron-image"
      >
        <defs>
          <pattern id="a" width="1" height="1" viewBox="0 0 1920 1082.129">
            {blur && (
              <filter id="svgFilter" width="100%" height="100%" x="-0%" y="-0%">
                <feGaussianBlur
                  id="svgGaussBlur"
                  in="SourceGraphic"
                  stdDeviation={8}
                />
                <feComponentTransfer>
                  <feFuncA type="discrete" tableValues="1 1" />
                </feComponentTransfer>
              </filter>
            )}
            <image
              preserveAspectRatio="xMidYMin slice"
              width="100%"
              height="100%"
              xlinkHref={image}
              {...blur && {filter: "url(#svgFilter)"}}
            ></image>
          </pattern>
        </defs>
        <path fill="url(#a)" d="M0 0h1920v1082.129L0 877.653z"></path>
        {gradient && (
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
            <path fill="url(#b)" d="M0 0h1920v1082.129L0 877.653z"></path>
          </svg>
        )}
      </svg>
      {children}
    </div>
  );
}
