/* eslint-disable */

/**
 * This is the doc comment for c3.ts
 * It supports to plot both nodelink diagram and matrix for the intended data.
 * @packageDocumentation
 */

import * as d3 from 'd3'
import $ from 'jquery'
import * as nl from './graphUtils'
import { Node, Link, MatrixCell, Graph } from './types'

const LABEL_FONT_SIZE = 7.2
const DURATION =  2000
const DELAY = 50
const EASE = d3.easePolyInOut.exponent(3)
const mtPaddingRatio = 0.2
let info: any = {
  idMap: new Map(), // mapping the node id to its order in the node list
  order: {          // the order of the node list under different criteria
    degree: [],       // #publications in the subgraph
    normal: [],       // order in the original dataset
    fullname: [],     // full name (a -> z)
    collaborator:[]   // #collaborators in the subgraph
  },
}
let ctx: any = {
  svg: undefined,
  nl_g: undefined,
  mt_g: undefined,
  width: 800, // the width of the svg (default 800, to be determined when run)
  height: 400, // the height of the svg (default 400, to be determined when run)
  leftRatio: 0.4,  // split the view into two parts (left: nodelink, right: matrix) with a left ratio
  xScale: d3.scaleBand().paddingOuter(0).paddingInner(0.1).align(0.5), // the scale for the square
  cScale: (d:number) => {
    return d===0?'white':d3.interpolateYlGnBu(Math.min(1, d / 20))
  },
}

let setupCanvas = function (svgid: string) {
  let svg = d3.select(`#${svgid}`)
  svg.style('width', '100%')
    .style('height', '80vh')
  ctx.width = $(`#${svgid}`).width() || ctx.width
  ctx.height = $(`#${svgid}`).height() || ctx.height
  ctx.svg = svg
  let mtCanvas = svg.append('g').classed('mt-canvas', true)
    .attr('transform', `translate(${ctx.width * ctx.leftRatio}, 0)`)
  let nlCanvas = svg.append('g')
    .classed('nl-canvas', true)
  nlCanvas.append('text')
    .classed('loading', true)
    .text('Loading')
    .attr('x', ctx.width * ctx.leftRatio / 2)
    .attr('y', ctx.height / 2)
  return
}


function download(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a')
  const file = new Blob([content], { type: contentType })
  a.href = URL.createObjectURL(file)
  a.download = fileName
  a.click()
}

let createIdMap = function (nodes: Node[]) {
  nodes.forEach((node: Node, idx: number) => {
    info.idMap.set(node.id, idx)
  })
}

let createOrder = function (nodes: Node[]) {
  let argsort = function (array:Array<any>) {
    let pairs = array.map((x: Array<any>, i: number) => [x, i])
    pairs.sort((a: any, b: any) => a[0] < b[0] ? 1 : -1)
    return pairs.map((pair: any) => pair[1])
  }
  info.order.degree = argsort(nodes.map((v: Node) => v.degree))
  info.order.normal = d3.range(nodes.length)
  info.order.fullname = argsort(nodes.map((v: Node) => v.fullname)).reverse()
  info.order.collaborator = argsort(nodes.map((v: Node) => v.collaborator))
}

/**
* Filter the subgraph of professors from CSE Dept.
* @param data a Graph object
* @returns the filtered subgraph
*/
let fetchSubgraph = function (data: Graph): Graph {
  let validNodes:Node[] = data.nodes.filter((node: Node) => node.dept === 'CSE')
  let validIds = new Set(validNodes.map((node: Node) => node.id))
  let validEdges = data.edges.filter((edge: Link) => validIds.has(edge.source) && validIds.has(edge.target))
  createIdMap(validNodes)
  validNodes.forEach((node: Node) => {
    node.degree = 0
    node.collaborator = 0
  })
  validEdges.forEach((link: Link) => {
    let sum = link.publications.length
    validNodes[info.idMap.get(link.source)].degree! += sum
    validNodes[info.idMap.get(link.target)].degree! += sum
    validNodes[info.idMap.get(link.source)].collaborator! += 1
    validNodes[info.idMap.get(link.target)].collaborator! += 1
  })
  let subgraph = {
    'nodes': validNodes,
    'edges': validEdges
  }
  // let json = JSON.stringify(subgraph)  // dev
  // download(json, 'graph.json', 'json')  // dev
  return subgraph
}

let removeLoading = () => d3.select('#c3').select('.loading').remove()

let showTooltip = function (tooltip: any, e: any, d: Node) {
  tooltip.html(`<a href="mailto:${d.itsc}@.cse.ust.hk">${d.fullname}</a>`)
  .style('left', e.pageX + 'px')
  .style('top', e.pageY + 'px')
  .style('visibility', 'visible')
}

let fadeTooltip = function (tooltip: any) {
  tooltip.style('visibility', 'hidden')
}

let plotNodelink = function (graph: Graph, nlcanvas: any) {
  removeLoading()
  const nlPaddingRatio = 0.3
  nl.perfectScale(ctx.width * ctx.leftRatio*(1-nlPaddingRatio), ctx.height *(1-nlPaddingRatio), graph.nodes)
  let tooltip = d3.select('#c3').select('.tooltip')
  ctx.nl_g = nlcanvas.append('g')
    .attr('transform', `translate(${ctx.leftRatio*nlPaddingRatio*ctx.width/2}, ${nlPaddingRatio*ctx.height/2})`)
    .append('g')

  let linkg = ctx.nl_g.append('g')
    .classed('link-canvas', true)
    .selectAll('path')
    .data(graph.edges)
    .enter()
    .append('path')
    .attr('class', (d:Link) => {
      let sid = d.source.id
      let tid = d.target.id
      let min = info.idMap.get(Math.min(sid, tid))
      let max = info.idMap.get(Math.max(sid, tid))
      return `link-ele l_${min} l_${max}`
    })
    .attr('d', (d: Link) => nl.linkGenerator(d))

  let nodeg = ctx.nl_g.append('g')
    .classed('node-canvas', true)
    .selectAll('circle')
    .data(graph.nodes)
    .enter()
    .append('circle')
    .attr('class', (d: Node) => {
      return `node-ele n_${info.idMap.get(d.id)}`
    })
    .classed('node-ele', true)
    .attr('r', (d: Node) => nl.nodeSizeTransform(d.collaborator!))
    .attr('cx', (d: Node) => d.x)
    .attr('cy', (d: Node) => d.y)
    .style('fill', nl.fillNodeColor)
    .on('mouseover', function (e: MouseEvent, d: Node) {
      showTooltip(tooltip, e, d)
      nl.highlightNode(info.idMap.get(d.id))
    })
    .on('mouseout', function(e:MouseEvent, d: Node) {
      fadeTooltip(tooltip)
      nl.cancelHighlightNode(info.idMap.get(d.id))
    })

  let result = ctx.svg
    .call(d3.zoom()
      .scaleExtent([2 / 3, 10])
      .on('zoom', function(e:any) {
        ctx.nl_g.attr('transform', e.transform);
      }))
}

let createNodelink = function (graph: Graph, gstr: string='nl-canvas') {
  let g = ctx.svg.select(`.${gstr}`)
  let linkSimulation = d3.forceLink(graph.edges)
    .id((d: any) => d.id)
    .distance(20)
    .strength(1)
  let nlLayout = d3.forceSimulation(graph.nodes)
    .force('charge', d3.forceManyBody().strength(-3000))
    .force('center', d3.forceCenter(ctx.width * ctx.leftRatio / 2, ctx.height / 2))
    .force('x', d3.forceX(ctx.width * ctx.leftRatio / 2).strength(1))
    .force('y', d3.forceY(ctx.height / 2).strength(1))
    .force('link', linkSimulation)
    .on('end', () => plotNodelink(graph, g))
}

let setupMatrixCanvas = function (gstr: string) {
  let height = ctx.height * (1 - mtPaddingRatio)
  let width = ctx.width * (1 - ctx.leftRatio) * (1 - mtPaddingRatio)
  height = Math.min(height, width)
  width = height
  ctx.mt_g = ctx.svg
    .select(`.${gstr}`)
    .append('g')
    .attr('transform', `translate(${(ctx.width * (1 - ctx.leftRatio) - width) / 2}, ${(ctx.height - height) / 2 + ctx.height * mtPaddingRatio / 4})`)
  ctx.mt_g.append('rect')
    .classed('mt-bg', true)
    .attr('width', width)
    .attr('height', height)
  ctx.mt_g.append('g')
    .classed('mt-legend', true)
    .attr('transform', `translate(${width + width * mtPaddingRatio / 8}, ${0})`)
  return [width, height]
}

let createMatrixLegend = function (height :number, width :number) {
  let n = 20
  let slots = d3.range(n).map((v: number, idx: number) => ctx.cScale(v))
  let slotWidth = width / (2 * slots.length)
  let xScale = d3.scaleBand()
    .domain(slots)
    .paddingOuter(0)
    .paddingInner(0)
    .range([0, height / 2])
  slots.pop()
  let legend = ctx.mt_g
    .select('.mt-legend')
    .selectAll('rect')
    .data(slots)
    .enter()
    .append('rect')
    .attr('y', (d: string) => xScale(d))
    .attr('width', slotWidth)
    .attr('height', height * mtPaddingRatio / 4)
    .style('fill', (d: string) => d)
  let annotations = ctx.mt_g
    .select('.mt-legend')
    .selectAll('text')
    .data(d3.range(n))
    .enter()
    .append('text')
    .classed('annotation', true)
    .attr('x', slotWidth * 1.5)
    .attr('y', (d: string) => xScale(ctx.cScale(d)))
    .attr('dy', slotWidth * 0.8)
    .style('font-size', '0.4rem')
    .text((d: number) => d)
}

let createMatrix = function (graph: Graph, gstr: string='mt-canvas') {
  let [width, height] = setupMatrixCanvas(gstr)
  let matrix = nl.getMatrixData(graph, info.idMap)
  let order = info.order.normal

  ctx.xScale = d3.scaleBand()
    .domain(order.map((v: number) => v.toString()))
    .range([0, width])

  ctx.mt_g.append('g')
    .classed('matrix-g', true)
    .selectAll('g')
    .data(matrix)
    .enter()
    .append('g')
    .classed('matrix-col', true)
    .attr('transform', (d: MatrixCell[], idx:number) => `translate(${ctx.xScale(idx.toString())}, ${0})`)
    .selectAll('rect')
    .data((d: MatrixCell[]) => d)
    .enter()
    .append('rect')
    .attr('class', (d: MatrixCell) => `cell-ele cell_${d.xid} cell_${d.yid}`)
    .attr('x', (d: MatrixCell) => 0)
    .attr('y', (d: MatrixCell) => ctx.xScale(d.yid.toString()))
    .attr('width', ctx.xScale.bandwidth())
    .attr('height', ctx.xScale.bandwidth())
    .style('fill', (d: MatrixCell) => ctx.cScale(d.publications))
    .on('mouseover', (e: MouseEvent, d: MatrixCell) => {
      if(d.publications === 0) return
      nl.highlightLink(d.xid, d.yid)
    })
    .on('mouseout', (e: MouseEvent, d: MatrixCell) => nl.cancelHighlightLink(d.xid, d.yid))

  ctx.mt_g.append('g')
    .classed('name-vertical', true)
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', (d: Node) => `label-wrapper label-wrapper_${d.id}`)
    .attr('transform', (d: Node, idx: number) => `translate(${-LABEL_FONT_SIZE * 0.8}, ${ctx.xScale(idx.toString())+ LABEL_FONT_SIZE})`)
    .append('text')
    .attr('class', (d: Node) => {
      return `label_${info.idMap.get(d.id)} label-ele`
    })
    .text((d: Node) => d.fullname)
    .style('font-size', `${LABEL_FONT_SIZE}px`)
    .on('mouseover', (e: MouseEvent, d: Node) => nl.highlightNode(info.idMap.get(d.id)))
    .on('mouseout', (e: MouseEvent, d: Node) => nl.cancelHighlightNode(info.idMap.get(d.id)))

  ctx.mt_g.append('g')
    .classed('name-horizontal', true)
    .selectAll('g')
    .data(graph.nodes)
    .enter()
    .append('g')
    .attr('class', (d: Node) => `label-wrapper label-wrapper_${d.id}`)
    .attr('transform', (d: Node, idx: number) => `translate(${ctx.xScale(idx.toString())+ LABEL_FONT_SIZE / 2}, ${-LABEL_FONT_SIZE * 0.8 / Math.sqrt(2)})`)
    .append('text')
    .datum((d: Node) => d)
    .attr('class', (d: Node) => `label_${info.idMap.get(d.id)} label-ele`)
    .text((d: Node) => d.fullname)
    .style('font-size', `${LABEL_FONT_SIZE}px`)
    .on('mouseover', (e: MouseEvent, d: Node) => nl.highlightNode(info.idMap.get(d.id)))
    .on('mouseout', (e: MouseEvent, d: Node) => nl.cancelHighlightNode(info.idMap.get(d.id)))

  createMatrixLegend(height, width)
}

let reorderMatrix = function (mode: string) {
  if(!ctx.mt_g) return
  let order = info.order[mode]
  let n = ctx.xScale.domain().length
  ctx.xScale.domain(order.map((v: number) => v.toString()))
  ctx.mt_g
    .select('.mt-bg')
    .style('opacity', 0)
    .transition()
    .duration(0)
    .delay( DURATION + n * DELAY)
    .style('opacity', 1)
  ctx.mt_g
    .select('.name-vertical')
    .selectAll('.label-wrapper')
    .transition()
    .duration(DURATION / 2)
    .delay((d: Node[], i: number) => DURATION / 2 + n * DELAY / 2 + i * DELAY / 2)
    .ease(EASE)
    .attr('transform', (d: Node, idx: number) => `translate(${-LABEL_FONT_SIZE * 0.8}, ${ctx.xScale(idx.toString())+ LABEL_FONT_SIZE})`)
  ctx.mt_g
    .select('.name-horizontal')
    .selectAll('.label-wrapper')
    .transition()
    .duration(DURATION / 2)
    .delay((d: Node[], i: number) => i * DELAY / 2)
    .ease(EASE)
    .attr('transform', (d: Node, idx: number) => `translate(${ctx.xScale(idx.toString())+ LABEL_FONT_SIZE/2}, ${-LABEL_FONT_SIZE * 0.8 / Math.sqrt(2)})`)
  ctx.mt_g
    .selectAll('.matrix-col')
    .transition()
    .duration(DURATION/2)
    .delay((d: MatrixCell[], i: number) => i * DELAY/2)
    .ease(EASE)
    .attr('transform', (d: MatrixCell[], idx:number) => `translate(${ctx.xScale(idx.toString())}, ${0})`)
    .selectAll('.cell-ele')
    .transition()
    .duration(DURATION/2)
    .delay((d: MatrixCell, i: number) => i * DELAY/2)
    .ease(EASE)
    .attr('y', (d: MatrixCell) => ctx.xScale(d.yid.toString()))
}


/**
 * Initialize the canvas and data.
 * @param data the parsed data from json, lists of nodes and edges
 * @param svgid the id of the svg element
 */
 let init = function (data: unknown, svgid: string) {
  let converted = data as Graph
  let subgraph = fetchSubgraph(converted)
  // let subgraph = data as Graph // for development only
  createIdMap(subgraph.nodes)
  createOrder(subgraph.nodes)
  setupCanvas(svgid)
  createMatrix(subgraph)
  createNodelink(subgraph)
}

export {
  init,
  reorderMatrix
}
