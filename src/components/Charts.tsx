import { get } from 'lodash'
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
  machine: keyof typeof benchmarks
}

const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  modelName,
  propertyName,
  machine,
}) => {
  const data: any = []
  const frameworks = Object.keys(get(benchmarks, `${machine}.${modelName}`, {}))

  frameworks.forEach((framework) => {
    const propertyValues = get(
      benchmarks,
      `${machine}.${modelName}.${framework}.${propertyName}`,
      [] as string[]
    )
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
