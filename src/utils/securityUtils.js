export const detectSQLInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 
    'OR', 'AND', 'WHERE', 'FROM', 'JOIN', 'EXEC', 'TRUNCATE',
    '--', ';', '\'', '"', '/*', '*/', 'XP_', 'WAITFOR'
  ];
  
  const upperInput = input.toUpperCase();
  return sqlKeywords.some(keyword => upperInput.includes(keyword));
};

export const detectScriptInjection = (input) => {
  if (typeof input !== 'string') return false;
  
  const scriptPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /onerror\s*=/gi,
    /onload\s*=/gi,
    /onclick\s*=/gi,
    /alert\(/gi,
    /eval\(/gi,
    /document\.cookie/gi
  ];
  
  return scriptPatterns.some(pattern => pattern.test(input));
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#x27;')
    .replace(/"/g, '&quot;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;');
};

export const validateInput = (input) => {
  return !detectSQLInjection(input) && !detectScriptInjection(input);
};