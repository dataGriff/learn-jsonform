import { useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import {
  Container,
  Tabs,
  Tab,
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { cheeseSchema, cheeseUiSchema } from './forms/cheese';
import { whiskeySchema, whiskeyUiSchema } from './forms/whiskey';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

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
      id={`form-tabpanel-${index}`}
      aria-labelledby={`form-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [cheeseData, setCheeseData] = useState({});
  const [whiskeyData, setWhiskeyData] = useState({});

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSubmit = (formType: string, data: object) => {
    console.log(`${formType} form submitted:`, data);
    alert(`${formType} form data submitted! Check console for details.`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          JSON Forms Demo
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          A learning exercise with cheese and whiskey forms
        </Typography>

        <Paper elevation={3} sx={{ mt: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="form selection tabs"
              centered
            >
              <Tab label="🧀 Cheese Form" id="form-tab-0" aria-controls="form-tabpanel-0" />
              <Tab label="🥃 Whiskey Form" id="form-tab-1" aria-controls="form-tabpanel-1" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              Cheese Information
            </Typography>
            <JsonForms
              schema={cheeseSchema}
              uischema={cheeseUiSchema}
              data={cheeseData}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data }) => setCheeseData(data)}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit('Cheese', cheeseData)}
              >
                Submit Cheese Form
              </Button>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>
              Whiskey Information
            </Typography>
            <JsonForms
              schema={whiskeySchema}
              uischema={whiskeyUiSchema}
              data={whiskeyData}
              renderers={materialRenderers}
              cells={materialCells}
              onChange={({ data }) => setWhiskeyData(data)}
            />
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit('Whiskey', whiskeyData)}
              >
                Submit Whiskey Form
              </Button>
            </Box>
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Current Form Data (JSON):
          </Typography>
          <Paper sx={{ p: 2, bgcolor: 'grey.100' }}>
            <pre style={{ margin: 0, overflow: 'auto' }}>
              {JSON.stringify(
                tabValue === 0 ? cheeseData : whiskeyData,
                null,
                2
              )}
            </pre>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
