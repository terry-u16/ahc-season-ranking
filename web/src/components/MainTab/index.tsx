import { useState, type FC } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { type User } from '../../types';
import Standings from '../Standings';

interface MainTabProps {
  users: User[];
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
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
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
      <CustomTabPanel value={value} index={0}>
        <Standings users={props.users} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
};

export default MainTab;
