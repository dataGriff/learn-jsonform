import React, { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers, materialCells } from '@jsonforms/material-renderers';
import { 
  CssBaseline, 
  ThemeProvider, 
  createTheme, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  Paper,
  Alert,
  Button
} from '@mui/material';
import { getTenantConfig } from './config/tenant';
import type { TenantConfig } from './config/tenant';
import { FormRegistry } from './forms/registry';
import type { FormDefinition } from './forms/registry';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [loadedForms, setLoadedForms] = useState<Map<string, FormDefinition>>(new Map());
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const initializeTenant = () => {
      // Wait for window.ENV to be available
      if (!(window as any).ENV) {
        setTimeout(initializeTenant, 100);
        return;
      }
      
      const config = getTenantConfig();
      setTenantConfig(config);
      
      // Load all configured forms
      const loadForms = async () => {
        const forms = new Map<string, FormDefinition>();
        const errors: string[] = [];
        
        for (const formName of config.forms) {
          try {
            const formDef = await FormRegistry.loadForm(formName);
            forms.set(formName, formDef);
            setFormData(prev => ({ ...prev, [formName]: {} }));
          } catch (error) {
            errors.push(formName);
            console.error(`Failed to load form ${formName}:`, error);
          }
        }
        
        setLoadedForms(forms);
        
        if (errors.length > 0) {
          setLoadError(`Failed to load forms: ${errors.join(', ')}`);
        }
      };

      loadForms();
    };

    initializeTenant();
  }, []);

  if (!tenantConfig) {
    return <div>Loading tenant configuration...</div>;
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: tenantConfig.theme?.primaryColor || '#1976d2',
      },
      secondary: {
        main: tenantConfig.theme?.secondaryColor || '#dc004e',
      },
    },
  });

  const handleFormDataChange = (formName: string) => (data: any) => {
    setFormData(prev => ({
      ...prev,
      [formName]: data
    }));
  };

  const handleSubmit = (formName: string) => () => {
    console.log(`${formName} form data:`, formData[formName]);
    alert(`${formName} form submitted! Check console for data.`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          {tenantConfig.name} - JSON Forms
        </Typography>
        
        {loadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loadError}
          </Alert>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            aria-label="form tabs"
          >
            {tenantConfig.forms.map((formName, index) => {
              const formDef = loadedForms.get(formName);
              return (
                <Tab 
                  key={formName}
                  label={formDef?.label || formName}
                  id={`form-tab-${index}`}
                  aria-controls={`form-tabpanel-${index}`}
                />
              );
            })}
          </Tabs>
        </Box>

        {tenantConfig.forms.map((formName, index) => {
          const formDef = loadedForms.get(formName);
          
          if (!formDef) {
            return (
              <TabPanel key={formName} value={activeTab} index={index}>
                <Alert severity="error">
                  Form "{formName}" could not be loaded.
                </Alert>
              </TabPanel>
            );
          }

          return (
            <TabPanel key={formName} value={activeTab} index={index}>
              <Box display="flex" gap={3}>
                <Box flex={1}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      {formDef.label} Form
                    </Typography>
                    <JsonForms
                      schema={formDef.schema}
                      uischema={formDef.uischema}
                      data={formData[formName] || {}}
                      renderers={materialRenderers}
                      cells={materialCells}
                      onChange={({ data }) => handleFormDataChange(formName)(data)}
                    />
                    <Box mt={2}>
                      <Button 
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit(formName)}
                        sx={{ mt: 2 }}
                      >
                        Submit {formDef.label}
                      </Button>
                    </Box>
                  </Paper>
                </Box>
                
                <Box flex={1}>
                  <Paper elevation={2} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      JSON Preview
                    </Typography>
                    <pre style={{ 
                      overflow: 'auto', 
                      backgroundColor: '#f5f5f5', 
                      padding: '16px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}>
                      {JSON.stringify(formData[formName] || {}, null, 2)}
                    </pre>
                  </Paper>
                </Box>
              </Box>
            </TabPanel>
          );
        })}
      </Container>
    </ThemeProvider>
  );
}

export default App;
