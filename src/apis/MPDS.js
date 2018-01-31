import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import ShareVariables from '../libs/ShareVariables';
import moment from 'moment';

//!!!!!!!!! turn on mock data!!!!!!!!!!
const mockOn = true;

// const DOMAIN = 'api.inhubv2.ghn.vn';
const DOMAIN = 'api.staging.inhubv2.ghn.vn';
// const DOMAIN = 'api.inhub-ghn.tk';
const BASE_URL = `http://${DOMAIN}/v2`;

const Share = new ShareVariables();
const mock = mockOn ? new MockAdapter(axios) : null;

export const GetUserActivePds = (UserID) => {
  const URL = `${BASE_URL}/pdaone/${UserID}`;
  const LoginHeader = Share.LoginHeader;

  const config = {
    headers: LoginHeader,
    timeout: 3000
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, sampleResponse);
  }
  return axios.get(URL, config);
};

export const UpdatePickDeliverySession = ({ PDSID, OrderInfos }) => {
  const URL = `${BASE_URL}/pdaone/${PDSID}`;
  const params = {
    PDSID,
    OrderInfos
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };

  if (mockOn) {
    mock.onPut(URL, params, config).reply(200, updateResponse);
  }

  return axios.put(URL, params, config);
};

export const UpdateOrderWeightRDC = ({ 
  Length,
  Width,
  Height,
  Weight,
  ClientID,
  OrderCode,
  PDSID }) => {  
  const URL = `${BASE_URL}/fee`;
  const LoginInfo = Share.getLoginInfo();
  const params = {
    ...LoginInfo,
    Length,
    Width,
    Height,
    Weight,
    ClientID,
    OrderCode,
    PDSID
  };
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.put(URL, params, config);
};

export const Authenticate = ({ UserID, Password }) => {
  const URL = `http://${DOMAIN}/acc/pdaLogin`;

  if (mockOn) {
    mock.onPost(URL, {
        userid: UserID,
        password: Password
      }).reply(200, loginResponse);
  }

  return axios.post(URL, {
      userid: UserID,
      password: Password
    });
};

export const GetUserPerformance = (UserID, from = null, to = null) => {
  const URL = `${BASE_URL}/performance/${UserID}`;
  const LoginHeader = Share.LoginHeader;
  const config = {
      headers: LoginHeader,
      timeout: 3000,
      params: {
          q: { from, to }
      }
    };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, performanceResponse);
  }
  return axios.get(URL, config);
};

export const GetConfiguration = (configKey = null) => {
  const URL = `${BASE_URL}/pdaconfig`;
  const LoginHeader = Share.LoginHeader;
  const config = { 
      headers: LoginHeader,
      params: { configKey }
  };

  if (mockOn) {
    mock.onGet(URL, config).reply(200, configResponse);
  }
  
  return axios.get(URL, config);
};
  
export const CalculateServiceFee = (params) => {
  const URL = `${BASE_URL}/fee`;
  const LoginHeader = Share.LoginHeader;
  const config = { headers: LoginHeader };
  return axios.post(URL, params, config);
};

export const GetOrderByCode = (OrderCode) => {
    const URL = `${BASE_URL}/order`;
    const LoginHeader = Share.LoginHeader;
    const config = {
        headers: LoginHeader,
        timeout: 3000,
        params: {
            q: { order_code: OrderCode }
        }
        };
    return axios.get(URL, config);
};

export const AddOrders = (OrderCodes, psdID, PickDeliveryType = 2) => {
    const URL = `${BASE_URL}/pds`;
    const LoginHeader = Share.LoginHeader;

    const type = PickDeliveryType == 2 ? 'DELIVER' : 'PICK';
    const config = {
        headers: LoginHeader,
        timeout: 90000
        };
    const params = {
        order_codes: OrderCodes,
        pds_id: psdID,
        type
    };

    console.log(params);

    return axios.put(URL, params, config);
};





const sampleResponse = {
  "status": "OK",
  "data": [
      {
          "EmployeeFullName": "Võ Đức Đạt",
          "CoordinatorFullName": "Trần Chí Cường",
          "CoordinatorPhone": "0939006988",
          "PickDeliverySessionID": "59c252cfbae4ba02c08327ba",
          "PDSCode": "170920DVPGUN",
          "StartTime": "Sep 20, 2017 6:37:21 PM",
          "SType": 0,
          "PDSItems": [
              {
                  "OrderCode": "23RUXR4",
                  "CurrentStatus": "STORING",
                  "RecipientName": "Mr Siro",
                  "RecipientPhone": "01668117449",
                  "CODAmount": 0,
                  "ServiceCost": 0,
                  "Note": "",
                  "Log": "",
                  "PickDeliverySessionDetailID": "59c252cfe5c882d9f5122e2b",
                  "PaymentTypeID": 0,
                  "TotalExtraFee": 0,
                  "Weight": 500,
                  "ServiceID": 53321,
                  "ServiceName": "2 Ngày",
                  "TotalCollectedAmount": 0,
                  "NextStatus": "",
                  "Length": 10,
                  "Width": 10,
                  "Height": 10,
                  "FromDistrictID": 1453,
                  "ToDistrictID": 2086,
                  "Lat": 0,
                  "Lng": 0,
                  "DistrictCode": "0211",
                  "DistrictName": "Quận 11",
                  "IsTrial": 0,
                  "PickDeliveryType": 1,
                  "ClientID": 1,
                  "ClientName": 'Sendo.vn',
                  "ContactName": "Shop Dong Ho",
                  "ContactPhone": "01668117449",
                  "ClientHubID": 653473,
                  "DeliveryAddress": "7 To Hien Thanh, Ho Chi Minh City, Ho Chi Minh, Vietnam",
                  "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
              },
              {
                "OrderCode": "23RUXR4",
                "CurrentStatus": "DELIVERING",
                "RecipientName": "Mr Siro",
                "RecipientPhone": "01668117449",
                "CODAmount": 0,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f5122e2b",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53321,
                "ServiceName": "2 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 2,
                "ClientID": 1,
                "ClientName": 'Sendo.vn',
                "ContactName": "Shop Dong Ho",
                "ContactPhone": "01668117449",
                "ClientHubID": 653473,
                "DisplayOrder": 2,
                "DeliveryAddress": "7 To Hien Thanh, Ho Chi Minh City, Ho Chi Minh, Vietnam",
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam",
              },
              {
                  "OrderCode": "23ABCN9",
                  "CurrentStatus": "PICKING",
                  "RecipientName": "Ng Van A",
                  "RecipientPhone": "01668117449",
                  "CODAmount": 71500,
                  "ServiceCost": 0,
                  "Note": "",
                  "Log": "",
                  "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                  "PaymentTypeID": 0,
                  "TotalExtraFee": 0,
                  "Weight": 500,
                  "ServiceID": 53320,
                  "ServiceName": "1 Ngày",
                  "TotalCollectedAmount": 0,
                  "NextStatus": "",
                  "Length": 10,
                  "Width": 10,
                  "Height": 10,
                  "FromDistrictID": 1453,
                  "ToDistrictID": 2086,
                  "Lat": 0,
                  "Lng": 0,
                  "DistrictCode": "0211",
                  "DistrictName": "Quận 11",
                  "IsTrial": 0,
                  "PickDeliveryType": 1,
                  "ClientID": 1,
                  "ClientName": 'Sendo.vn',
                  "ContactName": "Shop Dong Ho",
                  "ContactPhone": "01668117449",
                  "ClientHubID": 653473,
                  "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
              },
              {
                "OrderCode": "23ABCN8",
                "CurrentStatus": "PICKING",
                "RecipientName": "Le Van B",
                "RecipientPhone": "01668117448",
                "CODAmount": 70500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581d",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 1,
                "ClientName": 'Sendo.vn',
                "ContactName": "Shop Dong Ho",
                "ContactPhone": "01668117449",
                "ClientHubID": 653473,
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            {
                "OrderCode": "CDENNH9",
                "CurrentStatus": "PICKING",
                "RecipientName": "Bui Van Muc",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 1,
                "ClientName": 'Sendo.vn',
                "ContactName": "Cau be vang",
                "ContactPhone": "01668117449",
                "ClientHubID": 659473,
                "Address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            {
                "OrderCode": "CDENMMM",
                "CurrentStatus": "STORING",
                "RecipientName": "Le Tan Thang",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 1,
                "ClientName": 'Sendo.vn',
                "ContactName": "Vi Tinh Ngoi Sao",
                "ContactPhone": "01662217449",
                "ClientHubID": 652273,
                "Address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            {
                "OrderCode": "CDENNNM",
                "CurrentStatus": "PICKING",
                "RecipientName": "Ho Van Tri",
                "RecipientPhone": "01668115549",
                "CODAmount": 81500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 1,
                "ClientName": 'Sendo.vn',
                "ContactName": "Vi Tinh Ngoi Sao",
                "ContactPhone": "01662217449",
                "ClientHubID": 652273,
                "Address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            /* addorder*/
            // {
            //     "OrderCode": "AAAAAAA",
            //     "CurrentStatus": "PICKING",
            //     "RecipientName": "Ho Van Tri",
            //     "RecipientPhone": "01668115549",
            //     "CODAmount": 81500,
            //     "ServiceCost": 0,
            //     "Note": "",
            //     "Log": "",
            //     "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
            //     "PaymentTypeID": 0,
            //     "TotalExtraFee": 0,
            //     "Weight": 500,
            //     "ServiceID": 53320,
            //     "ServiceName": "1 Ngày",
            //     "TotalCollectedAmount": 0,
            //     "NextStatus": "",
            //     "Length": 10,
            //     "Width": 10,
            //     "Height": 10,
            //     "FromDistrictID": 1453,
            //     "ToDistrictID": 2086,
            //     "Lat": 0,
            //     "Lng": 0,
            //     "DistrictCode": "0211",
            //     "DistrictName": "Quận 11",
            //     "IsTrial": 0,
            //     "PickDeliveryType": 1,
            //     "ClientID": 1,
            //     "ClientName": 'Sendo.vn',
            //     "ContactName": "Vi Tinh Ngoi Sao",
            //     "ContactPhone": "01662217449",
            //     "ClientHubID": 652273,
            //     "Address": "70 Ngo Gia Tu, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            // },
            {
                "OrderCode": "123NNH9",
                "CurrentStatus": "PICKING",
                "RecipientName": "Nguoi nhan",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 2,
                "ClientName": 'Shoppee',
                "ContactName": "Shop B",
                "ContactPhone": "01668117449",
                "ClientHubID": 653474,
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            {
              "OrderCode": "HYT5NNH",
              "CurrentStatus": "PICKING",
              "RecipientName": "Cường gửi",
              "RecipientPhone": "01668117449",
              "CODAmount": 71500,
              "ServiceCost": 0,
              "Note": "",
              "Log": "",
              "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
              "PaymentTypeID": 0,
              "TotalExtraFee": 0,
              "Weight": 500,
              "ServiceID": 53320,
              "ServiceName": "1 Ngày",
              "TotalCollectedAmount": 0,
              "NextStatus": "",
              "Length": 10,
              "Width": 10,
              "Height": 10,
              "FromDistrictID": 1453,
              "ToDistrictID": 2086,
              "Lat": 0,
              "Lng": 0,
              "DistrictCode": "0211",
              "DistrictName": "Quận 11",
              "IsTrial": 0,
              "PickDeliveryType": 1,
              "ClientID": 2,
              "ClientName": 'Shoppee',
              "ContactName": "Cường gửi",
              "ContactPhone": "01668117449",
              "ClientHubID": 653474,
              "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
            },
            {
                "OrderCode": "JJKFJD9",
                "CurrentStatus": "DELIVERING",
                "RecipientName": "Cường gửi",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 2,
                "ClientID": 2,
                "ClientName": 'Shoppee',
                "ContactName": "Cường gửi",
                "ContactPhone": "01668117449",
                "ClientHubID": 653474,
                "DeliveryAddress": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam",
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam",
                "DisplayOrder": 3
              },
              {
                "OrderCode": "J888JD9",
                "CurrentStatus": "PICKING",
                "RecipientName": "Cường gửi",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 1,
                "ClientID": 2,
                "ClientName": 'Shoppee',
                "ContactName": "Cường gửi",
                "ContactPhone": "01668117449",
                "ClientHubID": 653474,
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
              },
              {
                "OrderCode": "JJAAJD9",
                "CurrentStatus": "RETURNING",
                "RecipientName": "Cường gửi",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 3,
                "ClientID": 2,
                "ClientName": 'Shoppee',
                "ContactName": "Cường gửi",
                "ContactPhone": "01668117449",
                "ClientHubID": 653474,
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
              },
              {
                "OrderCode": "JJAAJAA",
                "CurrentStatus": "RETURNING",
                "RecipientName": "Cường gửi",
                "RecipientPhone": "01668117449",
                "CODAmount": 71500,
                "ServiceCost": 0,
                "Note": "",
                "Log": "",
                "PickDeliverySessionDetailID": "59c252cfe5c882d9f512581c",
                "PaymentTypeID": 0,
                "TotalExtraFee": 0,
                "Weight": 500,
                "ServiceID": 53320,
                "ServiceName": "1 Ngày",
                "TotalCollectedAmount": 0,
                "NextStatus": "",
                "Length": 10,
                "Width": 10,
                "Height": 10,
                "FromDistrictID": 1453,
                "ToDistrictID": 2086,
                "Lat": 0,
                "Lng": 0,
                "DistrictCode": "0211",
                "DistrictName": "Quận 11",
                "IsTrial": 0,
                "PickDeliveryType": 3,
                "ClientID": 2,
                "ClientName": 'Shoppee',
                "ContactName": "Cường gửi",
                "ContactPhone": "01668117449",
                "ClientHubID": 653474,
                "Address": "70 Lu Gia, Ho Chi Minh City, Ho Chi Minh, Vietnam"
              }
          ],
          "timeServer": 0,
          "code": 1
      }
  ],
  "message": ""
}


const configResponse = {
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
            "code": 0,
            // "minDurationCallLogNoAnswer": "20000",
            // "minDurationCallLogUnconnected": "5000",
            // "repeatCallNoAnswer": "3",
            // "repeatCallUnconnected": "3"
        }
    ],
    "message": ""
}

const loginResponse = {
    "status": "OK",
    "message": "Successfull",
    "data": {
        "session": "40cf13dc238677d0c3632a5c30276c61",
        "expired": 1506671613820,
        "userInfo": {
            "fullname": "Lê Tấn Thắng",
            "email": "thanglt@ghn.vn",
            "phone": "0933932173",
            "ssoId": "210030",
            "roles": [
                {
                    "name": "PDA",
                    "description": "Quyền cho PDA",
                    "permissionList": [
                        "PDAConfig_EDIT",
                        "PDAConfig_VIEW",
                        "PDA_EDIT",
                        "PDA_VIEW"
                    ],
                    "orderNumber": 3,
                    "id": "59c21fa4bae4ba6f3d33458e",
                    "createdTime": "Sep 20, 2017 2:58:28 PM",
                    "lastUpdatedTime": "Sep 20, 2017 4:47:05 PM"
                }
            ],
            "hubIds": [
                "SGN"
            ],
            "portIds": [
                "5882d8830c28171270a6ebd6",
                "5882e1060c28171270a6ebe6",
                "5882e1550c28171270a6ebe8",
                "5882e28f0c28171270a6ebea",
                "58954a3f0c2817118cd21621",
                "58954a5b0c2817118cd21622",
                "58954a740c2817118cd21623",
                "58954a8d0c2817118cd21624",
                "58954ab50c2817118cd21625",
                "58954ac70c2817118cd21626",
                "58954ae30c2817118cd21627",
                "58954afd0c2817118cd21628",
                "58954b130c2817118cd21629",
                "58954b390c2817118cd2162a",
                "5950c47a0c28171d000cfcee"
            ],
            "secret": "ztSYIyaP59S0tA18Sd4xfPr00vds3Tq1Rplwoqi5ia3pjD3X0tO",
            "status": "ACTIVE",
            "isSupperUser": false,
            "userType": 1
        }
    }
}

const performanceResponse = {
    "status": "OK",
    "data": [
        {
            "driver_id": "210030",
            "performance_date": "Oct 12, 2017 12:00:00 AM",
            "pick_succeed": 0,
            "pick_total": 1,
            "deliver_succeed": 0,
            "deliver_total": 0,
            "return_succeed": 0,
            "return_total": 0,
            "from": 0,
            "to": 0,
            "id": "59e5808fbae4ba33ce3c4e7c",
            "createdTime": "Oct 17, 2017 11:01:19 AM",
            "lastUpdatedTime": "Oct 17, 2017 11:01:19 AM"
        },
        {
            "driver_id": "210030",
            "performance_date": "Oct 16, 2017 12:00:00 AM",
            "pick_succeed": 6,
            "pick_total": 10,
            "deliver_succeed": 1,
            "deliver_total": 1,
            "return_succeed": 0,
            "return_total": 0,
            "from": 0,
            "to": 0,
            "id": "59e5808fbae4ba33ce3c4e7d",
            "createdTime": "Oct 17, 2017 11:01:19 AM",
            "lastUpdatedTime": "Oct 17, 2017 11:01:19 AM"
        },
        {
            "driver_id": "210030",
            "performance_date": "Oct 17, 2017 12:00:00 AM",
            "pick_succeed": 0,
            "pick_total": 2,
            "deliver_succeed": 0,
            "deliver_total": 0,
            "return_succeed": 0,
            "return_total": 0,
            "from": 0,
            "to": 0,
            "id": "59e6c288bae4ba32d1ef263b",
            "createdTime": "Oct 18, 2017 9:55:04 AM",
            "lastUpdatedTime": "Oct 18, 2017 9:55:04 AM"
        }
    ],
    "total": 3,
    "message": "Query performance successfully."
}

const updateResponse = {
    "status": "OK",
    "data": {
        failed_orders: []
    },
    "message": "Successfull"
}