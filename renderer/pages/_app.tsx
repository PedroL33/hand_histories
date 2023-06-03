import { Layout } from "../components/Layout";
import type { AppProps } from 'next/app'
import { HandContext, HandContextState } from "../contexts/handContext";
import { useEffect, useState } from "react";
import { HandHistory } from "../../shared/models";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css';
import { ipcRenderer } from "electron";

export default function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    getHands();
  }, [])

  const [currentHands, setCurrentHands] = useState<Array<HandHistory>>([]);
  const [minDate, setMinDate] = useState<number>(0);
  const [maxDate, setMaxDate] = useState<number>(0);
  const [minNetGain, setMinNetGain] = useState<number>(0);
  const [maxNetGain, setMaxNetGain] = useState<number>(0);

  const getHands = async () => {
    const data: Array<HandHistory> = await ipcRenderer.invoke('getHandHistories', {})
    setCurrentHands(data);
    setMinDate(Math.min(...Object.values(data.map((hand) => new Date(hand.date).getTime()))) - 100);
    setMaxDate(Math.max(...Object.values(data.map((hand) => new Date(hand.date).getTime()))) + 100);
    setMinNetGain(Math.min(...Object.values(data.map((hand) => hand.net_gain))) - 100);
    setMaxNetGain(Math.max(...Object.values(data.map((hand) => hand.net_gain))) + 100);
  }

  const value: HandContextState = {
    currentHands,
    setCurrentHands,
    maxDate,
    setMaxDate,
    minDate,
    setMinDate,
    minNetGain,
    setMinNetGain,
    maxNetGain,
    setMaxNetGain,
  }

  return (
    <HandContext.Provider value={value}>
      <ToastContainer />
      <Layout title={"App"}>
          <Component {...pageProps} />
      </Layout>
    </HandContext.Provider>
  );
}