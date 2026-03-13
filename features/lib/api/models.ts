
// src/api/models.ts
export interface GetUsersReq {
  rqUID: string;
  channelId: string;
  orgId: string;
  subOrgId: string;
  apiName: string;
}

export interface GetUsersReqEnvelope {
  getUsersReq: GetUsersReq;
}


export interface GetEntitlementReq {
  rqUID: string;
  channelType: string;
  qs: string;
  key: string;
}

export interface GetEntitlementReqEnvelope {
  getEntitlement: GetEntitlementReq;
}

export interface GetUserIDAvailReq {
  orgId: string;
  userId: string;
}

export interface GetUserIDAvailReqEnvelope {
  getUserIDavailReq: GetUserIDAvailReq;
}

export interface GetUserIDAvailRes {
  orgId: string;
  userId: string;
  isAvailable: boolean;
  message: string;
  returnStatus: string;
  returnCode: string;
  errorCode: string;
}