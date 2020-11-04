interface Node {
  label?: string,
  dept?: string,
  uniqueID?: string,
  fullname?: string,
  id: number,
  itsc?: string,
  degree?: number,
  collaborator?: number,
  x?: number,
  y?: number
}
interface Link {
  source: number|node,
  target: number|node,
  publications: publication[]
}
interface Graph {
  nodes: Node[],
  edges: Link[]
}
interface MatrixCell {
  xid: number,
  yid: number,
  publications: number
}
interface: Cell {
  month: number,
  year: number,
  maximum: number,
  minimum: number,
  minlist?: number[],
  maxlist?:number[]
}
export {
  Node,
  Link,
  MatrixCell,
  Cell,
  Graph
}
