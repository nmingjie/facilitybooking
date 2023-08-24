import request from '../request';

interface AnnoucementParams {
  code: string,
  type: string,
  subject: string,
  content: string,
  startTime:Date,
  endTime:Date,
  maintenanceStartDate:Date,
  maintenanceEndDate:Date,
  maintenanceStartTime:Date,
  maintenanceEndTime: Date,
  isDisabled: Boolean,
  status?: string | undefined,
}
export const getAnnoucementsApi = () => {
  const url = '/api/annoucements';
  return request.get(url);
};
export const createAnnoucementApi = (query: AnnoucementParams) => {
  const url = '/api/annoucements';
  return request.post(url,query);
};
export const getAnnoucementByCodeApi = (code:string) => {
  const url = `/api/annoucements/${code}`;
  return request.get(url);
};
export const updateAnnoucementApi = (query: AnnoucementParams) => {
  const url = `/api/annoucements/${query.code}`;
  return request.put(url, query);
};
export const deleteAnnoucementApi = (code:string) => {
  const url = `/api/annoucements/${code}`;
  return request.delete(url);
};
