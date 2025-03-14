import { AfterViewInit, Component, ElementRef, Input, QueryList, SimpleChanges, ViewChildren } from "@angular/core";
import * as echarts from 'echarts';

@Component({
    selector: "gauge-chart",
    standalone: true,
    templateUrl: "./gauge-chart.component.html"
})
export class GaugeChartComponent implements AfterViewInit {
    @Input() value: number = 0;
    @Input() title: string = "";
    @Input() minValue: number = 0;
    @Input() maxValue: number = 10;
    @Input() splitNumber: number = 5;
    gaugeChart: any = null;
    @ViewChildren('gaugeChart') chatElement: QueryList<ElementRef> | undefined;

    ngAfterViewInit(): void {
        this.gaugeChart = echarts.init(this.chatElement?.first.nativeElement);

        let color: string = "#147AA0";

        if (this.gaugeChart != null) {
            this.gaugeChart.setOption({
                series: [
                    {
                        name: 'Pressure',
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 180,
                        endAngle: 0,
                        max: this.maxValue,
                        min: this.minValue,
                        splitNumber: this.splitNumber,
                        itemStyle: {
                            width: 6,
                            color
                        },
                        progress: {
                            show: true,
                            width: 10
                        },
                        detail: {
                            fontSize: 20,
                            offsetCenter: [0, '60%'],
                            valueAnimation: true,
                            formatter: '{value}',
                            color: 'inherit'
                        },
                        title: {
                            offsetCenter: [0, '30%']
                        },
                        data: [
                            {
                                value: !Number.isNaN(this.value) ? this.value?.toFixed(1) : 0,
                                name: this.title
                            }
                        ]
                    }
                ]
            });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        let color: string = "#147AA0";
        if ((this.value < this.maxValue * 0.67) && (this.value >= this.maxValue * 0.33)) {
            color = "#E4BE00";
        }
        else if (this.value < this.maxValue * 0.33) {
            color = "#A90061";
        }

        if (this.gaugeChart != null) {
            this.gaugeChart.setOption({
                series: [
                    {
                        name: 'Pressure',
                        type: 'gauge',
                        center: ['50%', '60%'],
                        startAngle: 180,
                        endAngle: 0,
                        max: this.maxValue,
                        min: this.minValue,
                        splitNumber: this.splitNumber,
                        itemStyle: {
                            width: 6,
                            color
                        },
                        progress: {
                            show: true,
                            width: 10
                        },
                        detail: {
                            fontSize: 20,
                            offsetCenter: [0, '60%'],
                            valueAnimation: true,
                            formatter: '{value}',
                            color: 'inherit'
                        },
                        title: {
                            offsetCenter: [0, '30%']
                        },
                        data: [
                            {
                                value: !Number.isNaN(changes["value"].currentValue) ? changes["value"].currentValue?.toFixed(1) : 0,
                                name: this.title
                            }
                        ]
                    }
                ]
            });
        }

    }
}