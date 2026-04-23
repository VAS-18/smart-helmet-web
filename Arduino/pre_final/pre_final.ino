#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>

#define DHTPIN 4        // D2 = GPIO4
#define DHTTYPE DHT11
#define MQ135_DO 0      // D3 = GPIO0
#define TRIG_PIN 14     // D5 = GPIO14
#define ECHO_PIN 12     // D6 = GPIO12
#define PULSE_PIN A0    // Heartbeat sensor

const char* ssid        = "The1";
const char* password    = "abcd1234";
const char* mqtt_server = "10.65.233.150";
const char* TOPIC       = "esp/dht11";

WiFiClient   espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

unsigned long lastPublish        = 0;
unsigned long lastBeatTime       = 0;
unsigned long lastHeartbeatRead  = 0;
unsigned long beatInterval       = 0;
int           bpm                = 0;
int           lastValue          = 0;
bool          beatDetected       = false;
const int     THRESHOLD          = 550;

float getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;
  return (duration * 0.0343) / 2.0;
}

void readHeartbeat() {
  int value = analogRead(PULSE_PIN);

  if (value > THRESHOLD && lastValue <= THRESHOLD) {
    unsigned long now = millis();
    if (lastBeatTime > 0) {
      beatInterval = now - lastBeatTime;
      if (beatInterval > 300 && beatInterval < 1500) {
        bpm = 60000 / beatInterval;
        beatDetected = true;
      }
    }
    lastBeatTime = now;
  }

  if (millis() - lastBeatTime > 3000) {
    bpm = 0;
    beatDetected = false;
  }

  lastValue = value;
}

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
  pinMode(MQ135_DO, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\nWiFi Connected: " + WiFi.localIP().toString());

  client.setServer(mqtt_server, 1883);
  client.setBufferSize(512);
}

void loop() {
  if (!client.connected()) reconnect();
  client.loop();

  // Read heartbeat every 10ms instead of every loop cycle
  if (millis() - lastHeartbeatRead >= 10) {
    lastHeartbeatRead = millis();
    readHeartbeat();
  }

  if (millis() - lastPublish >= 2000) {
    lastPublish = millis();

    float temp     = dht.readTemperature();
    float humidity = dht.readHumidity();

    if (isnan(temp) || isnan(humidity)) {
      Serial.println("DHT11 read failed!");
      return;
    }

    float heatIndex = dht.computeHeatIndex(temp, humidity, false);
    bool  airAlert  = !digitalRead(MQ135_DO);
    float distance  = getDistance();

    char payload[256];
    snprintf(payload, sizeof(payload),
      "{\"temperature\":%.1f,\"humidity\":%.1f,\"heatIndex\":%.1f,\"airAlert\":%s,\"distance\":%.1f,\"bpm\":%d}",
      temp, humidity, heatIndex, airAlert ? "true" : "false", distance, bpm
    );

    bool published = client.publish(TOPIC, payload);
    Serial.print("Published (");
    Serial.print(strlen(payload));
    Serial.print(" bytes): ");
    Serial.println(published ? payload : "FAILED");
  }
}