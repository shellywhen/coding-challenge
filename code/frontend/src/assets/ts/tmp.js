{
data() {
  return {
    radio: '1',
    code: '',
    activeSvg: '1d',
    svgs: [{
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
    }],
    tags: ['open', 'high', 'low'],
    meta: {
      high: -1,
      low: -1,
      open: -1,
      timestamp: 'Loading',
      code: '?',
      current: 0
    }
  }
},
computed: {
  comparison() {
    let delta =  this.meta.current - this.meta.open
    let symbol = delta > 0 ? '+' : (delta < 0 ? '-' : ' ')
    let valueText = Math.abs(delta).toFixed(2)
    let arrow =  delta > 0 ? '↑' : (delta < 0 ? '↓' : '☁')
    let ratio = Math.abs(delta / this.meta.open) * 100
    let ratioText = ratio.toFixed(2) + '%'
    return `${symbol} ${valueText} (${ratioText})${arrow}`
  },
  flagColor() {
    let green = '#009359', red = 'rgb(241,27,17)', black='black'
    let delta =  this.meta.current - this.meta.open
    return delta > 0 ? green : (delta < 0 ? red : black)
  }
},
filters: {
  capitalize: function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
},
watch: {
  code(oldv: string, newv: string) {
    console.log(oldv, newv)
  },

},
mounted() {},
methods: {
  launch() {
    console.log(this.code, 'check')
  },
  renderSvg() {

  }
}
}
