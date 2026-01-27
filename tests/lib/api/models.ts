
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

// If you know the response shape, define it here for strong typing.
// export interface GetUsersResEnvelope {
//   getUsersRes: {
//     // <-- fill with actual fields when known
//   };
// }

export interface GetEntitlementReq {
  rqUID: string;
  channelType: string;
  qs: string;
  key: string;
}

export interface GetEntitlementReqEnvelope {
  getEntitlement: GetEntitlementReq;
}
