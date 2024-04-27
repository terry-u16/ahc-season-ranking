import { useState, type FC } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { type WasmInput, type User } from '../../types';
import Individual from '../Individual';
import Standings from '../Standings';

interface MainTabProps {
  users: User[];
  wasmInput: WasmInput;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box py={1}>{children}</Box>}
    </div>
  );
}

const MainTab: FC<MainTabProps> = (props) => {
  const { users, wasmInput } = props;
  const [tabValue, setTabValue] = useState(0);
  const [selectedUser, setSelectedUser] = useState('');

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label="順位"
            id="main-tab-standings"
            aria-controls="mani-tabpanel-standings"
          />
          <Tab
            label="個人成績"
            id="main-tab-individual"
            aria-controls="mani-tabpanel-individual"
          />
        </Tabs>
      </Box>
      <CustomTabPanel value={tabValue} index={0}>
        <Standings
          users={props.users}
          onSelectionChange={(users) => {
            setSelectedUser(users[0]?.toString() ?? '');
          }}
        />
      </CustomTabPanel>
      <CustomTabPanel value={tabValue} index={1}>
        <Individual
          users={users}
          userName={selectedUser}
          wasmInput={wasmInput}
        />
      </CustomTabPanel>
    </Box>
  );
};

export default MainTab;
