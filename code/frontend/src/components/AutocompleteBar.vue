<template>
  <div>
    <v-app>
    <v-autocomplete
        v-model="text"
        label="Stock Code"
        :items="items"
        :search-input.sync = "search"
        :outlined="outline"
        :dense="outline"
        placeholder="Start Typing to Search"
        color="white"
      ></v-autocomplete>
    </v-app>
  </div>

</template>

<script lang="ts">
/* eslint-disable */
import { Component, Vue, Watch, Prop } from 'vue-property-decorator'
import dataService from "@/service/dataService.ts"
const api = "https://www.alphavantage.co/query"
const apikey = "O6K9YK73WIFU2L6B"

@Component({name: 'AutocompleteBar'})
export default class AutocompleteBar extends Vue {
  private text: string = ''
  private outline: boolean = true
  private items: string[] = []
  private isLoading: boolean = false
  private search: string = ''
  mounted (): void {
  }
  @Watch('search', {immediate: true, deep: true})
    searchChanged(newv: string, oldv: string): void {
      console.log(newv, oldv, 'hi')
      if (newv === '') return
      if (this.isLoading) return             // items have already been requested
      this.isLoading = true
      let url = `${api}?function=SYMBOL_SEARCH&keywords=${newv}&apikey=${apikey}`
      dataService.get(url)
        .then((res: any) => {
          this.items = res.bestMatches.map((v: any) => {
            return `${v['1. symbol']} (${v['2. name']})`
          })
          console.log(this.items)
      })
        .catch(err => { console.log(err) })
        .finally(() => (this.isLoading = false))
  }
}

</script>

<style lang="sass">
  .v-list
    padding: 0 0
  .v-list-item__content
    padding: 0
</style>
