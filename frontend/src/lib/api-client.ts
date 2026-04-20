/**
 * Determina la URL base de la API dependiendo del entorno de ejecución.
 * Resuelve el problema de red aislando el tráfico de Docker del tráfico del navegador.
 */
const getBaseUrl = () => {
    if (typeof window === 'undefined') {
      // Entorno de Servidor (Docker Container): Usa la red interna
      return process.env.API_URL_INTERNAL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    }
    // Entorno de Cliente (Navegador): Usa la URL expuesta
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  };
  
  export async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
  
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  
    if (!res.ok) {
      let errorMessage = 'Error en la comunicación con el servidor';
      
      try {
        const errorText = await res.text();
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.title || JSON.stringify(errorData.errors) || errorMessage;
      } catch {
        errorMessage = `Error del servidor (${res.status})`;
      }
  
      throw new Error(errorMessage);
    }
  
    if (res.status === 204) return {} as T;
    
    return res.json() as Promise<T>;
  }