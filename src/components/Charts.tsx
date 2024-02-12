import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import benchmarks from '../fixtures/benchmarks.json'
interface ComparisonBarChartProps {
  modelName: string
  propertyName: string
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  modelName,
  propertyName,
}) => {
  const data: any = []
  const frameworks = Object.keys(benchmarks['64CPU-128GB-None'][modelName])

  frameworks.forEach((framework) => {
    const propertyValues =
      benchmarks['64CPU-128GB-None'][modelName][framework][propertyName]
    if (propertyValues === undefined) return
    const averagePropertyValue =
      propertyValues.reduce(
        (acc, value) =>
          acc + parseInt(value.replace('kb', '').replace('s', '')),
        0
      ) / propertyValues.length
    data.push({
      name: framework,
      [propertyName]: averagePropertyValue,
    })
  })

  return (
    <BarChart
      width={500}
      height={300}
      data={data}
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
      <Bar dataKey={propertyName} fill='#8884d8' />
    </BarChart>
  )
}

export default ComparisonBarChart
