import type { FC } from 'react';
import { useState, useEffect } from 'react';
import init from '../../public/wasm/wasm';
import MainView from './MainView';

const InitWasm: FC = () => {
  const [wasmInitialized, setWasmInitialized] = useState(false);

  useEffect(() => {
    const initFunc = async () => {
      await init();
      setWasmInitialized(true);
    };
    initFunc().catch((e) => {
      console.log(e);
    });
  }, []);

  return wasmInitialized ? <MainView /> : <></>;
};

export default InitWasm;
