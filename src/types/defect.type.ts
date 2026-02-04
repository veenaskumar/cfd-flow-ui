// set defect path response type

export type DefectPathResponse = {
    success: boolean;
    message: string;
    defect_directory: string;
};

// set defect path request type

export type SetDefectPathRequest = {
    path: string;
}

// list defects response type

export type ListDefectsResponse = {
    success: boolean;
    message: string;
    error : string | null;
};

