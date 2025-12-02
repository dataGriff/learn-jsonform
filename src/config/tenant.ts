export interface TenantConfig {
  name: string;
  forms: string[];
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
  };
}

export const getTenantConfig = (): TenantConfig => {
  // Try window.ENV first (Docker runtime), then import.meta.env (dev)
  const windowEnv = (window as any).ENV || {};
  
  const formsEnv = windowEnv.TENANT_FORMS || 
                   import.meta.env.VITE_TENANT_FORMS || 
                   'whiskey,cheese';
                   
  const nameEnv = windowEnv.TENANT_NAME || 
                  import.meta.env.VITE_TENANT_NAME || 
                  'Default Company';

  return {
    name: nameEnv,
    forms: formsEnv.split(',').map((form: string) => form.trim()),
    theme: {
      primaryColor: windowEnv.TENANT_PRIMARY_COLOR || 
                   import.meta.env.VITE_TENANT_PRIMARY_COLOR || 
                   '#1976d2',
      secondaryColor: windowEnv.TENANT_SECONDARY_COLOR || 
                     import.meta.env.VITE_TENANT_SECONDARY_COLOR || 
                     '#dc004e',
    }
  };
};