import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, pagingEnabled, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH} = Dimensions.get("window");

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons = {
  "Clouds": "cloudy",
  "Clear" : "ios-sunny",
  "Rain": "md-rainy",
  "Snow": "snowflake",
  "Drizzle": "rain",
  "Thunderstorm": "lighing",
  "Atmosphere": "cloudy-gusts"
}

export default function App() {
  const [city, setCity] = useState("Loading...")
  const [days, setDays] = useState([]);
  const [pk, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps:false}
    );
    setCity(location[0].city);
    const response = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat=35.146498&lon=129.1117681&appid=784ab24ff2ed5d94d4288abed9e25d13&units=metric');
    const json = await response.json();
    setDays(json.daily);
  };
  useState(() => {
    getWeather();
  }, []);
  return (
    <View style={ styles.container}>
      <StatusBar style='dark'/>
      <View style ={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop:10}}/>
          </View>
        ) : (
          days.map((day, index) => 
            <View key={index} style={styles.day}>
              <Text style={styles.tinyText}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              <View style={{ 
                  flexDirection: "row", 
                  alignItems: "center", 
                  width:"100%",
                  justifyContent:"space-between"}}>
                <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                <Ionicons name={icons[day.weather[0].main]} size={50} color="black" marginTop={5} />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1, 
  backgroundColor: "lightgray",
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 40,
    fontWeight: "500",
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    marginTop: 50,
    fontSize: 100,
    fontWeight: "600",
  },
  description: {
    marginTop: -5,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
  }
});


// reverseGeocode : 위도랑 경도 갖고 주소를 알려줌 / Geocode : 주소를 알려주면 위도랑 경도를 알려줌
//