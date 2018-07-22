<template>
  <md-card class='item large-margin-right'>
    <md-card-header>
      <md-layout md-flex md-gutter md-vertical-align='start'>
        <md-layout class='flex1'>
          <div class='icon-box'>
            <i class='icon icon-balance dimmed' :class='getCurrencyIcon(coin.shortName)'></i>
          </div>

          <md-layout md-column md-gutter>
            <h2 class='md-title'>
              {{ coin.fullName }}
            </h2>

            <h3 class='md-subhead hand-write dimmed'>
              balance chart in {{ isBtcRate ? 'BTC' : 'USDT'}}
            </h3>
          </md-layout>
        </md-layout>

        <md-layout md-align='end' md-flex="20">
          <md-switch :value='isBalanceChart' @change='switchPortfolioAction' id='chart-switcher' class='md-primary'></md-switch>
        </md-layout>
      </md-layout>
    </md-card-header>

    <br />
    
    <md-card-media>
      <div class='image'>
        <div id='balance-chart' alt='Balance chart'></div>
      </div>
    </md-card-media>
  </md-card>
</template>

<script>
import Highcharts from 'highcharts/highstock'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { getIcon } from './functions'

export default {
  name: 'balance-chart',
  watch: {
    coin: {
      handler() {
        this.balanceChartHandler()
      },
      deep: true
    },
    isBtcRate: {
      handler() {
        this.balanceChartHandler()
      }
    }
  },
  computed: {
    ...mapState(['coin', 'charts', 'isBalanceChart', 'isBtcRate']),
    ...mapGetters(['balanceChartData'])
  },
  methods: {
    ...mapMutations(['showError', 'switchRate']),
    ...mapActions([
      'switchPortfolioAction',
      'updateChartAction',
      'updateBalanceChartDataAction'
    ]),
    getCurrencyIcon(name) {
      return getIcon(name)
    },
    updateBalanceChart() {
      this.updateChartAction({
        chartName: 'balanceChart',
        chartElem: this.plotBalanceChart(this.balanceChartData)
      })
    },
    balanceChartHandler() {
      this.updateBalanceChartDataAction()
        .then(() => this.updateBalanceChart())
        .catch(e => {
          this.showError()
          console.error(e)
        })
    },
    plotBalanceChart(data) {
      const volumeInUsdt = []
      const volumeInBtc = []
      const volume = []

      data.forEach(row => {
        volumeInUsdt.push([
          row.date, // the date
          Math.ceil(row.volumeInUsdt * 100000000) / 100000000
        ])

        volumeInBtc.push([
          row.date, // the date
          Math.ceil(row.volumeInBtc * 100000000) / 100000000
        ])

        volume.push([
          row.date, // the date
          Math.ceil(row.volume * 100000000) / 100000000
        ])
      })

      const chartOptions = {
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
          selected: 0,
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
          followTouchMove: false,
          backgroundColor: 'rgba(255,255,255,0.85)',
          style: {
            color: '#9E9E9E',
            fontSize: '10px'
          },
          borderWidth: 0,
          borderRadius: 2,
          shadow: true,
          enabled: true,
          shared: true,
          useHTML: true,

          formatter: function() {
            let points = this.point ? Highcharts.splat(this.point) : this.points
            let point = points[0]
            let each = Highcharts.each

            let txt = '<div class="tooltip">'

            txt += `<span style="line-height: 19px; font-family: 'Courgette', cursive;"><b>${Highcharts.dateFormat(
              '%e %b %Y',
              point.x
            )}, </b>${Highcharts.dateFormat('%A', point.x)}</span>`

            each(points, (p, i) => {
              txt +=
                `<span class='font-size-7'><span style="color: ${p.color}">` +
                `<br><i class='material-icons'>lens</i></span> <b>${p.series
                  .name}:</b> ${p.y}</span>`
            })

            return txt + '</div>'
          }
        },
        scrollbar: { enabled: false },
        credits: { enabled: false },
        navigator: {
          enabled: false,
          maskFill: 'rgba(77 , 208, 225, 0.08)',
          series: {
            lineWidth: 1,
            lineColor: '#4DD0E1',
            fillColor: '#E0F7FA'
          }
        },
        xAxis: [
          {
            className: 'x-axis-price',
            lineWidth: 0,
            gridLineWidth: 0,
            useHTML: true,
            labels: {
              style: {
                color: '#9E9E9E'
              }
            }
          },
          {
            className: 'x-axis-volume',
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
                cursor: 'pointer',
                fontFamily: "'Courgette', cursive",
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
            type: 'area',
            lineWidth: 1,
            fillColor: '#b7ecf3',
            name: this.isBtcRate ? 'Volume in BTC' : 'Volume in USDT',
            data: this.isBtcRate ? volumeInBtc : volumeInUsdt
          },
          {
            type: 'area',
            name: `Volume in ${this.coin.shortName}`,
            data: volume,
            yAxis: 1,
            color: '#CFD8DC',
            borderWidth: 0
          }
        ],
        plotOptions: {
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
        },
        chart: {
          plotBorderWidth: 0,
          backgroundColor: 'transparent',
          style: {
            fontFamily: 'Roboto, "Noto Sans", Noto, sans-serif;',
            fontStyle: 'normal'
          }
        }
      })

      // Create the chart
      const StockChart = Highcharts.stockChart
      return new StockChart('balance-chart', chartOptions)
    }
  },
  mounted() {
    this.balanceChartHandler()
  }
}
</script>
<style scoped>
.icon-box {
  width: 48px;
  height: 48px;
  line-height: 48px;
  margin-right: 24px;
}

.icon-balance {
  width: 48px;
  height: 48px;
  line-height: 48px;
  font-size: 48px;
  margin-right: 10px;
}

#balance-chart {
  height: 325px;
}
</style>
