import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceArea,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
interface ComparisonBarChartProps {
  propertyName: string
  data: any[]
  isLilith?: boolean
}

export const labelForMetric = new Map([
  ['proofSize', 'Proof Size in Bytes'],
  ['memoryUsage', 'Memory Usage in MB'],
  ['provingTime', 'Proving Time in Seconds'],
])

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  propertyName,
  data,
  isLilith,
}) => {
  const [barData, setBarData] = useState(data)

  useEffect(() => {
    setBarData(
      data
        .map((d) => {
          return {
            name: d.framework,
            value: d.value,
          }
        })
        .filter((d) => (isLilith && !d.name.includes('ezkl') ? false : true))
    )
  }, [data])

  return (
    <BarChart
      width={500}
      height={300}
      data={barData}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='name' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar
        name={labelForMetric.get(data[0].metric)}
        dataKey='value'
        fill='#8884d8'
      />
      {barData.map((entry, index) =>
        !entry.value ? (
          <ReferenceArea
            key={`ref-${index}`}
            x1={entry.name}
            x2={entry.name}
            y1={0}
            y2={999999}
            fill='rgba(0, 0, 0, 0.4)' // Adjust color and opacity as needed
            ifOverflow='extendDomain'
          />
        ) : null
      )}
    </BarChart>
  )
}

export default ComparisonBarChart
