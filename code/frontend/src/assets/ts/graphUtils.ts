/* eslint-disable */
import * as d3 from 'd3'
import {Node, Link, MatrixCell, Graph} from './types'
export const color = {
  regular: '#0eb4dd',
  darker: '#145f94',
  node: '#9de3f4'
}
let identifier = {
  node: 'n_',
  nodes: 'node-ele',
  link: 'l_',
  links: 'link-ele',
  cell: 'cell_',
  cells: 'cell_ele',
  label: 'label_',
  labels: 'label_ele',
  nodelinkView: 'nl-canvas',
  matrixView: 'mt-canvas'
}

/**
Construct a matrix based on the json.
@param {Graph} graph the graph object
*/
export let getMatrixData = function (graph: Graph, idMap: Map<number,number>) {
  let n = graph.nodes.length
  let matrix: MatrixCell[][]= d3.range(n).map((v: number) => {
    return d3.range(n).map((k: number) => {
      return {
        xid: v,
        yid: k,
        publications: 0
      }
    })
  })
  graph.edges.forEach((l: Link) => {
    let sid = idMap.get(l.source)
    let tid = idMap.get(l.target)
    matrix[sid][tid].publications = l.publications.length
    matrix[tid][sid].publications = l.publications.length
  })
 return matrix
}

/**
Rescale the nodelink result to fit into the canvas perfectly by centering.
@param {number} nodelinkWidth width of the canvas
@param {number} nodelinkHeight height of the canvas
@param {Node[]} nodes the list of nodes
Change the internal value of the node position
*/
export let perfectScale = function(nodelinkWidth: number, nodelinkHeight: number, nodes: Node[]) {
  let minx = 0, maxx = 0, miny = 0, maxy = 0
  for (let node of nodes) {
    minx = Math.min(minx, node.x)
    maxx = Math.max(maxx, node.x)
    miny = Math.min(miny, node.y)
    maxy = Math.max(maxy, node.y)
  }
  let ratiox =  (maxx - minx) / nodelinkWidth
  let ratioy =  (maxy - miny) / nodelinkHeight
  let oldcx = (maxx + minx) / 2
  let oldcy = (maxy + miny) / 2
  nodes.forEach((d: Node) => {
      d.x =  (d.x - oldcx)  / ratiox + nodelinkWidth / 2
      d.y =  (d.y - oldcy) / ratioy + nodelinkHeight / 2
  })
}

/**
Generate path from source and target.
@param {Link} link the node pair
*/
export let linkGenerator = function (link: Link) {
  let points:any = [
    [link.source.x, link.source.y],
    [link.target.x, link.target.y]
  ]
  let base = d3.line()
    .x((d: number[]) => d[0])
    .y((d: number[]) => d[1])
    .curve(d3.curveCardinal)
  return base(points)
}

/**
Map the collaborator number into node size
@param {number} size the node pair
*/
export let nodeSizeTransform = function (size: number) {
  return Math.max(2, Math.sqrt(2 * size + 10))
}

/**
Map the collaborator number into node size
@param {node} node the node to consider
*/
export let fillNodeColor = function (node: Node) {
  return color.node
}



export let highlightNode = function (nid: number) {
  let nlcanvas = d3.select(`.${identifier.nodelinkView}`)
  let mtcanvas = d3.select(`.${identifier.matrixView}`)
  nlcanvas.select(`.${identifier.node}${nid}`).classed('active', true)
  nlcanvas.selectAll(`.${identifier.link}${nid}`).classed('active', true)
  mtcanvas.selectAll(`.${identifier.label}${nid}`).classed('active', true)
  mtcanvas.selectAll(`.${identifier.cell}${nid}`).classed('active', true).raise()
}

export let cancelHighlightNode = function (nid: number) {
  let nlcanvas = d3.select(`.${identifier.nodelinkView}`)
  let mtcanvas = d3.select(`.${identifier.matrixView}`)
  nlcanvas.select(`.${identifier.node}${nid}`).classed('active', false)
  nlcanvas.selectAll(`.${identifier.link}${nid}`).classed('active', false)
  mtcanvas.selectAll(`.${identifier.label}${nid}`).classed('active', false)
  mtcanvas.selectAll(`.${identifier.cell}${nid}`).classed('active', false).raise()
}

export let highlightLink = function (nid1: number, nid2: number) {
  let nlcanvas = d3.select(`.${identifier.nodelinkView}`)
  let mtcanvas = d3.select(`.${identifier.matrixView}`)
  nlcanvas.select(`.${identifier.node}${nid1}`).classed('active', true)
  nlcanvas.select(`.${identifier.node}${nid2}`).classed('active', true)
  nlcanvas.selectAll(`.${identifier.link}${nid1}.${identifier.link}${nid2}`).classed('active', true)
  mtcanvas.selectAll(`.${identifier.label}${nid1}`).classed('active', true)
  mtcanvas.selectAll(`.${identifier.label}${nid2}`).classed('active', true)
  mtcanvas.selectAll(`.${identifier.cell}${nid1}.${identifier.cell}${nid2}`).classed('active', true).raise()
}

export let cancelHighlightLink = function (nid1: number, nid2: number) {
  let nlcanvas = d3.select(`.${identifier.nodelinkView}`)
  let mtcanvas = d3.select(`.${identifier.matrixView}`)
  nlcanvas.select(`.${identifier.node}${nid1}`).classed('active', false)
  nlcanvas.select(`.${identifier.node}${nid2}`).classed('active', false)
  nlcanvas.selectAll(`.${identifier.link}${nid1}.${identifier.link}${nid2}`).classed('active', false)
  mtcanvas.selectAll(`.${identifier.label}${nid1}`).classed('active', false)
  mtcanvas.selectAll(`.${identifier.label}${nid2}`).classed('active', false)
  mtcanvas.selectAll(`.${identifier.cell}${nid1}.${identifier.cell}${nid2}`).classed('active', false)
}
