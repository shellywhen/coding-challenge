/* eslint-disable */
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

@Module({ namespaced: true })
class Stock extends VuexModule {
  public meta = {
    high: 0,
    low: -1,
    open: -1,
    timestr: 'Loading',
    code: '?',
    current: 0
  }
  public record = {}
  public overview = {}
  @Mutation
  public setMeta(newMeta: any): void {
    this.meta = newMeta
  }
  @Mutation
  public setRecord(newRecord: any): void {
    this.record = newRecord
  }
  @Mutation
  public setOverview(newOverview: any): void {
    this.overview = newOverview
  }
  @Action({ rawError: true })
  public updateStock(response: any): void {
    this.context.commit('setMeta', response.meta)
    this.context.commit('setRecord', response.data)
    this.context.commit('setOverview', response.overview)
  }
}
export default Stock