<template>
  <div class="root-wrapper">
    <sr-temp4 :type="trafficType" :chartData="chartData" :chartData2="chartData2"
              :title="$t('trafficOverview')" :typeList="typeList"
              :timeType="trafficTimeType" :avgEnable="trafficAvgEnable" @timeChange="timeChange"
              @avgChange="avgChange" @typeChange="typeChange"
    ></sr-temp4>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import * as _ from 'lodash';
  import Temp4 from './temp4.vue';
  import {PercentData, CardData, ChartData} from '@/utility/trafficInterface';
  import store from '@/store';
  import {CommonObject, zipWithAdd} from '@/utility';
  import {
    getGenderData,
    getDemographicData,
    getNESData,
    getTrafficTitleData,
    getTotalGraphData,
    getGenderGraphData,
    getDemographicGraphData
  } from './utility';
  import {TranslateResult} from '@/utility/i18nInterface';

  Vue.component('sr-temp4', Temp4);

  @Component
  export default class RFMAnalysis extends Vue {
    get chartData(): CardData {
      return this.trafficGraph[this.trafficType][this.trafficTimeType];
    }

    private type: string = 'gender';
    private demographicType: string = 'demographic';
    private nesCustomerType: string = 'nesCustomer';
    private trafficType: string = 'gender';
    private typeList: string[] = ['gender', 'demographic', 'nesCustomer'];
    private trafficTimeType: string = 'day';
    private trafficAvgEnable: boolean = false;
    private targetTimeType: string = 'day';
    private targetAvgEnable: boolean = false;

    private storeTrafficTotal!: number[];
    private storeTrafficDiff!: number[];
    private targetTitleTotal!: number[];
    private targetTitleDiff!: number[];
    private day!: string[];
    private hour!: string[];
    private targetGraphDataByDay!: number[];
    private targetGraphDataByHour!: number[];
    private trafficTotalDataByDay!: number[];
    private trafficTotalDataByHour!: number[];
    private trafficGenderDataByDay!: any;
    private trafficGenderDataByHour!: any;
    private trafficAgeDataByDay!: number[];
    private trafficAgeDataByHour!: number[];
    private trafficNESDataByDay!: any;
    private trafficNESDataByHour!: any;

    constructor() {
      super();
    }

    get trafficGraph(): { [index: string]: { [index: string]: CardData } } {
      // Gender barline-chart data
      const trafficGenderChartType = ['bar', 'bar', 'line'];
      const trafficGenderKey = ['male', 'female', 'total'];
      const trafficGendeName: TranslateResult[] | string[] = [
        this.$i18n.t('male'),
        this.$i18n.t('female'),
        this.$i18n.t('totalTraffic')
      ];

      // Age barline-chart data
      const trafficAgeKey = store.getters.SelectedAgeRange;
      const trafficAgeName = store.getters.SelectedAgeRange;
      const trafficAgeChartType = _.fill(Array(store.getters.SelectedAgeRange.length), 'line');
      const trafficAgeStack = _.fill(Array(store.getters.SelectedAgeRange.length), 'demographic');

      // NES barline-chart data
      const trafficNESKey = ['newCustomer', 'existCustomer', 'sleepCustomer', 'total'];
      const trafficNESName: TranslateResult[] | string[] = [
        this.$i18n.t('newCustomers'),
        this.$i18n.t('existingCustomers'),
        this.$i18n.t('sleepingCustomers'),
        this.$i18n.t('totalTraffic')
      ];
      const trafficNESChartType = ['bar', 'bar', 'bar', 'line'];

      return {
        gender: {
          day: getGenderGraphData(trafficGenderKey, this.trafficGenderDataByDay, trafficGendeName, trafficGenderChartType, this.day),
          hour: getGenderGraphData(trafficGenderKey, this.trafficGenderDataByHour, trafficGendeName, trafficGenderChartType, this.hour)
        },
        demographic: {
          day: getDemographicGraphData(trafficAgeKey, this.trafficAgeDataByDay, trafficAgeName, trafficAgeChartType, trafficAgeStack, this.day),
          hour: getDemographicGraphData(trafficAgeKey, this.trafficAgeDataByHour, trafficAgeName, trafficAgeChartType, trafficAgeStack, this.hour)
        },
        nesCustomer: {
          day: getGenderGraphData(trafficNESKey, this.trafficNESDataByDay, trafficNESName, trafficNESChartType, this.day),
          hour: getGenderGraphData(trafficNESKey, this.trafficNESDataByHour, trafficNESName, trafficNESChartType, this.hour)
        }
      };
    }
    
    @Watch('this.trafficType')
    changeData2 (){
      const demographicName = store.getters.SelectedAgeRange;
      const genderData = store.getters.AreaTrafficGender;

      if (this.trafficType == 'gender'){
        this.chartData2 = getGenderData(genderData.value, genderData.name, genderData.percentage);
      } else if (this.trafficType == 'demographic'){
        if (JSON.stringify(store.getters.SelectedCounter) !== '[0]') {
          this.chartData2 = getDemographicData(store.getters.AreaTrafficDemographic, demographicName);
        } else{
          this.chartData2 = getDemographicData(store.getters.TrafficDemographic, demographicName);
        }
      } else if (this.trafficType == 'nesCustomer'){
        const nesName: TranslateResult[] | string[] = [
        this.$i18n.t('newCustomers'),
        this.$i18n.t('existingCustomers'),
        this.$i18n.t('sleepingCustomers')
        ];
        this.chartData2 = getNESData(store.getters.TrafficNES, nesName);
      }
    }

    private timeChange(time: string) {
      this.trafficTimeType = time;
    }

    private targetTimeChange(time: string) {
      this.targetTimeType = time;
    }

    private avgChange(status: boolean) {
      this.trafficAvgEnable = status;
    }

    private tagetAvgChange(status: boolean) {
      this.targetAvgEnable = status;
    }

    private typeChange(type: string) {
      this.trafficType = type;
    }
  }
</script>

<style scoped lang="scss">
  .root-wrapper {
    position: relative;
    max-width: 1160px;
    height: 756px;
    display: flex;
    flex-wrap: wrap;
  }
</style>