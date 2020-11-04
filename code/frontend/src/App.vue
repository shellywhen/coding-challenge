<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/c1">Challenge 1</router-link>
      |
      <router-link to="/c2">Challenge 2</router-link>
      |
      <router-link to="/c3">Challenge 3</router-link>
      |
      <router-link to="/c6">Challenge 6</router-link>
      |
      <a href="https://github.com/HKUST-VISLab/coding-challenge" target="_blank">About</a>

    </div>
    <router-view/>
  </div>
</template>

<style lang="sass">
#app
  font-family: '微软雅黑', Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50
#nav
  a
    font-weight: normal
    color: #c8c9ca
    text-decoration: none
    &.router-link-exact-active
      color: #b1b1af
      font-weight: bold
      text-decoration: underline
.title
  font-size: 1.5rem
  margin-right: 3vw
  font-weight: bold
.left-wrapper
  text-align: left
  margin-top: 3vh
  margin-bottom: 2vh
  padding-left: 9vw
.tick-text
  font-size: 0.8rem
  font-family: '微软雅黑', Avenir, Helvetica, Arial, sans-serif
</style>
