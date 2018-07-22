<template>
  <md-card md-with-hover class='item large-margin-right'>
    <md-card-header>
      <md-layout md-gutter md-vertical-align='start'>
        <div class='icon-box'>
          <i class='icon dimmed' :class='getCurrencyIcon(coin.shortName)'></i>
        </div>

        <md-layout md-column md-gutter>
          <h2 class='md-title'>
            {{ coin.fullName }}
          </h2>

          <h3 class='md-subhead hand-write dimmed'>
            {{ coin.shortName }} / BTC exchange rate
          </h3>
        </md-layout>
      </md-layout>
    </md-card-header>

    <br />

    <md-card-media>
      <transition name='fade'>
        <div class='image'>
          <div id='price-chart-btc' alt="Price chart in BTC"></div>
        </div>
      </transition>
    </md-card-media>
  </md-card>
</template>

<script>
import Highcharts from 'highcharts/highstock'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

import { getIcon } from '../../functions'

export default {
  name: 'price-chart-btc',
  computed: {
    ...mapState(['coin', 'charts', 'balances', 'prices']),
    ...mapState(['fullTime']),
    ...mapGetters(['priceChartBtcData'])
  },
  watch: {
    coin: {
      handler() {
        this.chartHandler()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations(['showError']),
    ...mapActions(['updatePriceChartBtcDataAction', 'updateChartAction']),
    getCurrencyIcon(name) {
      return getIcon(name)
    },
    chartHandler() {
      this.updatePriceChartBtcDataAction()
        .then(() =>
          this.updateChartAction({
            chartName: 'priceChartBtc',
            chartElem: this.plotPriceChart(this.priceChartBtcData)
          })
        )
        .catch(e => {
          this.showError()
          console.error(e)
        })
    },
    plotPriceChart(data) {
      const ohlc = []
      const volume = []

      data.forEach(row => {
        ohlc.push([row.date, row.open, row.high, row.low, row.close])

        const roundVolume = Math.ceil(row.volume)

        volume.push([row.date, roundVolume])
      })

      const chartOptions = {
        chart: {
          animation: false,
          plotBorderWidth: 0,
          backgroundColor: 'transparent',
          style: {
            cursor: 'pointer',
            fontFamily: 'Roboto, "Noto Sans", Noto, sans-serif;',
            fontStyle: 'normal'
          },
          // pinchType: 'none',
          // zoomType: 'none',
          // panning: true,
          events: {
            load: function() {
              // set up the updating of the chart each second
              // var series = this.series[0];
              // setInterval(function () {
              //     var x = (new Date()).getTime(), // current time
              //         y = Math.round(Math.random() * 100);
              //     series.addPoint([x, y], true, true);
              // }, 1000);
            }
          }
        },
        colors: [
          '#4DD0E1',
          '#0d233a',
          '#8bbc21',
          '#910000',
          '#4DD0E1',
          '#4DD0E1',
          '#f28f43',
          '#4DD0E1',
          '#c42525',
          '#a6c96a'
        ],
        rangeSelector: {
          selected: this.charts.priceChartBtc.selectedRange,
          inputEnabled: false,
          inputBoxBorderColor: 'none',
          buttons: [
            {
              count: 1,
              type: 'month',
              text: '1 M'
            },
            {
              count: 3,
              type: 'month',
              text: '3 M'
            },
            {
              count: 6,
              type: 'month',
              text: '6 M'
            },
            {
              type: 'all',
              text: '1 Y'
            }
          ],
          buttonTheme: {
            fill: 'transparent',
            stroke: 'none',
            'stroke-width': 0,
            r: 0,
            cursor: 'pointer',
            style: {
              color: '#9E9E9E',
              fontWeight: 'normal'
            },
            states: {
              hover: {
                fill: 'transparent',
                stroke: '#B2EBF2',
                'vector-effect': 'non-scaling-stroke',
                'stroke-dasharray': '0, 54, 32, 24',
                'stroke-width': 4,
                'stroke-linecap': 'butt',
                style: {
                  color: '#9E9E9E',
                  fontWeight: 'normal'
                }
              },
              select: {
                fill: 'transparent',
                stroke: '#B2EBF2',
                'vector-effect': 'non-scaling-stroke',
                'stroke-dasharray': '0, 54, 32, 24',
                'stroke-width': 4,
                'stroke-linecap': 'butt',
                style: {
                  color: '#9E9E9E',
                  fontWeight: 'normal'
                }
              },
              disabled: {
                opacity: 0.5,
                fill: 'transparent',
                stroke: 'none',
                cursor: 'default',
                style: {
                  color: '#9E9E9E',
                  fontWeight: 'normal'
                }
              }
            }
          }
        },

        tooltip: {
          followTouchMove: true,
          // backgroundColor: 'rgba(255,255,255,0.85)',
          // style: {
          // color: '#9E9E9E',
          // fontSize: '10px',
          // padding: '10px',
          // },
          padding: 0,
          borderWidth: 0,
          // borderRadius: 2,
          shadow: false,
          enabled: true,
          shared: true,
          useHTML: true,

          formatter: function() {
            let points = this.point ? Highcharts.splat(this.point) : this.points
            let point = points[0]
            let each = Highcharts.each

            let txt = '<div class="tooltip">'

            txt += `<span style='line-height: 19px' class='hand-write'><b>${Highcharts.dateFormat(
              '%e %b %Y',
              point.x
            )}, </b>${Highcharts.dateFormat('%A', point.x)}</span>`

            each(points, (p, i) => {
              if (p.point && p.point.close) {
                txt += `
                  <br/>
                  <span class='font-size-7'>
                    <span>
                      <i style='color: ${p.color}' class='material-icons'>lens</i> <b>${p
                  .series.name}:</b> ${p.point.close}
                    </span>                  
                `
              } else {
                txt += `
                    <br />
                    <span>
                      <i style='color: ${p.color}' class='material-icons'>lens</i> <b>${p
                  .series.name}:</b> ${p.y}
                    </span>
                  </span>
                `
              }
            })

            return txt + '</div>'
          }
        },

        scrollbar: { enabled: false },
        credits: { enabled: false },
        navigator: {
          enabled: false
        },
        xAxis: [
          {
            type: 'datetime',
            lineWidth: 0,
            gridLineWidth: 0,
            labels: {
              useHTML: true,
              style: {
                color: '#9E9E9E'
              }
            },
            events: {
              setExtremes: e => {
                if (typeof e.rangeSelectorButton !== 'undefined') {
                  let selected

                  switch (e.rangeSelectorButton.type) {
                    case 'month': {
                      if (e.rangeSelectorButton.count == 1)
                        this.charts.priceChartBtc.selectedRange = 0
                      if (e.rangeSelectorButton.count == 3)
                        this.charts.priceChartBtc.selectedRange = 1
                      if (e.rangeSelectorButton.count == 6)
                        this.charts.priceChartBtc.selectedRange = 2

                      return
                    }
                    case 'all': {
                      this.charts.priceChartBtc.selectedRange = 3
                    }
                  }
                }
              }
            }
          },
          {
            type: 'datetime',
            lineWidth: 0,
            gridLineWidth: 0,
            useHTML: true,
            labels: {
              style: {
                color: '#9E9E9E'
              }
            }
          }
        ],
        yAxis: [
          {
            gridLineColor: '#EEEEEE',
            gridLineWidth: 1,
            useHTML: true,
            labels: {
              align: 'right',
              x: -3,
              style: {
                fontFamily: "'Courgette', cursive",
                cursor: 'pointer',
                stroke: 'none',
                color: 'rgba(0,0,0,0.2)',
                fontSize: 'initial',
                fontWeight: 'bold'
              }
            },
            height: '80%'
          },
          {
            labels: {
              enabled: false
            },
            top: '80%',
            height: '20%',
            offset: 0
          }
        ],
        series: [
          {
            type: 'ohlc',
            name: `Price in BTC`,
            data: ohlc,
            lineWidth: 2,
            lineColor: '#4DD0E1',
            color: '#4DD0E1',
            fill: 'none'
          },
          {
            type: 'column',
            name: `Volume in BTC`,
            data: volume,
            yAxis: 1,
            color: '#CFD8DC',
            borderWidth: 0
          }
        ],
        plotOptions: {
          candlestick: {
            upColor: '#fff',
            upLineColor: '#4DD0E1'
          },
          series: {
            dataGrouping: {
              enabled: false
            },
            cropThreshold: 0
          }
        }
      }

      Highcharts.setOptions({
        global: {
          useUTC: false
        },
        lang: {
          rangeSelectorZoom: ''
        }
      })

      // Create the chart
      const StockChart = Highcharts.stockChart
      return new StockChart('price-chart-btc', chartOptions)
    }
  },
  mounted() {
    this.chartHandler()
  }
}
</script>
<style scoped>
#price-chart {
  height: 325px;
}

.icon-box {
  width: 48px;
  height: 48px;
  line-height: 48px;
  margin-right: 24px;
}

.icon {
  font-size: 48px;
  line-height: 48px;
}
</style>
