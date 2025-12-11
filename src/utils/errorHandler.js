import { detectSQLInjection, detectScriptInjection } from './securityUtils';

class ErrorHandler {
  constructor() {
    this.errors = [];
  }

  addError(error, type = 'general') {
    const errorObj = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      message: error.message || String(error),
      type,
      timestamp: new Date().toISOString(),
      stack: error.stack
    };
    
    this.errors.push(errorObj);
    console.error(`[${type.toUpperCase()}]`, error);
    
    return errorObj;
  }

  addSecurityError(input, fieldName = 'input') {
    let errorType = 'security';
    let message = `Potential security issue detected in ${fieldName}`;
    
    if (detectSQLInjection(input)) {
      errorType = 'sql_injection';
      message = `SQL injection attempt detected in ${fieldName}`;
    } else if (detectScriptInjection(input)) {
      errorType = 'script_injection';
      message = `Script injection attempt detected in ${fieldName}`;
    }
    
    const error = new Error(message);
    return this.addError(error, errorType);
  }
  getErrors() {
    return this.errors;
  }
  getErrorsByType(type) {
    return this.errors.filter(error => error.type === type);
  }
  clearErrors() {
    this.errors = [];
  }
  clearError(id) {
    this.errors = this.errors.filter(error => error.id !== id);
  }
}
const errorHandler = new ErrorHandler();

export default errorHandler;