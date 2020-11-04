/* eslint-disable */
import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const dataServerUrl = 'http://127.0.0.1:12050/'
const prefix = 'query/'
const $http = (Vue as any).http

function get(field: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${dataServerUrl}${prefix}` + field
    $http.get(url).then(
      (response: any) => {
        console.log('promise resolve: ' + field, response)
        resolve(response.data)
      },
      (errResponse: any) => {
        console.log('promise reject: ' + field)
        reject(errResponse)
      }
    );
  });
}

function post(field: string, payload: any, resolvefunc: any = ()=>''): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = `${dataServerUrl}/` + field
    $http.post(url, payload).then(
      (response: any) => {
        resolve(response.data)
        resolvefunc()
      },
      (errResponse: any) => {
        reject(errResponse)
      }
    )
  })
}

export default {
  get,
  post
}
