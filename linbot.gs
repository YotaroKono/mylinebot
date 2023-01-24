# mylinebot
open weather mapを使って東京の天気と気温、湿度を教えてくれます。
// LINE Message API チャネルアクセストークン
const LINE_ACCESS_TOKEN = "SpRH6tCR6EG4tVc903X6a0LeUjs0pidudmnNCpXnYYhhXdbURthQBF0KLFBQdBWUBSn7v+1Iu+jBolMuvAphtGNrovn16R9UNVFeSaZgNogjRiXQV5aWr+bWJxn6f5McagjyqFntbZ768mCcsZdUuQdB04t89/1O/w1cDnyilFU=";
//ユーザーIDを指定
const LINE_USER_ID = "U8755e49520dac619a123607252af5d06";
// 通知用のLINE API
const PUSH_API = "https://api.line.me/v2/bot/message/push";

const WEATHER_APP_ID = "4d6d1e3be48a34752457fc1c648a89cb";
const LAT = 0;
const LON = 0;
// 天気予報情報取得API;
const WEWATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=0&lon=0&appid=4d6d1e3be48a34752457fc1c648a89cb`


/** 
 * push
 * botからメッセージを送る
 */
function doPost() {

  const date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy/MM/dd HH:mm');
  Logger.log(date);

  // リクエストヘッダ
  const headers = {
    "Content-Type" : "application/json; charset=UTF-8",
    "Authorization" : "Bearer " + LINE_ACCESS_TOKEN
  };
  // メッセージ
  let weatherInfo = getWeather();
  const postData = {
    "to" : LINE_USER_ID, 
    "messages" : [
      {
        "type" : "text",
        "text" : `🐻東京の日時とお天気🐻\n\n時刻: 2022/12/14\n気温: ${ weatherInfo.temp }℃\n湿度: ${ weatherInfo.humidity }%\n\n${ weatherInfo.weather }`
      }
    ]
  };
Logger.log(postData);

  // POSTオプション作成
  const options = {
    "method" : "POST",
    "headers" : headers,
    "payload" : JSON.stringify(postData)
  };
  return UrlFetchApp.fetch(PUSH_API, options);
}


function unixtimeToDatetime(unixtime) {
  const date = new Date(unixtime * 1000);
  return Utilities.formatDate(date, 'Asia/Tokyo', 'YY/MM/dd HH:mm');
}








function getWeather() {
  // @ts-ignore
  let res = JSON.parse(UrlFetchApp.fetch(WEWATHER_API));
  let current = res.current;
  let unixtime = unixtimeToDatetime;
  let date = new Date();
  
  var apiKey = "4d6d1e3be48a34752457fc1c648a89cb";
  var url = `api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${apiKey}&lang=ja`;
  var response = UrlFetchApp.fetch(url);
  var forecast = JSON.parse(response.getContentText());
  var weather = forecast.weather[0].main;
  var kion = forecast.main.temp;


  function tenki(weather) {
    if(weather == "Rain"){
      return("雨だよ！\n傘を持っていってね！☔️");
      } 
    else if(weather == "Clouds"){
      return("今日の天気は曇り！\nいってらっしゃい！☁️");
      } 
    else {
      return("今日は晴れ！\n1日頑張ろう！☀️");
      }
    }
  
  function ondo(kion) {
    return(Math.floor(kion-273.15));
     }


 

  date = Utilities.formatDate(date, "Asia/Tokyo", "yyyy/MM/dd");

  
  
  
  weatherInfo = {
    "datetime": date,
    "weather": tenki(weather),
    "temp":ondo(kion),
    "humidity" : forecast.main.humidity
  };
  return weatherInfo;
}
