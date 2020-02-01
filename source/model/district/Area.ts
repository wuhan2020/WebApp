import { observable } from 'mobx';
import { getSubDistrict } from '../AMap';

export class AreaModel {
    area = [];

    @observable
    provinceList = [];

    @observable
    cityList = [];

    @observable
    districtList = [];

    async loadProvince() {
        this.area = await getSubDistrict();
        this.provinceList = this.area;
    }

    getAreas = async (provinceName, city = undefined) => {
        let province = this.area.find(item => {
            return item.name === provinceName;
        });
        if (!province.cities) {
            province.cities = await getSubDistrict(province.name);
        }
        if (city) {
            if (city === '全部') {
                return [];
            }
            let cityFound = province.cities.find(item => {
                return item.name === city;
            });
            if (!cityFound.subs) {
                cityFound.subs = await getSubDistrict(cityFound.name);
            }
            console.log(cityFound.subs);
            return cityFound.subs;
        }
        return province.cities;
    };

    async loadCities(provinceName) {
        this.cityList = await this.getAreas(provinceName);
    }

    async loadDistrict(provinceName, cityName) {
        this.districtList = await this.getAreas(provinceName, cityName);
    }
}
