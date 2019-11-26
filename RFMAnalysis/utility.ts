import {valueToArray , getGraphData} from '@/utility/CommonUtility';
import { TranslateResult } from '@/utility/i18nInterface';

function getGenderData(value: number[] , name: TranslateResult[] , percentage: number[]) {

    const data = valueToArray(['value' , 'name' , 'percentage'] , {
        value,
        name,
        percentage
    });

    for (const item of data) {
        if (item.percentage >= 0) {
            item.growth = 'increase';
        } else {
            item.growth = 'decrease';
        }
    }
    return data;
}

function getDemographicData(value: number[] , name: TranslateResult[]) {
    return valueToArray(['value' , 'name'] , {
        value,
        name
    });
}

function getNESData(value: number[] , name: TranslateResult[]) {
    return valueToArray(['value' , 'name'] , {
        value,
        name
    });
}

function getTrafficTitleData(value: number[] , name: TranslateResult[] , diff: number[] , unit: string[]) {
    const data = valueToArray(['value' , 'name' , 'percentage' , 'unit'] , {
        value,
        name,
        percentage: diff,
        unit
    });

    for (const item of data) {
        if (item.percentage >= 0) {
            item.growth = 'increase';
        } else {
            item.growth = 'decrease';
        }
    }
    return data;
}

function getTotalGraphData(key: string[] , value: number[] , name: TranslateResult[] , type: string[] , yAxisIndex: number[] , tooltip: string[] , xAxis: string[]) {
    return getGraphData(['data' , 'name' , 'chartType' , 'yAxisIndex' , 'toolTipUnit'] , {
        data: value,
            name,
            chartType: type,
            yAxisIndex,
            toolTipUnit: tooltip
    } , key , xAxis);
}

function getGenderGraphData(key: string[] , value: number[] , name: TranslateResult[] , type: string[] , xAxis: string[]) {
    return getGraphData(['data' , 'name' , 'chartType'] , {
        data: value,
        name,
        chartType: type,
    } , key , xAxis);
}

function getDemographicGraphData(key: string[] , value: number[] , name: TranslateResult[] , type: string[], stack: string[] , xAxis: string[]) {
    return getGraphData(['data' , 'name' , 'chartType' , 'stack'] , {
        data: value,
        name,
        chartType: type,
        stack
    } , key , xAxis);
}

export {getGenderData , getDemographicData , getNESData , getTrafficTitleData , getTotalGraphData , getGenderGraphData , getDemographicGraphData};
