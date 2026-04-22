import { Line } from 'react-chartjs-2'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Legend)

function makeOptions(color) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 200 },
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#4a5568', font: { size: 10 } },
      },
    },
  }
}

function MiniChart({ label, data, labels, color, badge }) {
  const chartData = {
    labels,
    datasets: [{ data, borderColor: color, borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false }],
  }
  return (
    <div className="panel">
      <div className="panel-header">
        {label}
        <span className="panel-badge">{badge}</span>
      </div>
      <div className="panel-body">
        <div className="chart-container">
          <Line data={chartData} options={makeOptions(color)} />
        </div>
      </div>
    </div>
  )
}

export default function TelemetryChart({ history }) {
  return (
    <>
      <MiniChart
        label="🌡 Temperature History"
        data={history.temp}
        labels={history.labels}
        color="#14b8a6"
        badge="°C · Last 60"
      />
      <MiniChart
        label="❤ Heart Rate History"
        data={history.hr}
        labels={history.labels}
        color="#ec4899"
        badge="BPM · Last 60"
      />
      <MiniChart
        label="💧 Humidity History"
        data={history.humidity}
        labels={history.labels}
        color="#60a5fa"
        badge="% · Last 60"
      />
    </>
  )
}
