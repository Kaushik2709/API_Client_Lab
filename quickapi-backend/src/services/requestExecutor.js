import axios from 'axios';

export const executeRequest = async (requestConfig) => {
  const startTime = Date.now();
  
  try {
    // 1. Build headers
    const requestHeaders = requestConfig.headers ? 
      requestConfig.headers.reduce((acc, curr) => {
        if (curr.key) acc[curr.key] = curr.value;
        return acc;
      }, {}) : {};

    // 2. Safely handle body
    let requestData = requestConfig.body;
    
    // If it's a string that looks like JSON, try to parse it
    if (typeof requestData === 'string' && requestData.trim().startsWith('{')) {
      try {
        requestData = JSON.parse(requestData);
      } catch (e) {
        // Not valid JSON, send as raw string
      }
    }

    const response = await axios({
      method: requestConfig.method,
      url: requestConfig.url,
      headers: requestHeaders,
      data: requestData,
      timeout: 30000,
      validateStatus: () => true 
    });
    
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      error: error.message,
      responseTime: Date.now() - startTime
    };
  }
};
