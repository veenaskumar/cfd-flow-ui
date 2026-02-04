import { apiClient } from "@/api/client";
import { SetDefectPathRequest,DefectPathResponse,ListDefectsResponse } from "@/types/defect.type";
import { API_ENDPOINTS } from "@/api/endpoints";

// set defect path
export const setDefectPath = async(request: SetDefectPathRequest): Promise<DefectPathResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.SET_DEFECT_PATH, request);
  return response.data;
}

// list of defects
export const listDefects = async(): Promise<ListDefectsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.LIST_DEFECTS);
  return response.data;
}

