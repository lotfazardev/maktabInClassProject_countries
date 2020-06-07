let contries = [];
let settings = {
    "url": "https://restcountries.eu/rest/v2/all",
    "method": "GET",
    "timeout": 0,
    "async": false
};
$.ajax(settings).done(function (response) {
    for (let i in response) {
        contries.push(response[i].name)
        $('#countries').append(`
            <option>${response[i].name}</option>
        `)
    }
});
$("#countries").change(function (event) {
    let callingCodes = "", language = "";
    $('#num-code').html('')
    $('#detail').html('')
    $('#map').html('')
    $('#flag').attr('src', '')
    $.ajax(settings).done(function (response) {
        let item = response[contries.indexOf(event.target.value)];
        for (let i of item["callingCodes"]) {
            callingCodes += i + "\n"
        }
        for (let i of item["languages"]) {
            language += i["nativeName"] + `\t`
        }
        $('#num-code').append(`
            <h5 style="font-size:5rem">+${callingCodes}</h5>
            `)
        $('#detail').append(`
                <h3><span style="color:#fff;"> ${item['name']}</h3>
                <h6 style="color: #fff"><span style="color:#FBC433;">Native Name</span> : ${item["nativeName"]}</h6>
                <h6 style="color: #fff"><span style="color:#FBC433;">Capital</span> : ${item["capital"]}</h6>
                <h6 style="color: #fff"><span style="color:#FBC433;">Region</span> : ${item["region"]}, ${item["subregion"]}</h6>
                <h6 style="color: #fff"><span style="color:#FBC433;">Population</span> : ${item["population"]}</h6>
                <h6 style="color: #fff"><span style="color:#FBC433;">Language</span> : ${language}</h6>
                <h6 style="color: #fff"><span style="color:#FBC433;">timezones</span> : ${item["timezones"]}</h6>
            `)
        // exptions
        $('#flag').attr('src', item["flag"])
        var map;
        function marker(lat, lang) {
            map = new google.maps.Map(
                document.getElementById('map'),
                { center: new google.maps.LatLng(lat, lang), zoom: 4 });
            var features = { position: new google.maps.LatLng(lat, lang) }
            var marker = new google.maps.Marker({
                position: features.position,
                map: map
            });
        }
        marker(...item["latlng"]);
        function weather() {
            var weather_settings = {
                "url": `http://api.openweathermap.org/data/2.5/weather?q=${item["capital"]}&appid=9593faaeb4577a1b8c0d0d3dcaee406b`,
                "method": "GET",
                "timeout": 0,
            };

            $.ajax(weather_settings).done(function (weatherRes) {
                $('#weather-layout').html("")
                $('#weather-layout').append(`
                <img src="http://openweathermap.org/img/wn/${weatherRes.weather[0].icon}@4x.png" alt="${weatherRes.weather[0].icon}">
                <span style="color: #fff;">${weatherRes.weather[0].description}</span>
                <h6> Wind Speed : <span style="color:#FBC433">${weatherRes.wind.speed}</span> MS</h6>
                <h6> Tempreture : <span style="color:#FBC433">${weatherRes.main.temp - 273}</span></h6>
                <h6> Humidity : <span style="color:#FBC433">${weatherRes.main.humidity}</span> %</h6>
                <h6> Visibility : <span style="color:#FBC433">${weatherRes.visibility||"no data"}</span></h6>
                `)
                console.log(weatherRes);
            });
        }
        weather()

    });

});
// map google

