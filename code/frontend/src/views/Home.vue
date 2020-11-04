<template>
  <div>
  <div class="block">
 <span class="demonstration"></span>
 <el-carousel trigger="click" height="70vh">
   <el-carousel-item class="display-item" v-for="item in 4"
   :key="item"
   :style="{
     'background-image': 'url(' + item + '.png)'
     }">
     <div class="shadow"></div>
     <!-- <h3 class="small">{{ item }}</h3> -->
   </el-carousel-item>
 </el-carousel>
</div>
  <div class="wrapper">

  <h1 class="bigtitle"> Welcome to Shelly's Vis Code Challenge :)</h1>
</div>
</div>
</template>

<style lang="sass" scoped>
.block
  margin-top: 5vh
.el-carousel__item
  h3
    color: #475669
    font-size: 14px
    opacity: 0.75
    line-height: 150px
    margin: 0
  // :nth-child(2n)
  //   background-color: #99a9bf
  // :nth-child(2n+1)
  //   background-color: #d3dce6
.display-item
   background-position: center center
   background-size: contain
   background-color: white
   background-repeat: no-repeat
   background-blend-mode: multiply, luminosity
   opacity: 1
   .shadow
     height: 100%
     width: 100%
     background-image: radial-gradient(farthest-corner at 40px 40px, #f10b80 0%, #5201e7 100%)
     //background-blend-mode: multiply, luminosity
     opacity: 0.1
</style>
