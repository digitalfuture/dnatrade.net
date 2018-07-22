<template>
  <md-card md-with-hover class='item large-margin-right'>
    <md-card-header>
      <md-layout md-flex md-gutter md-vertical-align='start'>
        <md-layout class='flex-1'>
          <div class='icon-box'>
            <md-icon class='icon dimmed icon-portfolio'>blur_on</md-icon>
          </div>

          <md-layout md-column md-gutter md-vertical-align='start'>
            <h2 class='md-title'>
              Portfolio
            </h2>

            <h3 class='md-subhead hand-write dimmed'>
              <span class='dimmed'></span> balance in {{ isBtcRate ? 'BTC' : 'USD'}}
            </h3>
          </md-layout>
        </md-layout>

        <md-layout md-align='end' md-flex="20">
          <md-switch :value='isBalanceChart' @change='switchPortfolio' class='md-primary'></md-switch>
        </md-layout>
      </md-layout>
    </md-card-header>
    
    <br />

    <md-card-media>
      <div class='image'>
        <div id='portfolio-chart' alt='Portfolio chart'></div>
      </div>
    </md-card-media>
  </md-card>
</template>

<script>
import Highcharts from 'highcharts/highstock'

import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'portfolio-chart',
  watch: {
    isBtcRate: {
      handler() {
        this.updatePortfolioChart()
      }
    }
  },
  computed: {
    ...mapState(['isBtcRate', 'charts']),
    ...mapGetters(['portfolioChartData', 'balanceChartData'])
  },
  methods: {
    ...mapActions(['updateChartAction', 'updatePortfolioChartDataAction']),
    ...mapMutations(['switchPortfolio']),
    updatePortfolioChart() {
      this.updateChartAction({
        chartName: 'portfolioChart',
        chartElem: this.plotPortfolioChart(this.portfolioChartData)
      })
    },
    plotPortfolioChart(data) {
      const volumeInBtc = []
      const volumeInUsdt = []

      data.forEach(row => {
        volumeInBtc.push([
          row.date,
          Math.ceil(row.volumeInBtc * 100000000) / 100000000
        ])

        volumeInUsdt.push([
          row.date,
          Math.ceil(row.volumeInUsdt * 100000000) / 100000000
        ])
      })

      const chartOptions = {
        chart: {
          resetZoomButton: {
            theme: {
              display: 'none'
            }
          },
          animation: true,
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
          selected: this.charts.portfolioChart.selectedRange,
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
          //   color: '#9E9E9E',
          //   fontSize: '10px',
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
            },
            events: {
              setExtremes: e => {
                if (typeof e.rangeSelectorButton !== 'undefined') {
                  let selected

                  switch (e.rangeSelectorButton.type) {
                    case 'month': {
                      if (e.rangeSelectorButton.count == 1)
                        this.charts.portfolioChart.selectedRange = 0
                      if (e.rangeSelectorButton.count == 3)
                        this.charts.portfolioChart.selectedRange = 1
                      if (e.rangeSelectorButton.count == 6)
                        this.charts.portfolioChart.selectedRange = 2

                      return
                    }
                    case 'all': {
                      this.charts.portfolioChart.selectedRange = 3
                    }
                  }
                }
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
            gridLineWidth: 0,
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
            name: this.isBtcRate ? 'Volume in BTC' : 'Volume in USD',
            data: this.isBtcRate ? volumeInBtc : volumeInUsdt
          },
          {
            type: 'area',
            name: !this.isBtcRate ? 'Volume in BTC' : 'Volume in USD',
            data: !this.isBtcRate ? volumeInBtc : volumeInUsdt,
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
        }
      })

      // Create the chart
      const StockChart = Highcharts.stockChart
      return new StockChart('portfolio-chart', chartOptions)
    }
  },
  mounted() {
    this.updatePortfolioChart()
  }
}
</script>
<style scoped>
.icon-box {
  width: 48px;
  height: 48px;
  /* line-height: 48px; */
  margin-right: 24px;
}

.icon-portfolio {
  /* margin-top: 5px; */
  font-size: 56px;
}

#portfolio-chart {
  height: 325px;
}
</style>
