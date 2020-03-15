#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <unistd.h>
#include <sys/socket.h>
#include <sys/un.h>

#include <nfc/nfc.h>
#include <curl/curl.h>

#include <json-c/json.h>


char *socket_path = "/tmp/icp-test";

// By default we expect the PN532 to be connected via SPI
#define DEFAULT_CONN_STRING "pn532_spi:/dev/spidev0.0:1000000"

// Maximum payload size for APDUs in the data transmission. You might have to lower this for your phone.
#define DATA_PACKET_SIZE 250

// Default timeout for APDU transmissions
#define TX_TIMEOUT 1000

// Poll for a ISO14443A (MIFARE) tag
const nfc_modulation mod_mifare = {
        .nmt = NMT_ISO14443A,
        .nbr = NBR_106,
};

struct data_buffer {
    char *ptr;
    size_t size;
};

void print_hex(FILE *fd, const uint8_t *data, const size_t len) {
    size_t pos;
    for (pos = 0; pos < len; pos++) {
        fprintf(fd, "%02x", data[pos]);
    }
}

static char hexchars[] = "0123456789abcdef";

void bytesToHex(const uint8_t *bytes, size_t size, char *hex) {
  while (size--)  {
    *hex++ = hexchars[*bytes >> 4];
    *hex++ = hexchars[*bytes & 15];
    bytes++;
  }
  *hex = '\0';
}

int card_transmit(nfc_device *pnd, uint8_t *capdu, size_t capdulen, uint8_t *rapdu, size_t *rapdulen) {
    int res;
    // printf("=> ");
    // print_hex(stdout, capdu, capdulen);
    // printf("\n");
    if ((res = nfc_initiator_transceive_bytes(pnd, capdu, capdulen, rapdu, *rapdulen, TX_TIMEOUT)) < 0) {
        return -1;
    } else {
        *rapdulen = (size_t) res;
        // printf("<= ");
        // print_hex(stdout, rapdu, res);
        // printf("\n");
        return 0;
    }
}

char* communicateWithSmartphone(nfc_device *pnd, const char* toSend, uint8_t code) {
  uint8_t command_apdu[512];
  uint8_t response_apdu[512];
  size_t command_apdu_len;
  size_t response_apdu_len;
  command_apdu_len = strlen(toSend)+sizeof(code)+1;
  command_apdu[0] = code;
  response_apdu_len = sizeof(response_apdu);
  memcpy(command_apdu+1, toSend, strlen(toSend));
  if (card_transmit(pnd, command_apdu, command_apdu_len, response_apdu, &response_apdu_len) < 0) {
      fprintf(stderr, "Sending data failed: %s\n", nfc_strerror(pnd));
      nfc_initiator_deselect_target(pnd);
      return "error";
  }
  if (response_apdu_len < 1) {
      fprintf(stderr, "Sending data failed.\n");
      nfc_initiator_deselect_target(pnd);
      return "error";
  }
  char* dataStr = malloc(512);
  bytesToHex(response_apdu, response_apdu_len, dataStr);
  return dataStr;
  //return toString(response_apdu, response_apdu_len);
}

char* nfc_function(nfc_device *pnd, nfc_target target, const char* paymentHash, const char* timestampStart, const char* timestampEnd, const char* units, const char* usageFee, const char* device) {
  while (true) {

      printf("Waiting for device...\n");
      if (nfc_initiator_select_passive_target(pnd, mod_mifare, NULL, 0, &target) > 0) {
          uint8_t command_apdu[512];
          uint8_t response_apdu[512];
          size_t command_apdu_len;
          size_t response_apdu_len;

          // send selection application APDU
          command_apdu_len = 11;
          response_apdu_len = sizeof(response_apdu);
          memcpy(command_apdu, "\x00\xA4\x04\x00\x06\xF0\xAB\xCD\xEF\x00\x00", command_apdu_len);
          if (card_transmit(pnd, command_apdu, command_apdu_len, response_apdu, &response_apdu_len) < 0) {
              fprintf(stderr, "SELECT AID APDU transmission failed: %s\n", nfc_strerror(pnd));
              nfc_initiator_deselect_target(pnd);
              return "";
          }
          if (response_apdu_len < 2 || response_apdu[response_apdu_len - 2] != 0x90 ||
              response_apdu[response_apdu_len - 1] != 0x00) {
              fprintf(stderr, "Malformed SELECT AID APDU response\n");
              nfc_initiator_deselect_target(pnd);
              return "";
          }


          // char* paymentHash = "0xdfc5cace8d4a967c482581155f177e74276d56324618268c0da5032848582094";
          char* tmp = communicateWithSmartphone(pnd, paymentHash, 0x01);
          printf("paymentHash %s\n", paymentHash);
          free(tmp);
          // char* timestampStart = "1580999861";
          tmp = communicateWithSmartphone(pnd, timestampStart, 0x02);
          printf("timestampStart %s\n", timestampStart);
          free(tmp);
          // char* timestampEnd = "1589639317";
          tmp = communicateWithSmartphone(pnd, timestampEnd, 0x03);
          printf("timestampEnd %s\n", timestampEnd);
          free(tmp);
          // char* units = "10";
          tmp = communicateWithSmartphone(pnd, units, 0x04);
          printf("units %s\n", units);
          free(tmp);
          // char* usageFee = "1";
          tmp = communicateWithSmartphone(pnd, usageFee, 0x05);
          printf("usageFee %s\n", usageFee);
          free(tmp);
          // char* device = "0xf00C699c96E05f919EE1C57B824a29cC6216352E";
          tmp = communicateWithSmartphone(pnd, device, 0x06);
          printf("device %s\n", device);
          free(tmp);

          char* address = communicateWithSmartphone(pnd, "", 0x07);
          uint8_t* test = communicateWithSmartphone(pnd, "", 0x07);
          printf("address %s\n", address);
          char* signature = communicateWithSmartphone(pnd, "", 0x00);
          printf("signature 0x%s\n", signature);

          char* str1 = "{\"type\":\"message\",\"data\":{\"paymentHash\":\"";
          char* str2 = "\",\"timestampStart\":\"";
          char* str3 = "\",\"timestampEnd\":\"";
          char* str4 = "\",\"units\":\"";
          char* str5 = "\",\"usageFee\":\"";
          char* str6 = "\",\"device\":\"";
          char* str7 = "\",\"signature\":\"";
          char* str8 = "\",\"address\":\"";
          char* str9 = "\"}}\f";


          char* json = malloc(1024);

          strcpy(json, str1);
          strcat(json, paymentHash);
          strcat(json, str2);
          strcat(json, timestampStart);
          strcat(json, str3);
          strcat(json, timestampEnd);
          strcat(json, str4);
          strcat(json, units);
          strcat(json, str5);
          strcat(json, usageFee);
          strcat(json, str6);
          strcat(json, device);
          strcat(json, str7);
          strcat(json, signature);
          strcat(json, str8);
          strcat(json, address);
          strcat(json, str9);

          printf("size: %d\n", strlen(json));


          free(address);
          free(signature);
          return json;
      }

  }
}

int main(int argc, const char *argv[]) {

    // initialize NFC reader
    const char *lib_version = nfc_version();
    printf("Using libnfc version: %s\n", lib_version);

    nfc_device *pnd = NULL;
    nfc_context *context = NULL;

    nfc_init(&context);
    if (!context) {
        fprintf(stderr, "Unable to initialize nfc (nfc_init failed)\n");
        exit(EXIT_FAILURE);
    }

    const char *conn_string = argc > 1 ? argv[1] : DEFAULT_CONN_STRING;
    pnd = nfc_open(context, conn_string);
    if (!pnd) {
        fprintf(stderr, "Unable to open device: %s\n", conn_string);
        exit(EXIT_FAILURE);
    }

    if (nfc_initiator_init(pnd) < 0) {
        fprintf(stderr, "nfc_initiator_init failed: %s\n", nfc_strerror(pnd));
        exit(EXIT_FAILURE);
    }

    printf("NFC device opened: %s\n", nfc_device_get_name(pnd));


    nfc_target target;













    struct sockaddr_un addr;
    char buf[512];
    int fd,cl,rc;


    if ( (fd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
      perror("socket error");
      exit(-1);
    }

    memset(&addr, 0, sizeof(addr));
    addr.sun_family = AF_UNIX;
    if (*socket_path == '\0') {
      *addr.sun_path = '\0';
      strncpy(addr.sun_path+1, socket_path+1, sizeof(addr.sun_path)-2);
    } else {
      strncpy(addr.sun_path, socket_path, sizeof(addr.sun_path)-1);
      unlink(socket_path);
    }

    if (bind(fd, (struct sockaddr*)&addr, sizeof(addr)) == -1) {
      perror("bind error");
      exit(-1);
    }

    if (listen(fd, 5) == -1) {
      perror("listen error");
      exit(-1);
    }

    while (1) {
      if ( (cl = accept(fd, NULL, NULL)) == -1) {
        perror("accept error");
        continue;
      }

      while ( (rc=read(cl,buf,sizeof(buf))) > 0) {
        printf("read %u bytes: %.*s\n", rc, rc, buf);







        // char* test = "{\"paymentHash\":\"0xdfc5cace8d4a967c482581155f177e74276d56324618268c0da5032848582094\",\"timestampStart\":\"1580999861\",\"timestampEnd\":\"1589639317\",\"units\":\"11\",\"device\":\"0xf00C699c96E05f919EE1C57B824a29cC6216352E\"}";
        // printf("test: %s\n", test);
        struct json_object *parsed_json;
      	struct json_object *paymentHashJSON;
      	struct json_object *timestampStartJSON;
      	struct json_object *timestampEndJSON;
      	struct json_object *unitsJSON;
      	struct json_object *usageFeeJSON;
      	struct json_object *deviceJSON;
      	struct json_object *dataJSON;

        parsed_json = json_tokener_parse(buf);

        json_object_object_get_ex(parsed_json, "data", &dataJSON);

      	json_object_object_get_ex(dataJSON, "paymentHash", &paymentHashJSON);
      	json_object_object_get_ex(dataJSON, "timestampStart", &timestampStartJSON);
      	json_object_object_get_ex(dataJSON, "timestampEnd", &timestampEndJSON);
      	json_object_object_get_ex(dataJSON, "units", &unitsJSON);
      	json_object_object_get_ex(dataJSON, "usageFee", &usageFeeJSON);
      	json_object_object_get_ex(dataJSON, "device", &deviceJSON);

        const char* paymentHash = json_object_get_string(paymentHashJSON);
        const char* timestampStart = json_object_get_string(timestampStartJSON);
        const char* timestampEnd = json_object_get_string(timestampEndJSON);
        const char* units = json_object_get_string(unitsJSON);
        const char* usageFee = json_object_get_string(usageFeeJSON);
        const char* device = json_object_get_string(deviceJSON);

        printf("paymentHash %s\n", paymentHash);
        printf("timestampStart %s\n", timestampStart);
        printf("timestampEnd %s\n", timestampEnd);
        printf("units %s\n", units);
        printf("usageFee %s\n", usageFee);
        printf("device %s\n", device);

        char* msg = nfc_function(pnd, target, paymentHash, timestampStart, timestampEnd, units, usageFee, device);
        printf("JSON: %s\n", msg);
        int n = write(cl,msg,strlen(msg));
        if(n < 0){
            printf("send failed\n");
        }else{
            printf("sent %d bytes\n", n);
        }
        free(msg);
      }
      if (rc == -1) {
        perror("read");
        exit(-1);
      }
      else if (rc == 0) {
        printf("EOF\n");
        close(cl);
      }
      else {
        printf("test\n");
      }

    }














    // clean up
    nfc_close(pnd);
    nfc_exit(context);

    exit(EXIT_SUCCESS);
}
