export const infoResponse = {
    "status": "OK",
    "data": [
      {
        "tripCode": "184122056HC7B",
        "status": "NEW",
        "hubId": "1220",
        "createdById": "1006",
        "createdByName": "Nguyễn Trịnh Khánh Tường",
        "lastUpdatedById": "1006",
        "lastUpdatedByName": "Nguyễn Trịnh Khánh Tường",
        "amountCollected": 0,
        "amountCollect": 0,
        "date": "2018-04-20T07:48:00.653Z",
        "id": "5ad99b30e893788f8f000003",
        "createdTime": "2018-04-20T07:48:00.653Z",
        "lastUpdatedTime": "2018-04-20T07:48:00.653Z",
        "stopPoints": [{
          "pointId": "123",
          "type" : "PICK",
          "tripCode": "184122056HC7B",
          "sessionId": "928403432",
          "isUpdated": false,
          "isSucceeded": true,
          "updateUserId": "1006",
          "updateUserName": "Nguyễn Trịnh Khánh Tường",
          "contact" : {
            "contactId": "1234", 
            "contactName": "CircleK Thành Thái",
            "contactPhone": "0948645315",
            "address": "123 Thành Thái",
            "cityCode": "084",
            "cityName": "Hồ Chí Minh",
            "districtCode": "456",
            "districtName": "Quận 10",
            "wardCode": "689",
            "wardName": "Phường 7",
          },
          "pe_id": 5546215,
          orderCodes: ["A123456","B123456"]
          }],          
      }
    ]
  };
  
export const orderDetailResponse = {
"status": "OK",
"data": [
    {
    "tripCode": "1841416KQPRP2",
    "orderCode": "321ABC123A",
    "type": "PICK",
    "orderDetail": {
        "externalCode": "",
        "driverId": "210030",
        "driverName": "Lê Tấn Thắng",
        "driverPhone": "0933932173",
        "collectAmount": 0,
        "length": 1,
        "width": 1,
        "height": 1,
        "weight": 2,
        "fromDistrictId": "1488",
        "fromDistrictCode": "1A03",
        "fromDistrictName": "Quận 10",
        "toDistrictId": "1488",
        "toDistrictCode": "1A03",
        "toDistrictName": "Quận 10",
        "senderHubId": "2007960",
        "senderId": "1539",
        "senderName": "NganHTKN",
        "senderPhone": "0916863003",
        "senderAddress": "75 Tô Hiến Thành ,quận 10, Hồ Chí Minh",
        "receiverId": "",
        "receiverName": "Hồ Thị Kim Ngân",
        "receiverPhone": "01283377234",
        "receiverAddress": "address giao test",
        "clientExtraNote": "Mã SP: 9057382729348000914, Tên SP: Sách Ngược Đời Xuôi, Số lượng: 2 Quyển; ",
        "clientRequiredNote": "Sách Ngược Đời Xuôi, Số lượng: 2 Quyển;",
        "requiredCode": "CHOXEMHANGKHONGTHU",
    }
    }
]
};


export const ordersResponse = {
  "status": "OK",
  "data": [
    {
      "orderCode": "3GUSR6AD",
      "extraInfo": {
        "orderId": "456334",
        "externalCode": "R-R44421-11",
        "senderContact": {
          "contactId": "349091",
          "contactName": "HUB HCM Tân Bình HCM",
          "contactPhone": "028.38113.789",
          "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
          "cityCode": "8",
          "cityName": "Hồ Chí Minh",
          "districtCode": "0214",
          "districtName": "Quận Tân Bình",
          "haveToCollectAmount": 13200
        },
        "receiverContact": {
          "contactId": "0945891357",
          "contactName": "Lộc Y Tế",
          "contactPhone": "0945891357",
          "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
          "cityCode": "8",
          "cityName": "Hồ Chí Minh",
          "districtCode": "0214",
          "districtName": "Quận Tân Bình",
          "haveToCollectAmount": 0
        },
        "pickInfo": {
          "contactId": "349091",
          "contactName": "HUB HCM Tân Bình HCM",
          "contactPhone": "028.38113.789",
          "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
          "cityCode": "8",
          "cityName": "Hồ Chí Minh",
          "districtCode": "0214",
          "districtName": "Quận Tân Bình",
          "haveToCollectAmount": 13200
        },
        "deliverInfo": {
          "contactId": "0945891357",
          "contactName": "Lộc Y Tế",
          "contactPhone": "0945891357",
          "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
          "cityCode": "8",
          "cityName": "Hồ Chí Minh",
          "districtCode": "0214",
          "districtName": "Quận Tân Bình",
          "haveToCollectAmount": 0
        },
        "paymentTypeId": 1,
        "width": 10,
        "length": 10,
        "height": 10,
        "weight": 477,
        "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
        "clientRequiredNote": "iPad Pro 10.5 WiFi + 4G 256GB",
        "requiredCode": "CHOXEMHANGKHONGTHU",
        "date": "2018-07-28T23:59:32.220Z",
        "id": "5b5d036400000004e0000005",
        "createdTime": "2018-07-28T23:59:32.221Z",
        "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
      },
      "inTripIndex": 3,
      "orderCode": "3GUSR6AD",
      "type": "PICK",
      "tripCode": "1871323EADQCF",
      "isUpdated": false,
      "isSucceeded": false,
      "isCollected": false,
      "collectAmount": 13200,
      "isExported": false,
      "isScanned": false,
      "isReturn": false,
      "isCancel": true,
      "date": "2018-07-28T23:59:28.977Z",
      "id": "5b5d0364d231f0711c894b4f",
      "createdTime": "2018-07-28T23:59:32.403Z",
          "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "3GUSRAAA",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "senderContact": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh, Rivera Park lầu 3, cty Scormmerce",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "receiverContact": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh, Rivera Park lầu 3, công ty Scormmerce",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "iPad Pro 10.5 WiFi + 4G 256GB",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "PICK",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "3GUSRBAA",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "senderContact": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "receiverContact": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "PICK",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "3GUSRAAD",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "senderContact": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "receiverContact": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "DELIVER",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "3GUSRAAE",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "senderContact": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "receiverContact": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "RETURN",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "3GUSRAAF",
        "extraInfo": {
          "orderCode": "3GUSRAAF",
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "senderContact": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "receiverContact": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "RETURN",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },
  ],
  total: 7,
  "message": ""
}

export const addOrdersResponse = {
"status": "OK",
"data": [
]
};


export const configResponse = {
    "status": "OK",
    "data": [
        {
            "timeExpire": 86400000,
            "alpha": 0.2,
            "maxWeight": 500000,
            "minWeight": 1,
            "maxSize": 200,
            "minSize": 1,
            "initLoad": 0,
            "initLoadTrial": 1,
            "idsTrial": 0,
            "interval": 10000,
            "fastestInterval": 5000,
            "pushDataInterval": 300000,
            "priority": 1,
            "smallestDisplacement": 30,
            "numberOfRecord": 20,
            "endTimeTracking": 1045,
            "startTimeTracking": 500,
            "orderCode": 0,
            // "minDurationCallLogNoAnswer": "20000",
            // "minDurationCallLogUnconnected": "5000",
            // "repeatCallNoAnswer": "3",
            // "repeatCallUnconnected": "3"
        }
    ],
    "message": ""
}

export const loginResponse = {
	"status": "OK",
	"data": [{
		"session": "c33da2caf778066a60993ad3b1f27669",
		"t62": "76l/fepbLk_TdWgzpIX5wFIBpkBuB1Oy7Fmy3J1nrA4_9z0AM/09g1k32v68_TbNK7bk6bO7bs73qCLw9ei4h004J7kx8kA4E_CceEjy1bM1BrAnd27M8NNDpSEIj2t2Boo3vBaqbNhJTGZxLVbaWG1xHuphxWX9QP_tv",
		"expired": 1535957767010,
		"userInfo": {
			"id": "5b6b645a4536eb39a073b195",
			"ssoId": "210030",
			"profile": {
				"email": "thanglt@ghn.vn",
				"fullname": "Lê Tấn Thắng",
				"phone": "0933932173"
			},
			"status": 2,
			"isSupperUser": true,
			"warehouseIds": [1323],
			"roles": [{
				"roleCode": "ROLE_DRIVER",
				"name": "Tài xế",
				"description": "TÀI XẾ",
				"roles": [],
				"permissionList": ["API_TRIP_V2_PROFILE", "API_TRIP_V2_GET_TRIP", "API_TRIP_V2_SEARCH", "API_TRIP_V2_ITEM_VIEW", "API_TRIP_V2_ORDER", "API_TRIP_V2_ORDER_INTERNAL", "API_TRIP_V2_HISTORY_TRIP", "API_TRIP_V2_HISTORY_ORDER", "API_TRIP_V2_ITEM_BY_ORDER", "API_TRIP_V2_ITEM_SEARCH", "API_TRIP_V2_HISTORY", "API_QUERY_TRIP", "API_TRIP_V2_ITEM_ADD", "API_TRIP_V2_ITEM_UPDATE", "API_MPDS_GET_ORDER_V2"],
				"id": "5adf158ad231f00e3da35576",
				"createdTime": "2018-04-24T11:31:22.447Z",
				"lastUpdatedTime": "2018-08-09T02:32:45.786Z"
			}],
			"ref": {
				"ports": "[]"
			}
		}
	}],
	"message": "Create Session successfully."
}

// export const updateResponse = {
//   "status": "OK",
//   "data": {
//     failed_orders: []
//   },
//   "message": "Successfull"
// }

export const feeResponse = {
  "status": "OK",
  "data": [
    {
        "orderCode": "3GUSRAAA",
        "type": "PICK",
        oldServiceFee: 125456,
        newServiceFee: 128456,
        isFeeVisible: false,
    }
  ],
  "message": "Successfull error Successfull error Successfull error Successfull errorSuccessfull error Successfull error Successfull error Successfull error"
}

export const updateRDCResponse = {
  "status": "OK",
  "data": [
    {
        "orderCode": "3GUSRAAA",
        "type": "PICK",
        "newCollectAmount": 0,
        paymentTypeId: 2,
    }
  ],
  "message": "Successfull error Successfull error Successfull error Successfull errorSuccessfull error Successfull error Successfull error Successfull error"
}

export const updateStatusResponse = {
  "status": "OK",
  "data": [
    {
        "orderCode": "3GUSRAAA",
        "type": "PICK",
    }
  ],
  "message": "Successfull"
}

export const updateSessionResponse = {
  "status": "OK",
  "data": [
    {
        "orderCode": "A123456",
        "type": "TRANSIT_IN",
    },
    {
      "orderCode": "B123456",
      "type": "TRANSIT_IN",
    }
  ],
  "message": "Successfull"
}


export const startSessionResponse = {
  "status": "OK",
  "data": [
      {
        "orderCode": "3GUSRBAA",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "pickInfo": {
            "contactId": "349091",
            "contactName": "HUB HCM Tân Bình HCM",
            "contactPhone": "028.38113.789",
            "address": "HUB Quận Tân Bình 38 Nguyễn Bá Tuyển, Phường 12, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "requiredCode": "CHOXEMHANGKHONGTHU",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "PICK",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "A123456",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "pickInfo": {
            "contactId": "1234", 
            "contactName": "CircleK Thành Thái",
            "contactPhone": "0948645315",
            "address": "123 Thành Thái",
            "cityCode": "084",
            "cityName": "Hồ Chí Minh",
            "districtCode": "456",
            "districtName": "Quận 10",
            "wardCode": "689",
            "wardName": "Phường 7",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "TRANSIT_IN",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },

      {
        "orderCode": "B123456",
        "extraInfo": {
          "orderId": "456334",
          "externalCode": "R-R44421-11",
          "pickInfo": {
            "contactId": "1234", 
            "contactName": "CircleK Thành Thái",
            "contactPhone": "0948645315",
            "address": "123 Thành Thái",
            "cityCode": "084",
            "cityName": "Hồ Chí Minh",
            "districtCode": "456",
            "districtName": "Quận 10",
            "wardCode": "689",
            "wardName": "Phường 7",
            "haveToCollectAmount": 13200
          },
          "deliverInfo": {
            "contactId": "0945891357",
            "contactName": "Lộc Y Tế",
            "contactPhone": "0945891357",
            "address": "373/192 Lý Thường Kiệt, Phường 08, Tân Bình, Hồ Chí Minh",
            "cityCode": "8",
            "cityName": "Hồ Chí Minh",
            "districtCode": "0214",
            "districtName": "Quận Tân Bình",
            "haveToCollectAmount": 0
          },
          "paymentTypeId": 1,
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 477,
          "clientExtraNote": " x Apple iPad Pro 10.5 WiFi + 4G 256GB - MPHH2 - Bạc - Model 2017 (Nhập khẩu chính Hãng)",
          "clientRequiredNote": "",
          "date": "2018-07-28T23:59:32.220Z",
          "id": "5b5d036400000004e0000005",
          "createdTime": "2018-07-28T23:59:32.221Z",
          "lastUpdatedTime": "2018-07-28T23:59:32.221Z"
        },
        "inTripIndex": 3,
        "type": "TRANSIT_IN",
        "tripCode": "1871323EADQCF",
        "isUpdated": false,
        "isSucceeded": false,
        "isCollected": false,
        "collectAmount": 13200,
        "isExported": false,
        "isScanned": false,
        "isReturn": false,
        "isCancel": false,
        "date": "2018-07-28T23:59:28.977Z",
        "id": "5b5d0364d231f0711c894b4f",
        "createdTime": "2018-07-28T23:59:32.403Z",
            "lastUpdatedTime": "2018-07-28T23:59:45.008Z"
      },
  ],
  total: 7,
  "message": ""
}



export const orderHistoryResponse = {
    "status":"OK",
    "data":[
        {
        "orderCode":"3C5DFSAK","actionCode":"ADD_TO_PDS","userId":"210030","userName":"Lê Tấn Thắng",
        historyType: 'CREATE_TRIP', 
        createdById: 1006,
        createdByName: 'Nguyen Khanh Tuong',
        "date":"2018-03-16T04:39:42.330Z","id":"5aab4a8ee81ce73bda00004f","createdTime":"2018-03-16T04:39:42.331Z","lastUpdatedTime":"2018-03-16T04:39:42.331Z"
        },
        {
        "orderCode":"3C5DFSAK","actionCode":"UPDATE_STATUS","userId":"206353","userName":"Nguyễn Trương Quý",
        historyType: 'ADD_TO_TRIP', 
        createdById: 210030, 
        createdByName: 'Le Tan Thang',
        "date":"2018-03-23T04:20:11.608Z","id":"5ab4807be8347c2a1c000004","createdTime":"2018-03-23T04:20:11.610Z","lastUpdatedTime":"2018-03-23T04:20:11.610Z"
        }
    ],
    "message":""
};

export const newOrdersResponse = {
    "status": "OK",
    "data": [
        {
            "hubId": "1323",
            "orderCode": "3G7LXQ51",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-05T03:00:21.278Z",
            "expectedDate": "2018-07-05T03:00:21.278Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3d89c56d0d850ed491e542",
            "createdTime": "2018-07-05T03:00:21.541Z",
            "lastUpdatedTime": "2018-07-05T03:00:21.554Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3G64XQRN",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-05T03:07:37.221Z",
            "expectedDate": "2018-07-05T03:07:37.221Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3d8b796d0d850ed491e54b",
            "createdTime": "2018-07-05T03:07:37.401Z",
            "lastUpdatedTime": "2018-07-05T03:07:37.532Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3GUSFQK4",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-06T06:50:02.246Z",
            "expectedDate": "2018-07-06T06:50:02.246Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3f111a6d0d850ed491ec84",
            "createdTime": "2018-07-06T06:50:02.943Z",
            "lastUpdatedTime": "2018-07-06T07:02:21.127Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3G54F9HK",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-06T08:01:47.032Z",
            "expectedDate": "2018-07-06T08:01:47.032Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3f21eb6d0d850ed491edbe",
            "createdTime": "2018-07-06T08:01:47.252Z",
            "lastUpdatedTime": "2018-07-09T07:06:00.502Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3GY69A4X",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-06T08:08:16.518Z",
            "expectedDate": "2018-07-06T08:08:16.518Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3f23706d0d850ed491ee13",
            "createdTime": "2018-07-06T08:08:16.777Z",
            "lastUpdatedTime": "2018-07-06T08:08:16.860Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3G4UXQY9",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-06T08:12:31.254Z",
            "expectedDate": "2018-07-06T08:12:31.254Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3f246f6d0d850ed491ee34",
            "createdTime": "2018-07-06T08:12:31.475Z",
            "lastUpdatedTime": "2018-07-06T08:12:31.482Z"
        },
        {
            "hubId": "1323",
            "orderCode": "3GSHFQLL",
            "status": "READY_TO_PICK",
            "target": "PICK",
            "isReady": false,
            "actionDate": "2018-07-06T08:42:36.340Z",
            "expectedDate": "2018-07-06T08:42:36.340Z",
            "groups": [
                "1323/PICK/DISTRICT/0215",
                "1323/PICK/WARD/0215-UNDEFINED",
                "1323/PICK/CLIENT_HUB/348897"
            ],
            "id": "5b3f2b7c6d0d850ed491ee82",
            "createdTime": "2018-07-06T08:42:36.855Z",
            "lastUpdatedTime": "2018-07-07T03:40:18.054Z"
        }
    ],
    "total": 7,
    "message": "Query OrderItem successfully."
}


export const ordersInfoResponse = {
  "status": "OK",
  "data": [
      {
          "orderCode": "3GUSR6AD",
          "partnerAction": "ReadyToPick",
          "partnerStatus": "ReadyToPick",
          "lastUpdateFromPartner": "2018-08-29T11:12:29.701Z",
          "status": "PICKING",
          "action": "PICK",
          "isCancel": false,
          "lost": false,
          "tripId": "Unknown_Id",
          "tripPartner": "Unknown_Partner",
          "width": 10,
          "length": 10,
          "height": 10,
          "weight": 111,
          "date": "2018-08-29T11:12:29.639Z",
          "id": "5b867f9d000000171a000002",
          "createdTime": "2018-08-29T11:12:29.725Z",
          "lastUpdatedTime": "2018-08-29T11:17:38.660Z"
      }
  ],
  "total": 1,
  "message": "Query OrderOpsInfo successfully."
}

export const sortingResponse = {
  "status": "OK",
  "data": [
      {
          "orderCode": "3GUSRAAA",
          "label": "01-03-02/22/Giao"
      }
  ]
}

export const scanResponse = {
  "hash_id":"35c43e281210c374299287d57495a001",
  "post_id":195,
  "pe_id":888888,
  "token":"35c43e281210c374299287d57495a001",
  "random":0.3916305180133064
};

export const cvsResponse = {
  "list_code": [
    {
        "external_code": "33LF63KK"
    },
    {
        "external_code": "3364Q1HU"
    },
    {
        "external_code": "33SHQ1FU"
    },
    {
        "external_code": "33SHQ1FD"
    },
    {
        "external_code": "33R7Q1F7"
    },
    {
        "external_code": "335491FX"
    },
    {
        "external_code": "33349796"
    },
    {
        "external_code": "337LQ1YL"
    },
    {
        "external_code": "33FQS13R"
    },
    {
        "external_code": "33NF713A"
    },
  ],
  "status": "ok",
  "message": "",
};
