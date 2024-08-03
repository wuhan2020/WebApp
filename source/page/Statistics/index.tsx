import { observable } from 'mobx';
import {component,observer} from 'web-cell';
import {Overall,AreaData,getOverall,getArea } from '../../service/Epidemic';
import 'echarts-jsx/dist/renderers/SVG';
import 'echarts-jsx/dist/components/title';
import 'echarts-jsx/dist/components/legend';
import 'echarts-jsx/dist/components/tooltip';
import 'echarts-jsx/dist/components/grid';
import 'echarts-jsx/dist/components/x-axis';
import 'echarts-jsx/dist/components/y-axis';
import 'echarts-jsx/dist/charts/line';
import 'echarts-jsx/dist/charts/bar';

@component({ tagName: 'statistics-page' })
@observer
export default class StatisticsPage extends HTMLElement {
  
    @observable
    accessor virusData : {
        overAll: Overall[];
        areaData:AreaData[];
    }
    async mountedCallback() {
       const [overall,areadata]  =await Promise.all([getOverall(),getArea()])

       this.virusData = {
        overAll:overall,
        areaData:areadata,
        }
    }
    toMonth(dateString){
        let date = new Date(dateString);
        let year = date.getFullYear();
        let month = date.getMonth(); 
        return new Date(year, month);
    }

    render(){
        if(this.virusData){
            let confirmedCount =  this.virusData.overAll.map(item=>[this.toMonth(item.updateTime),item.confirmedCount])
            let suspectedCount = this.virusData.overAll.map(item=>[this.toMonth(item.updateTime),item.suspectedCount])
            let curedCount = this.virusData.overAll.map(item=>[this.toMonth(item.updateTime),item.curedCount])
            let deadCount = this.virusData.overAll.map(item=>[this.toMonth(item.updateTime),item.deadCount])
            let seriousCount = this.virusData.overAll.map(item=>[this.toMonth(item.updateTime),item.seriousCount])
          
            let cityData =  this.virusData.areaData.filter((item)=>{
                if(item.provinceName==='广东省'){return item}
            })
            let city_confirmedCounts = cityData.map((item)=>[item.cityName,item.city_confirmedCount])
            let city_curedCounts = cityData.map((item)=>[item.cityName,item.city_curedCount])
            let city_suspectedCounts = cityData.map((item)=>[item.cityName,item.city_suspectedCount])
            let city_deadCounts = cityData.map((item)=>[item.cityName,item.city_deadCount])
            return (
                <div>
                    <ec-svg-renderer
                        className="w-100 h-50"
                    >
                        <ec-title text="患者人数数据" top="5%" x="center" />
                        <ec-legend
                            orient="horizontal"
                            bottom="13%"
                            data={['确诊',"恢复",'严重',"疑似",'死亡']}
                        />
                        <ec-tooltip trigger="axis" />
                        <ec-grid bottom="25%" left={60} />
                        <ec-x-axis name="日期" type="time" nameGap={5} />
                        <ec-y-axis id='y1' name="确诊&恢复&严重人数" type="value" nameGap={10}  />
                        <ec-y-axis id='y2' name="疑似&死亡人数" type="value" nameGap={10}  />
                    
                        <ec-bar-chart
                            data={confirmedCount}
                            name="确诊"
                        />
                        <ec-bar-chart
                            data={curedCount}
                            name="恢复"
                        />
                        <ec-bar-chart
                            data={seriousCount}
                            name="严重"
                        />
                        <ec-line-chart
                            data={suspectedCount}
                            yAxisIndex={1}
                            name="疑似"
                        />
                        <ec-line-chart
                            data={deadCount}
                            yAxisIndex={1}
                            name="死亡"
                        />
                    </ec-svg-renderer>

                    <ec-svg-renderer
                        className="w-100 h-50"
                    >
                        <ec-title text="患者人数地市分布" top="5%" x="center" />
                        <ec-legend
                            orient="horizontal"
                            bottom="13%"
                            data={['确诊',"恢复",'疑似','死亡']}
                        />
                        <ec-tooltip trigger="axis" />
                        <ec-grid bottom="25%" left={60} />
                        <ec-x-axis name="地市" type="category" nameGap={5} />
                        <ec-y-axis id='y1' name="确诊&恢复人数" type="value" nameGap={10}  />
                        <ec-y-axis id='y2' name="疑似&死亡人数" type="value" nameGap={10}  />

                        <ec-bar-chart
                            data={city_confirmedCounts}
                            name="确诊"
                        />
                        <ec-bar-chart
                            data={city_curedCounts}
                            name="恢复"
                        />
                        <ec-line-chart
                            data={city_suspectedCounts}
                            name="疑似"
                            yAxisIndex={1}
                        />
                        <ec-line-chart
                            data={city_deadCounts}
                            name="死亡"
                            yAxisIndex={1}
                        />

                    </ec-svg-renderer>
                </div>
            );
        }
    }
}
