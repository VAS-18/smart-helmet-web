#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4        // D2 = GPIO4
#define DHTTYPE DHT11

const char* ssid        = "The1";
const char* password    = "abcd1234";
const char* mqtt_server = "10.65.233.150";
const char* TOPIC       = "esp/dht11";

WiFiClient   espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);
unsigned long lastPublish = 0;

void reconnect() {
  while (!client.connected()) {
    Serial.print("Connecting to MQTT...");
    if (client.connect("ESP8266Client")) {
      Serial.println("Connected!");
    } else {
      Serial.print("FAILED rc=");
      Serial.print(client.state());
      Serial.println(" retrying in 2s");
      delay(2000);
    }
  }
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected: " + WiFi.localIP().toString());
  client.setServer(mqtt_server, 1883);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  if (millis() - lastPublish >= 2000) {
    lastPublish = millis();

float temp     = dht.readTemperature();
float humidity = dht.readHumidity();

if (isnan(temp) || isnan(humidity)) {
  Serial.println("DHT11 read failed!");
  return;
}

// Calculate Heat Index
float heatIndex = dht.computeHeatIndex(temp, humidity, false);

char payload[120];
snprintf(payload, sizeof(payload),
  "{\"temperature\":%.1f,\"humidity\":%.1f,\"heatIndex\":%.1f}",
  temp, humidity, heatIndex
);

    client.publish(TOPIC, payload);
    Serial.println("Published: " + String(payload));
  }
}