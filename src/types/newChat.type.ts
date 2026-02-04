// New chat request type
export type NewChatRequest = {
    keep_system: boolean;
};

// New chat response type
export type NewChatResponse = {
    success: boolean;
    message: string;
};

// analyse defect request type
export type AnalyzeDefectRequest = {
    defect_id: string;
    user_query:string;
};

// analyze defect response type
export type AnalyzeDefectResponse = {
    success: boolean;
    defect_id: string;
    response: string;
    error: string | null;
};

// detection logic response type
export type DetectionLogicResponse = {
    success: boolean;
    defect_id: string;
    response: string;
    error: string | null;
};

// detection logic request type
export type DetectionLogicRequest = {
    defect_id: string;
    user_query:string;
};