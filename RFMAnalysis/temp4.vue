<template>
  <div class="wrapper">
    <div class="traffic-title sr-heading-3">
      {{title}}
    </div>
    <v-layout row>
      <v-layout column>
        <div class="pie-chart">
          <div class="chart-container">
            <sr-donutchart :type="type" :chartData2="chartData2" :height="100" :width="100"></sr-donutchart>
          </div>
          <!-- <div class="legend-container">
            <div v-for="(item, index) in chartData" class="legend-container__item">
              <div style="transform: translateX(25px);" class="legend-container__legend" :style="{ 'background': getColor(index) }"></div>
              <div style="transform: translateX(25px);" class="legend-container__text">
                {{$t(item.name.toLowerCase())}}
                <div class="sr-heading-2 sr-normal">
                  <p style="transform: translateX(-18px);text-align: center; margin-top:2px;">{{$tnf(item.value)}}</p>
                  <sr-compare style="transform: translateX(-15px);" :growth="item.growth" :percentage="item.percentage"></sr-compare>
                </div>
              </div>
            </div>
          </div> -->
        </div>
      </v-layout>
      <v-layout column>
        <div class="barline-chart">
          <sr-barlinechart :chartData="chartData" :config="chartConfig"></sr-barlinechart>
          <div class="button-container">
            <sr-timetype :avgEnable="avgEnable" :timeType="timeType" v-on="$listeners"></sr-timetype>
            <sr-switchbutton :legalType="typeList" :type="type" v-on="$listeners"></sr-switchbutton>
          </div>
        </div>
      </v-layout>
    </v-layout>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import * as _ from 'lodash';
import { PercentData, CardData } from '@/utility/trafficInterface';
import { SIX_COLOR, RECTANGLE_ICON, THREE_COLOR, TWO_COLOR, genToolIcon, TRAFFIC_YAXIS_PERCENT, enableAvgFormat } from '@/utility';

@Component
export default class Temp4 extends Vue {
  @Prop() public type!: string;
  @Prop() public title!: string;
  @Prop() public chartData!: CardData;
  @Prop() public timeType!: string;
  @Prop() public avgEnable!: boolean;
  @Prop() public typeList!: string[];
  get chartData2(): any {
    return this.chartData2.map((item) => {
      return {
        value: item.value,
        name:  item.name
      };
    });
  }
  get chartConfig(): object {
    switch (this.type) {
      case 'total':
        const totalResult: object = {
          color: [...TWO_COLOR, '#32DBC6'],
          legend: {
            bottom: '5%'
          },
          xAxis: [{
            data: this.chartData.xAxisData
          }],
          yAxis: [{}, TRAFFIC_YAXIS_PERCENT],
          grid: {
              width: '85%',
              left: 35
          }
        };
        return _.merge({}, totalResult, this.getConfig());
        break;
      case 'gender':
        const genderResult: object = {
          color: TWO_COLOR,
          legend: {
            bottom: '5%'
          },
          xAxis: [{
            data: this.chartData.xAxisData
          }],
          yAxis: [{}, TRAFFIC_YAXIS_PERCENT],
          grid: {
              width: '85%',
              left: 35
          }
        };
        return _.merge({}, genderResult, this.getConfig());
        break;
      case 'demographic':
        const demoResult: any = {
          color: SIX_COLOR,
          legend: {
            bottom: '5%'
          },
          yAxis: [{}, TRAFFIC_YAXIS_PERCENT],
          xAxis: [{
            data: this.chartData.xAxisData,
            boundaryGap : false
          }],
          grid: {
              width: '85%',
              left: 35
          },
          tooltip: {
            formatter(parm: any) {
              // reverse legends
              let text = '';
              parm.reverse().forEach((item: any) => {
                const icon = genToolIcon(item.seriesType, item.color);
                text += `${icon} ${item.data} ppl</br>`;
              });
              return text;
            }
          }
        };
        return _.merge({}, demoResult, this.getConfig());
        break;
      case 'nesCustomer':
        const nesResult: object = {
          color: THREE_COLOR,
          legend: {
            bottom: '5%'
          },
          xAxis: [{
            data: this.chartData.xAxisData
          }],
          yAxis: [{}, TRAFFIC_YAXIS_PERCENT],
          grid: {
              width: '85%',
              left: 35
          }
        };
        return _.merge({}, nesResult, this.getConfig());
        break;
      default:
        return {};
        break;
    }
  }
  public getConfig(): object {
        const payload = this.chartData.data;
        const result: any = {
          series: [],
          legend: {
            data: []
          },
        };
        Object.keys(payload).forEach((type: any) => {
          const tmp = {
            name: payload[type].name,
            icon: payload[type].chartType === 'bar' ? RECTANGLE_ICON : 'circle'
          };
          result.legend.data.push(tmp);
          const seriesTmp: any = {
            data: payload[type].data,
            name: payload[type].name,
            type: payload[type].chartType,
            toolTipUnit: payload[type].toolTipUnit,
            yAxisIndex: payload[type].yAxisIndex ? payload[type].yAxisIndex : 0,
            smooth: true,
            smoothMonotone: 'x',
            showSymbol: false,
            symbol: 'none' // demo
          };

          seriesTmp.markLine = this.avgEnable ? enableAvgFormat(seriesTmp.yAxisIndex) : undefined;

          if (payload[type].yAxisIndex) {
            seriesTmp.yAxisIndex = payload[type].yAxisIndex;
            seriesTmp.toolTipUnit = payload[type].toolTipUnit;
          }
          if (payload[type].stack) {
            seriesTmp.stack = payload[type].stack;
            seriesTmp.areaStyle = { normal: {} };
          }
          result.series.push(seriesTmp);
        });
        return result;
  }
}
</script>

<style lang="scss" scoped>
// ---------- reset ----------
p {
  margin: 0;
}

// ---------- custom style ----------
.list {
  display: flex;
  margin: 15px 0px 0px 35px;
  &__item {
    margin-right: 25px;
  }
}

.button-container {
  position: absolute;
  top:0px;
  right: 25px;
  display: flex;
  align-items: center;
  align-content: center;
}

.traffic-title {
  margin: 15px 0px 0px 20px;
}

.pie-chart {
  position: relative;
  width: 212px;
  height: 300px;
}

.barline-chart {
  position: relative;
  width: 638px;
  height: 300px;
}
</style>
