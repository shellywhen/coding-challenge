<template>
  <div id="c2">
    <div class="tooltip">
    </div>
  <div class="left-wrapper">
    <span class="title"> Daily Temperature of Hong Kong</span>
    <el-radio v-model="radio" label="1">Max</el-radio>
    <el-radio v-model="radio" label="2">Min</el-radio>
  </div>
    <div>
    <svg id="heatmap">
    </svg>
  </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import * as d3 from 'd3'
import * as utils from '@/assets/ts/c2.ts'
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({name: 'C2'})
export default class C2 extends Vue {
  private radio:string = '1'
  @Watch('radio', { immediate: true, deep: true })
  radioChanged (): void {
    utils.changeMode()
  }
  mounted (): void {
    d3.csv('./data/temperature_daily.csv').then((data: any) => utils.init(data, 'heatmap'))
  }
}
</script>

<style lang="sass">
  #c2
    .tooltip
      background-color: white
      border-radius: 5px
      position: absolute
      visibility: hidden
      padding: 0.2rem 1.5rem
      font-size: 1rem
</style>
