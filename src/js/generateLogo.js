// Code adapted from https://medium.com/@francoisromain/smooth-a-svg-path-with-cubic-bezier-curves-e37b49d46c74

const line = (pointA, pointB) => {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];

  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

const controlPoint = (lineCalc, smooth) => (
  current,
  previous,
  next,
  reverse
) => {
  const p = previous ? previous : current;
  const n = next ? next : current;
  const l = lineCalc(p, n);
  const angle = l.angle + (reverse ? Math.PI : 0);
  const length = l.length * smooth;
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;

  return [x, y];
};

const bezierCommand = controlPointCalc => (point, i, a) => {
  const [cpsX, cpsY] = controlPointCalc(a[i - 1], a[i - 2], point);
  const [cpeX, cpeY] = controlPointCalc(point, a[i - 1], a[i + 1], true);

  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
};

const svgPath = (points, command) =>
  points.reduce(
    (acc, point, i, a) =>
      i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${command(point, i, a)}`,
    ''
  );

const smoothing = 0.2;

const controlPointCalc = controlPoint(line, smoothing);
const bezierCommandCalc = bezierCommand(controlPointCalc);

const points = [
  [119, 77],
  [122, 83],
  [132, 85],
  [142, 84],
  [145, 83],
  [150, 79],
  [152, 74],
  [151, 69],
  [147, 66],
  [142, 65],
  [136, 66],
  [132, 70],
  [132, 75],
  [136, 77],
  [139, 76]
];

const accentColor = '#f78cb0';

// Close up on treble: viewBox="100 75 70 20" width="600" height="700"
const svgHTML = `
  <svg id="logo" viewBox="98 45 283 76">
    <text
      x="100"
      y="110"
      font-family="Rouge Script"
      font-size="96"
      fill="${accentColor}"
    >
      I
    </text>
    <text
      x="159"
      y="110"
      font-family="Rouge Script"
      font-size="96"
    >
      nterlude
    </text>
    <path
      stroke="${accentColor}"
      stroke-width="3"
      stroke-linecap="round"
      fill="none"
      d="${svgPath(points, bezierCommandCalc)}"
    />
  </svg>
`;

console.log(svgHTML);
