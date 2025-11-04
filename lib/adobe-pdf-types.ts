// Adobe PDF Embed API global types
declare global {
  interface Window {
    AdobeDC?: {
      View: new (config: any) => any;
      Enum: {
        CallbackType: {
          SAVE_API: string;
          GET_USER_PROFILE_API: string;
        };
        ApiResponseCode: {
          SUCCESS: string;
          FAIL: string;
          FILE_MODIFIED: string;
        };
      };
    };
  }
}

export {};
