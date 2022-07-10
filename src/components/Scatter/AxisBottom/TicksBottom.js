const TicksLeft = ({ ticks, height, color }) => {
  return ticks.map((item) => {
    return (
      <g
        key={item.value}
        style={{ transform: `translate3d(${item.xOffset}px, 0, 0)` }}
      >
        <line y1={height} y2={height + 6} stroke={color} />
        {item.value !== 0 && (
          <text
            key={item.value}
            y={height + 15}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              fill: color,
              strokeWidth: 0,
            }}
          >
            {item.value}
          </text>
        )}
      </g>
    );
  });
};

export default TicksLeft;
