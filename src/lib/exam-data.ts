export type Scenario = {
  id: string;
  title: string;
  likelihood: number; // 1-5
  components: string[];
  tasks: string[];
  code: { language: string; filename: string; content: string }[];
  explanation: string;
};

// =========================
// CSA SCENARIOS (Arduino)
// =========================
export const csaScenarios: Scenario[] = [
  {
    id: "csa-parking",
    title: "Smart Parking System",
    likelihood: 5,
    components: ["Arduino Uno", "IR Sensor", "Servo Motor", "LCD I2C 16x2", "Buzzer"],
    tasks: [
      "Detect approaching vehicle with IR sensor",
      "Open gate automatically using servo",
      "Count and display available slots on LCD",
      "Buzzer beep when slot is full",
    ],
    explanation:
      "When a car arrives, the IR sensor goes LOW. The servo rotates to 90° to open the gate, the slot count decreases, and the LCD shows available slots. When full, the buzzer beeps.",
    code: [
      {
        language: "cpp",
        filename: "smart_parking.ino",
        content: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <Servo.h>

#define IR_PIN     2
#define SERVO_PIN  9
#define BUZZER     8
#define TOTAL_SLOTS 4

LiquidCrystal_I2C lcd(0x27, 16, 2);
Servo gate;
int slots = TOTAL_SLOTS;

void setup() {
  pinMode(IR_PIN, INPUT);
  pinMode(BUZZER, OUTPUT);
  gate.attach(SERVO_PIN);
  gate.write(0); // closed
  lcd.init(); lcd.backlight();
  lcd.print("Smart Parking");
}

void loop() {
  lcd.setCursor(0, 1);
  lcd.print("Slots: "); lcd.print(slots); lcd.print("   ");

  if (digitalRead(IR_PIN) == LOW) {     // car detected
    if (slots > 0) {
      gate.write(90); delay(3000);      // open 3s
      gate.write(0);
      slots--;
    } else {
      digitalWrite(BUZZER, HIGH); delay(500);
      digitalWrite(BUZZER, LOW);
    }
  }
  delay(200);
}`,
      },
    ],
  },
  {
    id: "csa-lab",
    title: "Pharmaceutical Lab Monitoring",
    likelihood: 5,
    components: ["Arduino Uno", "DHT22", "MQ135", "LCD I2C", "Fan", "Buzzer", "Relay"],
    tasks: [
      "Monitor temperature & humidity (DHT22)",
      "Detect gas contamination (MQ135)",
      "Auto-activate fan via relay",
      "Trigger buzzer on danger",
      "Display all readings on LCD",
    ],
    explanation:
      "Temperature/humidity from DHT22 and gas level from MQ135 are read every second. If temperature > 30°C OR gas > 400, the relay turns the fan ON and the buzzer alarms.",
    code: [
      {
        language: "cpp",
        filename: "lab_monitor.ino",
        content: `#include <DHT.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define DHTPIN   2
#define DHTTYPE  DHT22
#define MQ_PIN   A0
#define FAN      7   // relay
#define BUZZER   8

DHT dht(DHTPIN, DHTTYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  pinMode(FAN, OUTPUT);
  pinMode(BUZZER, OUTPUT);
  dht.begin();
  lcd.init(); lcd.backlight();
}

void loop() {
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  int   gas = analogRead(MQ_PIN);

  lcd.setCursor(0,0); lcd.print("T:"); lcd.print(t,1);
  lcd.print(" H:"); lcd.print(h,0); lcd.print("%  ");
  lcd.setCursor(0,1); lcd.print("Gas:"); lcd.print(gas); lcd.print("   ");

  bool danger = (t > 30 || gas > 400);
  digitalWrite(FAN,    danger ? HIGH : LOW);
  digitalWrite(BUZZER, danger ? HIGH : LOW);
  delay(1000);
}`,
      },
    ],
  },
  {
    id: "csa-door",
    title: "Smart Door Lock (Keypad)",
    likelihood: 5,
    components: ["Arduino Uno", "4x4 Keypad", "Servo Motor", "LCD I2C", "Buzzer"],
    tasks: [
      "Enter 4-digit password on keypad",
      "Unlock door with servo when correct",
      "Alarm via buzzer on 3 wrong tries",
      "Display status on LCD",
    ],
    explanation:
      "User types a 4-digit code. If it matches '1234', the servo opens for 5s. Wrong code increments a counter — 3 fails triggers buzzer alarm.",
    code: [
      {
        language: "cpp",
        filename: "door_lock.ino",
        content: `#include <Keypad.h>
#include <Servo.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

const byte ROWS = 4, COLS = 4;
char keys[ROWS][COLS] = {
  {'1','2','3','A'},{'4','5','6','B'},
  {'7','8','9','C'},{'*','0','#','D'}
};
byte rowPins[ROWS] = {9,8,7,6};
byte colPins[COLS] = {5,4,3,2};
Keypad kp(makeKeymap(keys), rowPins, colPins, ROWS, COLS);
Servo lock;
LiquidCrystal_I2C lcd(0x27,16,2);

String input = "";
const String PASSWORD = "1234";
int wrong = 0;

void setup(){
  lock.attach(10); lock.write(0);
  pinMode(11, OUTPUT); // buzzer
  lcd.init(); lcd.backlight();
  lcd.print("Enter code:");
}

void loop(){
  char k = kp.getKey();
  if(!k) return;
  if(k == '#'){
    if(input == PASSWORD){
      lcd.clear(); lcd.print("Access granted");
      lock.write(90); delay(5000); lock.write(0);
      wrong = 0;
    } else {
      lcd.clear(); lcd.print("Wrong code");
      wrong++;
      if(wrong >= 3){
        digitalWrite(11, HIGH); delay(2000);
        digitalWrite(11, LOW); wrong = 0;
      }
    }
    input = ""; delay(1500);
    lcd.clear(); lcd.print("Enter code:");
  } else if(k == '*'){
    input = ""; lcd.clear(); lcd.print("Enter code:");
  } else {
    input += k;
    lcd.setCursor(0,1); lcd.print(input);
  }
}`,
      },
    ],
  },
  {
    id: "csa-irrigation",
    title: "Smart Irrigation / Water Pump",
    likelihood: 4,
    components: ["Arduino Uno", "Soil Moisture Sensor", "Relay", "Fluid Pump", "LCD I2C"],
    tasks: [
      "Read soil moisture level",
      "Turn pump ON when soil is dry",
      "Stop pump when soil is wet",
      "Display moisture % on LCD",
    ],
    explanation:
      "Moisture sensor reads 0–1023. Below 400 = dry → pump ON. Above 700 = wet → pump OFF. Hysteresis prevents flicker.",
    code: [
      {
        language: "cpp",
        filename: "irrigation.ino",
        content: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define MOIST A0
#define PUMP  7   // relay
LiquidCrystal_I2C lcd(0x27,16,2);

void setup(){
  pinMode(PUMP, OUTPUT);
  lcd.init(); lcd.backlight();
}

void loop(){
  int raw = analogRead(MOIST);
  int pct = map(raw, 1023, 0, 0, 100); // dry=0%, wet=100%

  lcd.setCursor(0,0); lcd.print("Moisture:"); lcd.print(pct); lcd.print("% ");
  if (pct < 30) { digitalWrite(PUMP, HIGH); lcd.setCursor(0,1); lcd.print("Pump ON  "); }
  else if (pct > 70) { digitalWrite(PUMP, LOW); lcd.setCursor(0,1); lcd.print("Pump OFF "); }
  delay(1000);
}`,
      },
    ],
  },
  {
    id: "csa-weighing",
    title: "Smart Weighing (Load Cell)",
    likelihood: 4,
    components: ["Arduino Uno", "Load Cell", "HX711", "LCD I2C", "Buzzer"],
    tasks: [
      "Calibrate load cell with HX711",
      "Read weight in grams/kg",
      "Display weight on LCD",
      "Buzzer alarm on overload",
    ],
    explanation:
      "HX711 amplifies the load cell signal. Set scale factor after calibration with a known weight. Overload threshold triggers buzzer.",
    code: [
      {
        language: "cpp",
        filename: "weighing.ino",
        content: `#include <HX711.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define DT  3
#define SCK 2
#define BUZZER 8
#define LIMIT_KG 5.0

HX711 scale;
LiquidCrystal_I2C lcd(0x27,16,2);

void setup(){
  pinMode(BUZZER, OUTPUT);
  lcd.init(); lcd.backlight();
  scale.begin(DT, SCK);
  scale.set_scale(420.f);  // <-- calibrate me
  scale.tare();
  lcd.print("Smart Scale");
}

void loop(){
  float kg = scale.get_units(5) / 1000.0;
  if (kg < 0) kg = 0;

  lcd.setCursor(0,1);
  lcd.print("W:"); lcd.print(kg, 2); lcd.print(" kg   ");

  digitalWrite(BUZZER, kg > LIMIT_KG ? HIGH : LOW);
  delay(300);
}`,
      },
    ],
  },
  {
    id: "csa-fire",
    title: "Fire / Gas Detection",
    likelihood: 4,
    components: ["Arduino Uno", "MQ135", "Buzzer", "Horn Siren", "LCD I2C"],
    tasks: [
      "Continuously read MQ135 gas level",
      "Display value on LCD",
      "Trigger buzzer + siren when above threshold",
    ],
    explanation:
      "If gas reading exceeds 500, both buzzer and siren fire. Use a relay for the loud horn since Arduino can't drive it directly.",
    code: [
      {
        language: "cpp",
        filename: "fire_detect.ino",
        content: `#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define MQ A0
#define BUZZER 8
#define SIREN  7    // via relay

LiquidCrystal_I2C lcd(0x27,16,2);

void setup(){
  pinMode(BUZZER, OUTPUT);
  pinMode(SIREN,  OUTPUT);
  lcd.init(); lcd.backlight();
  lcd.print("Fire Detector");
}

void loop(){
  int g = analogRead(MQ);
  lcd.setCursor(0,1);
  lcd.print("Gas:"); lcd.print(g); lcd.print("    ");

  bool alarm = g > 500;
  digitalWrite(BUZZER, alarm);
  digitalWrite(SIREN,  alarm);
  delay(500);
}`,
      },
    ],
  },
];

// =========================
// NIT SCENARIO — NodeMCU + Ultrasonic + PHP web app
// =========================
export const nitScenarios: Scenario[] = [
  {
    id: "nit-ultrasonic-php",
    title: "Ultrasonic Distance Monitor (NodeMCU + PHP)",
    likelihood: 5,
    components: [
      "NodeMCU ESP8266",
      "HC-SR04 Ultrasonic Sensor",
      "Jumper wires",
      "Wi-Fi network",
      "PHP web server (XAMPP / Hostinger / Netlify-friendly host)",
    ],
    tasks: [
      "Measure distance with HC-SR04 on NodeMCU",
      "Send the reading over Wi-Fi (HTTP GET) to data.php",
      "data.php saves the value to a text file",
      "index.php reads the file and displays the live distance with simple HTML/CSS",
    ],
    explanation:
      "The NodeMCU reads the ultrasonic distance every 2 seconds and sends it as ?distance=XX to data.php. data.php writes the value + timestamp into data.txt. index.php opens data.txt and shows the latest reading on a simple styled page that auto-refreshes every 2 seconds. No database needed — easy to deploy.",
    code: [
      {
        language: "cpp",
        filename: "ultrasonic_nodemcu.ino",
        content: `// NodeMCU ESP8266 + HC-SR04 -> PHP web app
// Wiring:
//   HC-SR04 VCC -> Vin (5V)   GND -> GND
//   TRIG -> D5 (GPIO14)       ECHO -> D6 (GPIO12)

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

#define TRIG D5
#define ECHO D6

const char* SSID = "YourWiFi";
const char* PASS = "YourPassword";

// Change to your server URL (XAMPP: http://192.168.1.10/iot/data.php)
const char* SERVER = "http://192.168.1.10/iot/data.php";

long readDistanceCM() {
  digitalWrite(TRIG, LOW);  delayMicroseconds(2);
  digitalWrite(TRIG, HIGH); delayMicroseconds(10);
  digitalWrite(TRIG, LOW);
  long t = pulseIn(ECHO, HIGH, 30000); // timeout 30ms
  if (t == 0) return -1;
  return t / 58; // microseconds -> centimeters
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG, OUTPUT);
  pinMode(ECHO, INPUT);

  WiFi.begin(SSID, PASS);
  Serial.print("Connecting");
  while (WiFi.status() != WL_CONNECTED) { delay(400); Serial.print("."); }
  Serial.println();
  Serial.print("Connected. IP: "); Serial.println(WiFi.localIP());
}

void loop() {
  long cm = readDistanceCM();
  Serial.print("Distance: "); Serial.print(cm); Serial.println(" cm");

  if (WiFi.status() == WL_CONNECTED && cm >= 0) {
    WiFiClient client;
    HTTPClient http;
    String url = String(SERVER) + "?distance=" + String(cm);
    http.begin(client, url);
    int code = http.GET();
    Serial.print("HTTP "); Serial.println(code);
    http.end();
  }

  delay(2000);
}`,
      },
      {
        language: "php",
        filename: "data.php",
        content: `<?php
// data.php — receives distance from NodeMCU and stores it.
// Call:  data.php?distance=42

if (isset($_GET['distance'])) {
    $distance = intval($_GET['distance']);
    $time     = date("Y-m-d H:i:s");
    $line     = $distance . "|" . $time;

    // Save latest reading
    file_put_contents("data.txt", $line);

    // Append to log (optional history)
    file_put_contents("log.txt", $line . PHP_EOL, FILE_APPEND);

    echo "OK saved: " . $distance . " cm at " . $time;
} else {
    echo "No distance received.";
}
?>`,
      },
      {
        language: "php",
        filename: "index.php",
        content: `<?php
// index.php — shows the latest distance reading.
$distance = "--";
$time     = "no data yet";

if (file_exists("data.txt")) {
    $raw   = file_get_contents("data.txt");
    $parts = explode("|", $raw);
    if (count($parts) == 2) {
        $distance = $parts[0];
        $time     = $parts[1];
    }
}

// Decide status color
$status = "OK";
$color  = "#16a34a";
if ($distance !== "--") {
    if ($distance < 20)      { $status = "DANGER"; $color = "#dc2626"; }
    else if ($distance < 50) { $status = "WARNING"; $color = "#f59e0b"; }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="2"> <!-- auto refresh -->
  <title>Ultrasonic Monitor</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: Arial, sans-serif;
      background: #0f172a;
      color: #f1f5f9;
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      background: #1e293b;
      padding: 40px 60px;
      border-radius: 16px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0,0,0,.4);
      min-width: 320px;
    }
    h1 { margin: 0 0 8px; font-size: 22px; color: #94a3b8; font-weight: 500; }
    .value {
      font-size: 84px;
      font-weight: bold;
      margin: 16px 0;
      color: <?php echo $color; ?>;
    }
    .unit { font-size: 24px; color: #94a3b8; }
    .status {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 999px;
      background: <?php echo $color; ?>;
      color: white;
      font-weight: bold;
      margin-top: 8px;
    }
    .time { margin-top: 18px; font-size: 12px; color: #64748b; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Ultrasonic Distance Monitor</h1>
    <div class="value"><?php echo $distance; ?><span class="unit"> cm</span></div>
    <div class="status"><?php echo $status; ?></div>
    <div class="time">Last update: <?php echo $time; ?></div>
  </div>
</body>
</html>`,
      },
    ],
  },
];

