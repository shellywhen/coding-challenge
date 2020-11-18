/* eslint-disable */

/**
 * This is the doc comment for c6.ts
 * It supports to plot the line chart for the intended data.
 * @packageDocumentation
 */

import * as d3 from 'd3'
import $ from 'jquery'
import { TimeSeries, TimeSeriesRaw } from './types'

const PADDING_RATIO = {
  top: 0.05,
  bottom: 0.1,
  left: 0.05,
  right: 0
}
const RADIUS = 3
const ROUND_X_RATIO = 1 / 50
const ROUND_Y_RATIO = 1 / 30
let WIDTH: number
let HEIGHT: number
let EPS = 2
let height: number
let width: number

export class PageMeta {
  private readonly datalist:TimeSeries[]
  private readonly svgid: string
  private xScale: any = d3.scaleTime()
  private yScale: any = d3.scaleLinear()
  private svg: any
  private extremes: any
  private dateFormat: string

  constructor(datalist: any, svgid: string, dateFormat: string = '%Y-%m-%d') {
    this.svgid = svgid
    this.svg = d3.select(`#${svgid}`)
    this.dateFormat = dateFormat
    this.datalist = preprocessSeries(datalist, dateFormat)
    let ymax = parseFloat(d3.max(datalist, (v: TimeSeries) => v.value)!)
    let ymin = parseFloat(d3.min(datalist, (v: TimeSeries) => v.value)!)
    let xmin = this.datalist[0]['time']
    let xmax = this.datalist[datalist.length - 1]['time']
    let [showXmin, showXmax] = roundTime(xmin, xmax)
    let [showYmin, showYmax] = roundValue(ymin, ymax)
    this.extremes = { showYmin, showYmax, showXmin, showXmax }
    this.xScale.range([0, width]).domain([showXmin, showXmax])
    this.yScale.range([height, 0]).domain([showYmin, showYmax])
    console.log(this)
    return this
  }

  plot() {
    prepareCanvas(this.svgid)
    plotAxis(this.xScale, this.yScale, this.svgid)
    plotLineChart(this.datalist, this.xScale, this.yScale, this.svgid)
  }
}

let roundTime = function (start: Date, end: Date): [Date, Date] {
  const ratio = ROUND_X_RATIO
  let delta: number = end.valueOf() - start.valueOf()
  let roundEnd = end.valueOf() + delta * ratio // leave space for the red dot
  let roundStart = start.valueOf() // - delta * ratio
  return [new Date(roundStart), new Date(roundEnd)]
}

let roundValue = function (start: number, end: number): [number, number] {
  const highRatio = ROUND_Y_RATIO
  const lowRatio = ROUND_Y_RATIO
  let delta = end - start
  let roundStart = start - lowRatio * delta
  let roundEnd = end + delta * highRatio
  return [roundStart, roundEnd]
}

let preprocessSeries = function (data: TimeSeriesRaw[], timeFormat: string = '%Y-%m-%d'): TimeSeries[] {
  let val = data.map((v: TimeSeriesRaw) => {
    return {
      time: d3.timeParse(timeFormat)(v.time),
      value: parseFloat(v.value)
    }
  })
  return val
}

let prepareCanvas = function (svgid: string) {
  let canvas = d3.select(`#${svgid}`)
    .html('')
    .append('g')
    .classed('canvas', true)
    .attr('transform', `translate(${WIDTH * PADDING_RATIO.left}, ${HEIGHT * PADDING_RATIO.top})`)
  canvas.append('defs')
    .append('clipPath')
    .attr('id', `${svgid}-clip`)
    .append('rect')
    .attr('x', -WIDTH * PADDING_RATIO.left)
    .attr('y', - HEIGHT * PADDING_RATIO.top)
    .attr('width', WIDTH)
    .attr('height', height + HEIGHT * PADDING_RATIO.top)
  canvas.append('g')
    .classed('y-axis', true)
  canvas.append('g')
    .classed('x-axis', true)
    .attr('transform', `translate(${0}, ${height})`)
  canvas.append('g')
    .classed('chart', true)
    .attr('clip-path', `url(#${svgid}-clip)`)
}

let plotAxis = function (xScale: any, yScale: any, svgid: string) {
  let xg = d3.select(`#${svgid}`)
    .select('.x-axis')
  xg.selectAll('g').remove()
  xg.call(d3.axisBottom(xScale).ticks(4))
    .style('font-size', '0.8rem')
    .style('font-family', 'inherit')
    .selectAll('.tick text')
    .classed('tick-text', true)
  xg.select('.domain').remove()
  xg.append('g').append('line')
    .attr('x2', width)
    .classed('domain', true)

  let yg = d3.select(`#${svgid}`)
    .select('.y-axis')
  yg.selectAll('g').remove()
  yg.call(d3.axisLeft(yScale).ticks(4))
    .style('font-size', '0.8rem')
    .style('font-family', 'inherit')
    .selectAll('.tick text')
    .classed('tick-text', true)
  yg.selectAll('line')
    .attr('x2', width)
  yg.select('.domain').remove()
}

let plotLineChart = function (datalist: TimeSeries[], xScale: any, yScale: any, svgid: string) {
  let lineGenerator = d3.line()
    .x((d: number[]) => d[0])
    .y((d: number[]) => d[1])
    .curve(d3.curveLinear)
  let dots: [number, number][] = datalist.map((v: TimeSeries) => {
    return [xScale(v.time), yScale(v.value)]
  })
  let bgdots:[number, number][] = [[0, height], ...dots,[dots[dots.length - 1][0], height]]
  let canvas = d3.select(`#${svgid}`).select('.chart')
  canvas.append('path')
    .attr('d', lineGenerator(bgdots) || '')
    .classed('bg', true)
  canvas.append('path')
    .attr('d', lineGenerator(dots) || '')
    .classed('main-path', true)
  let focus = canvas.append('circle')
    .classed('focus-point', true)
    .datum(datalist[datalist.length - 1])
    .attr('cx', (d: TimeSeries) => xScale(d.time))
    .attr('cy', (d: TimeSeries) => yScale(d.value))
    .attr('r', 2 * RADIUS)
  let line = canvas.append('line')
    .classed('mouseline', true)
    .attr('x1', -1)
    .attr('x2', -1)
    .attr('y2', height)
  let listener = canvas.append('rect')
    .classed('listener', true)
    .attr('x', 0)
    .attr('width', width)
    .attr('height', height)
    .style('position', 'none')
    .style('opacity', 0)
  let absPos = listener.node()!.getBoundingClientRect()
  let midPos = absPos.top / 2 + absPos.bottom / 2
  listener.on('mousemove', function (this: SVGRectElement, e: MouseEvent) {
      let pos = d3.pointer(e)[0]
      line.attr('x1', pos).attr('x2', pos)
      datalist.forEach((v: TimeSeries) => {
        let eleX = xScale(v.time)
        if(Math.abs(eleX - pos) <  EPS) {
          let eleY = yScale(v.value)
          focus.attr('cx', eleX)
            .attr('cy', eleY)
          let tmp = focus.node()!.getBoundingClientRect()
          let absX = tmp.left
          let absY = tmp.top
          let offset = ROUND_Y_RATIO * height * 2
          d3.select('.tooltip')
            .style('left', `${absX}px`)
            .style('visibility', 'visible')
            .style('top', `${absY > midPos ? absPos.top + offset : absPos.bottom + offset}px`)
            .text(v.value)
          return
        }
      })
    })
}

/** Initialze the canvas
@param fold data for the canvas
@param svgid svg id for the canvas
*/
export let init = function (fold: TimeSeriesRaw[], svgid: string): void {
  let svg = d3.select(`#${svgid}`).html('') // clear the content
  let canvasid = prepareCanvas(svgid)
  let ele = new PageMeta(fold, svgid)
  ele.plot()
}



/** Initialze the global parameters
@param svgid the id of one instance
*/
export let initializeParameter = function (svgid: string): void {
  WIDTH = $(`#${svgid}`).width() || 800
  HEIGHT = $(`#${svgid}`).height() || 400
  height = HEIGHT * (1 - PADDING_RATIO.top - PADDING_RATIO.bottom)
  width = WIDTH * (1 - PADDING_RATIO.left - PADDING_RATIO.right)
}
