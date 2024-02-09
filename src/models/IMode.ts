export default interface IMode {
  mode: string,
  time: IModeTime
}

interface IModeTime {
  totalTime: number,
  increment: number
}