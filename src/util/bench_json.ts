/**
 * Extracts runner details from a given runner name string.
 * The runner name is expected to be in the format "xCPU-yGB-Accelerator?",
 * where x is the number of CPUs, y is the amount of RAM in GB, and Accelerator
 * is either 'CUDA' or 'Metal' or a string indicating a falsy value.
 *
 * @param runnerName The name of the runner from the benchmark JSON
 * @returns An object containing the cpu count, ram amount, and accelerator type.
 */
export const getRunnerDetails = (runnerName: string) => {
  let [cpuString, ramString, acceleratorString] = runnerName.split('-')
  const cpu: number = +cpuString.replace('CPU', '').replace('GPU', '')
  const ram: number = +ramString.replace('GB', '')
  const accelerator =
    { CUDA: 'CUDA', Metal: 'Metal' }[acceleratorString] || null
  return { cpu, ram, accelerator }
}
