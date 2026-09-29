
export interface ValidationError {
    path: string;
    message: string
}

export interface ApiResponse<T = void> {
    success: boolean;
    message: string;
    data?: T;
    zodError?: ValidationError[]
    navigation?: string
}
