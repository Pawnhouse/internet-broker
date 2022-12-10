import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';


function Chart({ candles }) {
  let stroke, fill, bottom, top;
  if (candles) {
    if (candles[0].o < candles[candles.length - 1].o) {
      stroke = '#13D300';
      fill = '#84FF77';
    } else {
      stroke = '#D31300';
      fill = '#FF8477';
    }

    let min = candles[0].o, max = 0;
    for (let i = 0; i < candles.length; i++) {
      min = Math.min(min, candles[i].o);
      max = Math.max(max, candles[i].o);
    }
    const delta = max - min
    bottom = Math.max(Math.floor(min - 0.3 * delta), 0);
    top = Math.ceil(max + 0.3 * delta);
  }

  return (
    <>
      {
        candles &&
        <ResponsiveContainer>
          <AreaChart width={800} height={400} data={candles}>
            <Area type="monotone" dataKey="o" stroke={stroke} fill={fill} strokeWidth={3} />
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.3)" />
            <XAxis dataKey="t" tickMargin={10} />
            <YAxis domain={[bottom, top]} interval="preserveEnd" />
          </AreaChart>
        </ResponsiveContainer>
      }
    </>
  )
}

export default Chart
