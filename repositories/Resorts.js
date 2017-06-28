const knex = require("../knex");
const rp = require("request-promise");
class Resorts {
  constructor() {
    // createResorts(resortData) {
    //   return knex('resorts')
    //   .insert(resortData, ['id', 'first_name', 'last_name', 'email']);
    // }
  }
  getResorts() {
    let ids;
    return knex("resorts")
      .select("city", "id")
      .then(citiesAndIds => {
        ids = citiesAndIds.map(city => city.id);
        let arr = citiesAndIds.map(cityName =>
          rp(
            `http://api.wunderground.com/api/18baf686d82d4e8b/forecast10day/q/CA/${cityName.city}.json`
          )
        );
        return Promise.all(arr);
      })
      .then(resortsData => {
        let dbRes = resortsData.map((resortData, index) => {
          let parsedData = JSON.parse(resortData);
          return knex("resorts")
            .where("id", ids[index])
            .update(
              {
                high_temperature:
                  parsedData.forecast.simpleforecast.forecastday[0].high
                    .fahrenheit,
                low_temperature:
                  parsedData.forecast.simpleforecast.forecastday[0].low
                    .fahrenheit,
                snow_depth:
                  parsedData.forecast.simpleforecast.forecastday[0].snow_allday
                    .in,
                windspeed:
                  parsedData.forecast.simpleforecast.forecastday[0].avewind.mph
              },
              "*"
            )
            .first();
        });
        return Promise.all(dbRes);
      })
      .catch(err => {
        throw err;
      });
  }

  getResort(id) {
    return knex("resorts")
      .where("id", id)
      .select("city")
      .first()
      .then(cityName => {
        return rp(
          `http://api.wunderground.com/api/18baf686d82d4e8b/forecast10day/q/CA/${cityName.city}.json`
        );
      })
      .then(res => {
        return res;
      })
      .then(weatherData => {
        let parsedData = JSON.parse(weatherData);
        return knex("resorts").where("id", id).update(
          {
            high_temperature:
              parsedData.forecast.simpleforecast.forecastday[0].high.fahrenheit,
            low_temperature:
              parsedData.forecast.simpleforecast.forecastday[0].low.fahrenheit,
            snow_depth:
              parsedData.forecast.simpleforecast.forecastday[0].snow_allday.in,
            windspeed:
              parsedData.forecast.simpleforecast.forecastday[0].avewind.mph
          },
          "*"
        );
      });
  }
}

// updateUser(id, userData) {
//  return knex('users')
//  .update(userData, ['id', 'first_name', 'last_name', 'email'])
//  .where('id', id);
// }
// deleteUser(id) {
//    return knex('users')
//      .del()
//      .where('id', id)
//      .returning('*');
//  }

module.exports = Resorts;
