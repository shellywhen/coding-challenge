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
          </div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <el-button type="info" plain size="mini" @click="launch">Search 👀</el-button>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="14" style="margin-top: 8vh">
      <div class="block-container">
        <div class="mask active">
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
              <div class="time">{{meta.timestamp}}</div>
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
      <stop offset="20%" stop-color="var(--color-stop-2)" />
      <stop offset="40%" stop-color="var(--color-stop-3)" />
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
import * as utils from '@/assets/ts/c6.ts'
import dataService from "@/service/dataService.ts"
import AutocompleteBar from '@/components/AutocompleteBar.vue'
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
const user = namespace('user')
interface Meta {
  high: number,
    low: number,
    open: number,
    timestamp: string,
    code: string,
    current: number
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
    name: 'YTD',
    id: 'ytd'
  }, {
    name: '1 year',
    id: '1y'
  }, {
    name: '5 years',
    id: '5y'
  }, {
    name: 'MAX',
    id: 'max'
  }]
  private tags: Array < string > = ['open', 'high', 'low']
  private meta: Meta = {
    high: -1,
    low: -1,
    open: -1,
    timestamp: 'Loading',
    code: '?',
    current: 0
  }
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
    console.log(newv, oldv)
  }
  @user.State
  public name!: string
  @user.Getter
  public nameUpperCase!: string
  @user.Action
  public updateName!: (newName: string) => void

  public launch(): void {
    console.log(this.code, 'press button')
    dataService.hostGet(this.code)
  }
  public renderSvg(): void {
    d3.select('.tooltip').style('visibility', 'hidden')
    console.log('render', this.activeSvg)
  }
  mounted() {
    utils.initializeParameter('svg_1d')
    let toy = [{
      time: '2020-01-01',
      value: 3
    }, {
      time: '2020-01-02',
      value: 1
    }, {
      time: '2020-01-03',
      value: 8
    }, {
      time: '2020-01-04',
      value: 5
    }]
    utils.init(toy, 'svg_1d')
  }
}
</script>

<style lang="sass">
  $darkgray: #717070
  $gray: #a8a8a8
  $lightgray: #ececec
  $main: #fb4040
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
          fill: url(#gradient-vertical-red)
          opacity: 0.5
        .main-path
          stroke: $main
          stroke-width: 2
          fill: none
        .focus-point
          stroke: none
          fill: $main
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
