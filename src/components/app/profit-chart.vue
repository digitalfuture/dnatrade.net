<template>
  <md-card class='item large-margin-left small-margin-top' >
    <md-card-header>
      <md-layout md-flex>
        <md-layout md-flex md-gutter md-vertical-align='start'>
          <div class='icon-box'>
            <md-icon class='icon dimmed icon-profit'>trending_up</md-icon>
          </div>

          <md-layout md-column md-gutter md-vertical-align='start'>
            <h2 class='md-title'>
              Profit
            </h2>

            <h3 class='md-subhead hand-write dimmed'>
              in {{ isBtcRate ? 'BTC' : 'USDT'}}
            </h3>
          </md-layout>
        </md-layout>
        
        <md-layout md-flex v-if='!isBalanceChart' md-vertical-align='center' md-align='center'>
          <h2 v-if='isBtcRate' class='md-title light hand-write profit-info'>
            {{ profitInBtc.sign + profitInBtc.value }}
          </h2>
          <h2 v-if='!isBtcRate' class='md-title light hand-write profit-info'>
            {{ profitInUsdt.sign + profitInUsdt.value }}
          </h2>
        </md-layout>
      </md-layout>
    </md-card-header>

    <br />

    <md-card-media>
      <div class='image'>
        <div id='profit-chart' alt='Profit chart'></div>
      </div>
    </md-card-media>
  </md-card>
</template>

<script>
import Highcharts from 'highcharts/highstock'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'profit-chart',
  watch: {
    balanceChartData: {
      handler() {
        this.updateProfitChart()
      }
    },
    isBtcRate: {
      handler() {
        this.updateProfitChart()
      }
    }
  },
  computed: {
    ...mapState(['isBtcRate']),
    ...mapGetters(['profitChartData', 'balanceChartData']),
    profitInBtc() {
      const last = this.profitChartData[this.profitChartData.length - 1]
      const value = Math.ceil(last.profitInBtc * 100000000) / 100000000
      const sign = last.profitInBtc < 0 ? '' : '+'

      return { value, sign }
    },
    profitInUsdt() {
      const last = this.profitChartData[this.profitChartData.length - 1]
      const value = Math.ceil(last.profitInUsdt * 100) / 100
      const sign = last.profitInUsdt < 0 ? '' : '+'

      return { value, sign }
    }
  },
  methods: {
    ...mapActions(['updateProfitChartDataAction', 'updateChartAction']),
    updateProfitChart() {
      this.updateProfitChartDataAction().then(() =>
        this.updateChartAction({
          chartName: 'profitChart',
          chartElem: this.plotProfitChart(this.profitChartData)
        })
      )
    },
    plotProfitChart(data) {
      const profitInBtc = []
      const profitInUsdt = []

      data.forEach(row => {
        profitInBtc.push([
          row.date,
          Math.ceil(row.profitInBtc * 100000000) / 100000000
        ])

        profitInUsdt.push([
          row.date,
          Math.ceil(row.profitInUsdt * 100000000) / 100000000
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
              txt += `
                  <span class='font-size-7'>
                    <span style="color: ${p.color}">
                      <br>
                      <i class='material-icons'>lens</i>
                    </span> <b>${p.series.name}:</b> ${p.y}
                  </span>
                `
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
            useHTML: true,
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
            lineColor: '#4DD0E1',
            fillColor: '#b7ecf3',
            name: this.isBtcRate ? 'Profit in BTC' : 'Profit in USDT',
            data: this.isBtcRate ? profitInBtc : profitInUsdt
          },
          {
            type: 'area',
            name: !this.isBtcRate ? 'Profit in BTC' : 'Profit in USDT',
            data: !this.isBtcRate ? profitInBtc : profitInUsdt,
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
        lang: {
          rangeSelectorZoom: ''
        },
        chart: {
          plotBorderWidth: 0,
          backgroundColor: 'transparent',
          style: {
            cursor: 'pointer',
            fontFamily: 'Roboto, "Noto Sans", Noto, sans-serif;',
            fontStyle: 'normal'
          }
        }
      })

      // Create the chart
      const StockChart = Highcharts.stockChart
      return new StockChart('profit-chart', chartOptions)
    }
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

.icon-profit {
  margin-top: 5px;
  font-size: 56px;
}

#profit-chart {
  height: 325px;
}
</style>
