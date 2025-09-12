import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { OpcData } from "../../../types/basic";
import { useEffect, useRef } from "react";
import "./Chart.scss";
import "highcharts/themes/dark-unica";

interface ChartProps {
  data: OpcData[];
}

const Chart = ({ data }: ChartProps) => {
  const chartRef = useRef<HighchartsReact.RefObject>(null);
  const formattedData = data.map((point) => [
    new Date(point.timestamp).getTime(),
    point.value,
  ]);

  const options: Highcharts.Options = {
    chart: {
      width: 1400,
      height: 600,
    },
    title: {
      text: "",
    },
    xAxis: {
      type: "datetime",
      title: {
        text: "Timestamp",
      },
      minPadding: 100,
    },
    yAxis: {
      title: {
        text: "Value",
        align: "low",
        style: {
          fontWeight: "bold",
          color: "#fff", 
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Value",
        data: formattedData,
      },
    ],
  };

  useEffect(() => {
    if (!chartRef.current?.chart || formattedData.length === 0) return;
    const chart = chartRef.current.chart;
    const lastTimestamp = formattedData[formattedData.length - 1][0];
    const firstTimestamp = formattedData[0][0];
    if (lastTimestamp - firstTimestamp < 60 * 1000) {
      chart.xAxis[0].setExtremes(firstTimestamp, lastTimestamp);
    } else {
      chart.xAxis[0].setExtremes(lastTimestamp - 60 * 1000, lastTimestamp);
    }
  }, [formattedData]);
  return (
    <HighchartsReact
      ref={chartRef}
      highcharts={Highcharts}
      options={options}
      containerProps={{
        className: "chart",
        style: { borderRadius: 12, overflow: "hidden" },
      }}
    />
  );
};

export default Chart;
