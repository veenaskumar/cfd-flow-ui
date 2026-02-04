import { apiClient } from "@/api/client";
import { NewChatRequest,NewChatResponse, AnalyzeDefectRequest,AnalyzeDefectResponse,DetectionLogicRequest,DetectionLogicResponse } from "@/types/newChat.type";
import { API_ENDPOINTS } from "@/api/endpoints";

// create a new chat
export const newChat = async(request: NewChatRequest): Promise<NewChatResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.NEW_CHAT, request);
  return response.data;
}

// analyse defect
export const analyzeDefect = async(request: AnalyzeDefectRequest): Promise<AnalyzeDefectResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.ANALYZE_DEFECT, request);
  return response.data;
}

// detection logic
export const detectionLogic = async(request: DetectionLogicRequest): Promise<DetectionLogicResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.DETECTION_LOGIC, request);
  return response.data;
}