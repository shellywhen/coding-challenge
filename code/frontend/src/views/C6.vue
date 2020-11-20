<template>
<div id="c6">
  <!-- <div class="title-container">
    <span class="title">Stock Market Tracker</span>
  </div>
  <el-row :gutter="5">
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <el-button type="info" plain size="mini" @click="launch">Search 👀</el-button>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="grid-content bg-purple">
        <el-input size="mini" v-model="code" placeholder="Stock Code">
        </el-input>
      </div>
    </el-col>
  </el-row> -->
  <el-row :gutter="10" style="margin-top: 2vh">
    <el-col :span="10" style="margin-top: 5vh">
      <h1>Stock Market Traker</h1>
      <el-row :gutter="5" style="margin-top: 3vh">
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-input size="mini" v-model="code" placeholder="Stock Code">
            </el-input>
            <!-- <AutocompleteBar></AutocompleteBar> -->
            <div class=suggestions>
              <div v-for="item in suggestions" :key="item">
                {{ item }}
              </div>
            </div>
              </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button type="info" plain size="mini" @click="launch">Search 👀</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="overview mask">
        <el-divider content-position="right">Overview</el-divider>
        <h2>{{ overview.name }} ({{overview.exchange}}: {{ overview.symbol }})</h2>
          <div>
            <span> {{ overview.sector }}</span>
            <el-divider direction="vertical"></el-divider>
            <span>{{overview.industry}}</span>
          </div>
         <p><b>Introduction</b>: {{ overview.description }}</p>
         <p><b>Total Employees</b>: {{ overview.employees }} </p>
         <p><b>Address</b>: {{ overview.address }} </p>
      </div>
    </el-col>
    <el-col :span="14" style="margin-top: 8vh">
      <div class="block-container">
        <div class="mask">
          <div class="meta">
            <el-row>
              <el-col :span="6">
                <div class="current">{{meta.current}}</div>
              </el-col>
              <el-col :span="18">
                <div class="info" :style="{'color': flagColor}">{{comparison}}</div>
              </el-col>
            </el-row>
            <div class="flex">
              <div class="time">{{"—" + meta.timestr}}</div>
            </div>
          </div>
          <el-tabs v-model="activeSvg" @tab-click="renderSvg">
            <el-tab-pane v-for="item in svgs" :key="item.id" :label="item.name" :name="item.id">
              <div class="svg-container">
                <svg class="stock" :id="'svg_' + item.id"></svg>
              </div>
            </el-tab-pane>
          </el-tabs>

          <div class="value-container">
            <el-row :gutter="20">
              <el-col v-for="item in tags" :key="item" :span="8">
                <div class="flex">
                  <span class="value-label">{{ item | capitalize }}:&nbsp;</span>
                  <span class="value">{{ meta[item] }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <svg aria-hidden="true" focusable="false" style="width:0;height:0;position:absolute;">
    <linearGradient id="gradient-vertical-red" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--color-stop-1)" />
      <stop offset="20%" stop-color="var(--color-stop-2)" />
      <stop offset="40%" stop-color="var(--color-stop-3)" />
      <stop offset="75%" stop-color="var(--color-stop-4)" />
      <stop offset="100%" stop-color="var(--color-stop-5)" />
    </linearGradient>
    <linearGradient id="gradient-vertical-green" x2="0" y2="1">
      <stop offset="0%" stop-color="var(--color-stop-1)" />
      <stop offset="40%" stop-color="var(--color-stop-2)" />
      <stop offset="65%" stop-color="var(--color-stop-3)" />
      <stop offset="75%" stop-color="var(--color-stop-4)" />
      <stop offset="100%" stop-color="var(--color-stop-5)" />
    </linearGradient>
  </svg>
  <div class="tooltip">
  </div>
</div>
</template>

<script lang="ts">
/* eslint-disable */
// reference---https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript/
import * as d3 from 'd3'
import * as utils from '@/assets/ts/c6'
import dataService from "@/service/dataService"
import AutocompleteBar from '@/components/AutocompleteBar.vue'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
enum StockSituation { high, low }
const stock = namespace('Stock')
const api = "https://www.alphavantage.co/query"
const apikey = "O6K9YK73WIFU2L6B"

interface Meta {
  high: number,
  low: number,
  open: number,
  timestr: string,
  code: string,
  current: number
}
interface Board {
  symbol: string,
  name: string,
  description: string,
  exchange: string,
  currency: string,
  sector: string,
  industry: string,
  address: string,
  employees: string
}
@Component({
  name: 'C6',
  filters: {
    capitalize: function(value: string): string {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  components: {
    AutocompleteBar
  }
})
export default class C6 extends Vue {
  private radio: string = '1'
  private code: string = ''
  private activeSvg: string = '1d'
  private possibilities: string[] = []
  private suggestions: string[] = []
  private svgs: Array < object > = [{
    name: '1 day',
    id: '1d'
  }, {
    name: '5 days',
    id: '5d'
  }, {
    name: '1 month',
    id: '1m'
  }, {
    name: '6 months',
    id: '6m'
  }, {
    name: '1 year',
    id: '1y'
  }]
  private tags: Array < string > = ['open', 'high', 'low']
  @stock.State
  public meta!: Meta
  @stock.State
  public record!: any
  @stock.State
  public overview:any
  @stock.Action
  public updateStock: (a:any)=>void
  get comparison(): string {
    let delta = this.meta.current - this.meta.open
    let symbol = delta > 0 ? '+' : (delta < 0 ? '-' : ' ')
    let valueText = Math.abs(delta).toFixed(2)
    let arrow = delta > 0 ? '↑' : (delta < 0 ? '↓' : '☁')
    let ratio = Math.abs(delta / this.meta.open) * 100
    let ratioText = ratio.toFixed(2) + '%'
    return `${symbol} ${valueText} (${ratioText})${arrow}`
  }
  get flagColor(): string {
    let green = '#009359',
      red = '#f11b11',
      black = '#000000'
    let delta = this.meta.current - this.meta.open
    return delta > 0 ? green : (delta < 0 ? red : black)
  }
  @Watch('code', {
    immediate: true,
    deep: true
  })
  codeChanged(newv: string, oldv: string) {
    if(newv.length < 4) {
      this.possibilities = []
      this.suggestions = []
      return
    }
    let url = `${api}?function=SYMBOL_SEARCH&keywords=${newv}&apikey=${apikey}`
    dataService.get(url)
      .then((res: any) => {
        this.suggestions = res.bestMatches.map((v: any) => {
          return `${v['1. symbol']} (${v['2. name']})`
        })
        this.possibilities = res.bestMatches.map((v: any) => `${v['1. symbol']}`)
    })
      .catch(err => { console.log(err) })
  }
  public plot(): void {
    let status = this.meta.current - this.meta.open > 0 ? StockSituation.high : StockSituation.low
    this.svgs.forEach((v: object) => {
      utils.init(this.record[v.id], `svg_${v.id}`, status)
    })
    d3.selectAll('.mask').classed('active', true)
  }
  public launch(): void {
    console.log(this.code, 'press button')
    if (!this.possibilities.includes(this.code.toUpperCase())) {
      alert('The code you are requesting does not exist :-(.')
      return
    }
    this.possibilities = []
    this.suggestions = []
    let self = this
    dataService.hostGet(this.code).then((data)=>{
      self.updateStock(data)
      self.plot()
    }, (rej) => {
      alert('Failed')
    })
  }
  public renderSvg(): void {
    d3.select('.tooltip').style('visibility', 'hidden')
  }
  mounted() {
    utils.initializeParameter('svg_1d')
    
  }
}
</script>

<style lang="sass">
  $darkgray: #717070
  $gray: #a8a8a8
  $lightgray: #ececec
  $mainred: #fb4040
  $maingreen: #01814f
  #gradient-vertical-red
    --color-stop-1: #ec2929
    --color-stop-2: #f9a199
    --color-stop-3: #ffcbc6
    --color-stop-4: #faedec
    --color-stop-5: #ffffff
  #gradient-vertical-green
    --color-stop-1: #01814f
    --color-stop-2: #4ad7b1
    --color-stop-3: #c6ffd7
    --color-stop-4: #eaffe9
    --color-stop-5: #ffffff
  #c6
    padding: 2vh 3vw
    .title-container
      text-align: left
      margin-bottom: 1vh
    .suggestions
      text-align: left
    .overview
      p
        text-align: left
    .tooltip
      background-color: white
      border-radius: 5px
      position: absolute
      padding: 0.05rem 0.1rem
      visibility: hidden
      font-size: 0.8rem
      text-align: center
      border: 1px solid #b9b9b9
      box-shadow: $gray 1px 1px 5px
    .svg-container
      margin: 0 0
      width: 100%
      height: 40vh
      .stock-value
        opacity: 0
        stroke: black
        stroke-width: 1
        fill: red
        &.active
          opacity: 1
      .stock
        height: 40vh
        width: 100%
        .y-axis
          line
            stroke-width: 1
            stroke: $lightgray
        .x-axis
          line
            stroke: $darkgray
          .domain
            stroke-width: 2
            stroke: $gray
          .tick:nth-last-child(-n + 2)
            text
              text-anchor: end
        .tick-text
          fill: $darkgray
        .bg
          opacity: 0.5
          &[data-type=red]
            fill: url(#gradient-vertical-red)
          &[data-type=green]
            fill: url(#gradient-vertical-green)
        .main-path
          stroke-width: 2
          fill: none
          &[data-type=red]
            stroke: $mainred
          &[data-type=green]
            stroke: $maingreen
        .focus-point
          stroke: none
          &[data-type=red]
            fill: $mainred
          &[data-type=green]
            fill: $maingreen
        
        .mouseline
          stroke-dasharray: 4
          stroke: $darkgray
          stroke-width: 1
    .mask
      opacity: 0
      &.active
        opacity: 1
    .block-container
      width: 100%
      margin: 1vh 0
      border-radius: 0.5vw
      border: 1px solid #b9b9b9
      padding: 2vw
      position: relative
      &:hover
        box-shadow: $gray 1px 1px 5px
      .meta
        position: relative
        text-align: left
        .current
          font-size: 1.5rem
          margin-right: 2vw
          font-weight: bold
        .info
          font-size: 1rem
          position: absolute
          bottom: 0
          display: inline
        .time
          font-size: 0.7rem
          color: $gray
          text-align: left
      .value-container
        margin-top: 2vh
        .value-label
          font-size: 0.9rem
          text-align: left
          flex: 1
          font-weight: bolder
        .value
          font-size: 0.9rem
          text-align: right
    .flex
      display: flex
    .el-tabs__active-bar
      background-color: black
    .el-tabs__item.is-active
      color: black
    .el-tabs__item
      color: $gray
      &:hover
        color: black
</style>
