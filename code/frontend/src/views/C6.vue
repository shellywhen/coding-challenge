<template>
<div id="c6">
  <div class="tooltip">
  </div>
  <div class="title-container">
    <span class="title">Stock Market Tracker</span>
    <!-- <el-radio v-model="radio" label="1">Max</el-radio>
    <el-radio v-model="radio" label="2">Min</el-radio> -->
  </div>
  <el-row :gutter="5">
    <el-col :span="4">
      <div class="grid-content bg-purple">
        <el-input size="mini" v-model="code" placeholder="Stock Code">
        </el-input>
      </div>
    </el-col>
    <el-col :span="1">
      <div class="grid-content bg-purple">
        <el-button type="primary" plain size="mini" @click="launch">Search 👀</el-button>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="12">
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
        <div class="svg-container">
          <el-tabs v-model="activeSvg" @tab-click="renderSvg">
            <el-tab-pane v-for="item in svgs" :key="item.id" :label="item.name" :name="item.id">
            </el-tab-pane>
       </el-tabs>
        <svg class="stock"></svg>
        </div>
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
</div>
</template>

<script lang="ts">
/* eslint-disable */
// reference---https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript/
import * as d3 from 'd3'
import * as utils from '@/assets/ts/c6.ts'
import dataService from "@/service/dataService.ts"
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
    capitalize: function(value: string):string{
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
})
export default class C6 extends Vue {
  private radio: string = '1'
  private code: string = ''
  private activeSvg: string = '1d'
  private svgs: Array<object> = [{
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
  private tags: Array<string> = ['open', 'high', 'low']
  private meta: Meta = {
    high: -1,
    low: -1,
    open: -1,
    timestamp: 'Loading',
    code: '?',
    current: 0
  }
  get comparison(): string {
    let delta =  this.meta.current - this.meta.open
    let symbol = delta > 0 ? '+' : (delta < 0 ? '-' : ' ')
    let valueText = Math.abs(delta).toFixed(2)
    let arrow =  delta > 0 ? '↑' : (delta < 0 ? '↓' : '☁')
    let ratio = Math.abs(delta / this.meta.open) * 100
    let ratioText = ratio.toFixed(2) + '%'
    return `${symbol} ${valueText} (${ratioText})${arrow}`
  }
  get flagColor(): string {
    let green = '#009359', red = '#f11b11', black='black'
    let delta =  this.meta.current - this.meta.open
    return delta > 0 ? green : (delta < 0 ? red : black)
  }
  @Watch('code', {immediate: true, deep: true})
    codeChanged(newv: string, oldv: string) {
      console.log(newv, oldv)
    }
  public launch():void {
    console.log(this.code, 'check')
    dataService.get(this.code)
  }
  public renderSvg():void {
    console.log('render', this.activeSvg)
  }
  @user.State
    public name!: string

  @user.Getter
    public nameUpperCase!: string

  @user.Action
    public updateName!: (newName: string) => void
}
</script>

<style lang="sass">
  $gray: #a8a8a8
  $lightgray: #e0e0e0
  #c6
    padding: 2vh 3vw
    .title-container
      text-align: left
      margin-bottom: 1vh
    .tooltip
      background-color: white
      border-radius: 5px
      position: absolute
      visibility: hidden
      padding: 0.2rem 1.5rem
      font-size: 1rem
    .svg-container
      margin: 0 0
      width: 100%
      .stock
        height: 40vh
        width: 100%
    .mask
      opacity: 0
      &.active
        opacity: 1
    .block-container
      width: 100%
      margin: 1vh 0
      border-radius: 0.5vw
      border: 1px solid $lightgray
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
</style>
