/* eslint-disable */

/**
 * This is the doc comment for c1.ts
 * It supports to plot a simple heatmap.
 * @packageDocumentation
 */

import * as d3 from "d3"
import $ from 'jquery'
import { Cell } from './types'

enum Mode {
  maximum,
  minimum
}

let mode: Mode = Mode.maximum
let width: any = 800
let height: any = 300
let canvas: any
let xScale: any
let yScale: any
let colorScale_max: any
let colorScale_min: any
let colorScale: any
const legendRatio = 12/14
const declaredWidth = '95vw'
const declaredHeight = '80vh'
const leftWidthPadding = 0.07
const rightWidthPadding = 0.005
const heightPadding = 0.05
const xPaddingOuter = 0.02
const xPaddingInner = 0.08
const yPaddingOuter = 0.02
const yPaddingInner = 0.1
const bandAlign = 1 // align right
const barRadius = 0.08
const barRadiusMin = 2
const colorScheme = 'interpolatePlasma'
const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
let yearName: number[] = []

let max_max_t = Number.NEGATIVE_INFINITY
let max_min_t = Number.NEGATIVE_INFINITY
let min_max_t = Number.POSITIVE_INFINITY
let min_min_t = Number.POSITIVE_INFINITY
let startYear: number = 1970
let endYear: number = 2020
let yearTotal: number = endYear - startYear + 1


/**
 * Preprocess the passed data by merging the daily information into a monthly-based slot according to extreme.
 * @param obj the parsed data from csv, a list of  objects (date, min_temperature, max_temperature) ordered by date (format: YYYY-MM-DD)
 */
let dataPreprocessing = function (obj:any) {
  startYear = parseInt(obj[0].date.substring(0,4))
  endYear = parseInt(obj[obj.length-1].date.substring(0,4))
  yearTotal = endYear - startYear + 1
  let bars:any[] = []
  for (let year = startYear; year <= endYear; year++) {
    yearName.push(year)
    let tmp:Cell[] = []
    for (let month = 0; month < 12; month ++) {
      tmp.push({
        month: month,
        year: year,
        maximum: Number.NEGATIVE_INFINITY,
        minimum: Number.POSITIVE_INFINITY
      })
    }
    bars.push(tmp)
  }
  obj.forEach((v:any) => {
    let month = parseInt(v.date.substring(5, 7))-1
    let year = parseInt(v.date.substring(0, 4))-startYear
    let dmax = parseInt(v.max_temperature)
    let dmin = parseInt(v.min_temperature)
    bars[year][month].maximum = Math.max(bars[year][month].maximum, dmax)
    bars[year][month].minimum = Math.min(bars[year][month].minimum, dmin)
  })
  for(let i in bars) {
    bars[i] = bars[i].filter((bar:any) => bar.maximum!==Number.NEGATIVE_INFINITY)
    for(let bar of bars[i]) {
      max_max_t = Math.max(max_max_t, bar.maximum)
      max_min_t = Math.max(max_min_t, bar.minimum)
      min_max_t = Math.min(min_max_t, bar.maximum)
      min_min_t = Math.min(min_min_t, bar.minimum)
    }
  }
  return bars
}


let setupCanvas = function (svgid: string) {
  let svg = d3.select(`#${svgid}`)
  svg.style('width', declaredWidth)
    .style('height', declaredHeight)
  let realWidth = $(`#${svgid}`).width() || width
  let realHeight = $(`#${svgid}`).height() || height
  width = realWidth * (1 - leftWidthPadding-rightWidthPadding)
  height = realHeight * (1 - heightPadding) * legendRatio
  let canvas = svg.append('g')
    .attr('transform', `translate(${realWidth * leftWidthPadding}, ${realHeight * heightPadding})`)
  return canvas
}

let setupScale = function () {
  xScale = d3.scaleBand()
    .domain(yearName.map((v: number) => v.toString()))
    .range([0, width])
    .paddingOuter(xPaddingOuter)
    .paddingInner(xPaddingInner)
    .align(bandAlign)
  yScale = d3.scaleBand()
    .domain(monthName)
    .range([0, height])
    .paddingOuter(yPaddingOuter)
    .paddingInner(xPaddingInner)
    .align(bandAlign)
  colorScale_max = function(x: number) {
    let t = (x - min_max_t)/(max_max_t-min_max_t)
    return d3[colorScheme](t)
  }
  colorScale_min = function(x: number) {
    let t = (x - min_min_t)/(max_min_t-min_min_t)
    return d3[colorScheme](t)
  }
  colorScale = function(x: number) {
    let t = (x - min_min_t)/(max_max_t-min_min_t)
    return d3[colorScheme](t)
  }
}

let plotLegend = function () {
  canvas.selectAll('.legend').remove()
  let legendCanvas = canvas.append('g')
    .attr('transform', `translate(${0}, ${height*(1+heightPadding)})`)
    .classed('legend', true)
  let legendSlots: number[] = []
  let mint = mode===Mode.maximum ? min_max_t : min_min_t
  let maxt = mode===Mode.maximum ? max_max_t : max_min_t
  let cScale = mode===Mode.maximum? colorScale_max : colorScale_min
  for (let t = mint; t <= maxt; t++) legendSlots.push(t)
  let cxScale = d3.scaleBand()
    .domain(legendSlots.map((v: number) => v.toString()))
    .range([0, width/2])
    .paddingInner(0.02)
    .paddingOuter(xPaddingOuter)
    .align(1)
  let annotation = legendCanvas.append('g')
    .classed('annotation', true)
    .attr('transform', `translate(0, ${cxScale.bandwidth()})`)
    .call(d3.axisBottom(cxScale))
  annotation.select('.domain').remove()
  annotation.selectAll('.tick').select('line').remove()
  annotation.selectAll('.tick').select('text').attr('dy', '0.3em')
  legendCanvas.append('g').classed('legend-block', true)
   .selectAll('rect')
   .data(legendSlots)
   .enter()
   .append('rect')
   .attr('x', (d:number) => cxScale(d.toString()))
   .attr('y', 0)
   .attr('width', cxScale.bandwidth())
   .attr('height', cxScale.bandwidth())
   .style('fill', (d:number) => cScale(d))
legendCanvas.append('text')
  .attr('x', cxScale.range()[1] + 9)
  .classed('tick-text', true)
  .style('font-size', '0.8rem')
  .style('text-anchor', 'start')
  .attr('y', cxScale.bandwidth()/2 + 4)
  .text('Temperature (℃)')
}

let plotAxis = function (canvas: any) {
  canvas.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(${0}, ${0})`)
      .call(d3.axisTop(xScale))
      .style('font-size', '0.8rem')
      .style('font-family', 'inherit')
      .selectAll('.tick text')
      .classed('tick-text', true)
  canvas.append('g')
      .classed('y-axis', true)
      .attr('transform', `translate(${0}, ${0})`)
      .call(d3.axisLeft(yScale))
      .style('font-size', '0.8rem')
      .style('font-family', 'inherit')
      .selectAll('.tick text')
      .classed('tick-text', true)
}

let fillBar = (d: Cell) =>  mode === Mode.maximum ? colorScale_max(d.maximum) : colorScale_min(d.minimum)

let getXpos = (x: number) => x < window.innerWidth / 4 * 3 ? x + 15 : x-window.innerWidth * 0.2

let plotBars = function (canvas: any, data: any) {
  let bars = canvas.append('g')
    .classed('bar-wrapper', true)
    .attr('transform', function() {
      let xLeftPadding = xScale.step()*bandAlign*xScale.paddingOuter()
      let yTopPadding = yScale.step()*bandAlign*yScale.paddingOuter()
      return `translate(${xLeftPadding}, ${yTopPadding})`
    })
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .classed('bar-col-container', true)
    .attr('transform', function(d: Cell[]) {
      let x = xScale(d[0].year.toString())
      let y = 0
      return `translate(${x}, ${y})`
    })
    .selectAll('g')
    .data((d: Cell) => d)
    .enter()
    .append('g')
    .classed('bar-container', true)
    .attr('transform', function(d: Cell) {
      let x = 0
      let y = yScale(monthName[d.month])
      return `translate(${x}, ${y})`
    })
  bars.append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('rx', Math.min(barRadiusMin, barRadius * xScale.bandwidth()))
    .attr('ry', Math.min(barRadiusMin, barRadius * yScale.bandwidth()))
    .style('fill', fillBar)
    .style('stroke-width', '0')
    .style('stroke', '#b8b8ab')
    .on('mouseover', function(this: SVGRectElement, e: MouseEvent, d: Cell) {
      let tooltip = d3.select('#c1').select('.tooltip')
        .style('visibility', 'visible')
        .html(`Time: ${d.year}-${String(d.month + 1).padStart(2, '0')} &nbsp;&nbsp;  max: ${d.maximum} &nbsp;&nbsp;  min: ${d.minimum} `)
        .style('left', getXpos(e.pageX) + 'px')
        .style('top', e.pageY + 'px')
      d3.select(this as SVGRectElement)
        .style('stroke-width', 2)
    })
    .on('mouseout', function(this: SVGRectElement) {
      d3.select('#c1').select('.tooltip')
        .style('visibility', 'hidden')
      d3.select(this)
        .style('stroke-width', 0)
    })
}

/**
 * Initialize the canvas and data.
 * @param obj the parsed data from csv, a list of objects
 * @param svgid the id of the svg element
 */
export let init = function (obj:any, svgid:string) {
  let bars = dataPreprocessing(obj)
  canvas = setupCanvas(svgid)
  setupScale()
  plotAxis(canvas)
  plotBars(canvas, bars)
  plotLegend()
}

/**
 * Switch the view of min_temperture and max_temperature.
 */
export let changeMode = function () {
  if (!canvas) return
  mode = mode === Mode.minimum? Mode.maximum : Mode.minimum
  d3.selectAll('.bar')
    .style('fill', fillBar)
  plotLegend()
}
