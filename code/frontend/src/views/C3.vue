<template>
  <div id="c3">
    <div class="tooltip">
    </div>
  <div class="left-wrapper">
    <span class="title"> Collaborations in CSE Dept., HKUST</span>
    <span class="label">Sort by</span>
    <el-radio v-model="radio" label="normal">Random</el-radio>
    <el-radio v-model="radio" label="fullname">Name (A-Z)</el-radio>
    <el-radio v-model="radio" label="degree">#Pubs</el-radio>
    <el-radio v-model="radio" label="collaborator">#Partners</el-radio>
  </div>
    <div>
    <svg id="graph">
    </svg>
  </div>
  </div>
</template>

<script lang="ts">
/* eslint-disable */
import * as d3 from 'd3'
import * as utils from '@/assets/ts/c3'
import { Graph } from '@/assets/ts/types'
import { Component, Vue, Watch } from 'vue-property-decorator'
@Component({name: 'C3'})
export default class C3 extends Vue {
  private radio:string = 'normal'
  @Watch('radio', {immediate: true, deep: true})
  radioChanged () {
    utils.reorderMatrix(this.radio)
  }
  mounted() {
    d3.json('./data/HKUST_coauthor_graph.json').then((data: unknown) => {utils.init(data, 'graph')})
    // d3.json('data/graph.json').then((data: any) => {utils.init(data, 'graph')}) // for development only
  }
}
</script>

<style lang="sass">
  $verydark: #0e4d6c
  $dark: #09809d
  $base: #2db6da
  $light: #9de3f4
  $verylight: #d9fcfe
  $gray: #838383
  #c3
    .el-radio
      margin-right: 10px
    .label
      margin-right: 2vw
    .tooltip
      background-color: $verylight
      border-radius: 5px
      position: absolute
      visibility: hidden
      padding: 0.2rem 1.5rem
      font-size: 0.8rem
      a
        text-decoration: none
        color: black
    .nl-canvas
      .loading
        font-size: 3rem
        text-anchor: middle
      .node-ele
        fill: $light
        stroke: $base
        stroke-width: 0
        &.active
          stroke-width: 2
      .link-ele
        stroke: $gray
        stroke-width: 1
        stroke-opacity: 0.5
        &.active
          stroke-width: 4
    .mt-canvas
      .mt-bg
        fill: $dark
      .inactive-bg
        fill: white
      .label-ele
        fill: black
        &.active
          text-decoration: underline
          font-weight: bold
      .cell-ele
        &.active
          stroke-width: 1
          stroke:$verydark
      .name-horizontal
        .label-ele
          transform: rotate(-60deg)
          text-anchor: start
      .name-vertical
        .label-ele
          text-anchor: end
      .annotation
        fill: black
        text-anchor: start



</style>
