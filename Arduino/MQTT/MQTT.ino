#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid        = "The1";
const char* password    = "abcd1234";
const char* mqtt_server = "10.65.233.150";

WiFiClient   espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }

  Serial.println("\n--- Network Info ---");
  Serial.println("ESP IP:   " + WiFi.localIP().toString());
  Serial.println("Gateway:  " + WiFi.gatewayIP().toString());
  Serial.println("--------------------");

  client.setServer(mqtt_server, 1883);

  Serial.print("Connecting to MQTT...");
  if (client.connect("ESP8266Client")) {
    Serial.println("SUCCESS!");

    // Publish JSON payload
    const char* payload = "{\"sensor\":\"esp8266\",\"value\":42,\"status\":\"ok\"}";
    client.publish("esp/test", payload);
    Serial.println("Published: " + String(payload));

  } else {
    Serial.print("FAILED rc=");
    Serial.println(client.state());
  }
}

void loop() {}