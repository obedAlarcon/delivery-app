// Funciones puras de transformación de texto (No dependen de Angular)
export function snakeToCamel(str: string): string {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', '')
  );
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Recorre objetos y arrays recursivamente para transformar sus claves
export function transformKeys(obj: any, transformer: (str: string) => string): any {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => transformKeys(item, transformer));
  
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = transformer(key);
    acc[newKey] = transformKeys(obj[key], transformer);
    return acc;
  }, {} as any);
}