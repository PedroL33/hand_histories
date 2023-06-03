import styled from 'styled-components';
import { OverviewCard } from './OverviewCard';
import icon from '../../resources/icon.ico';
import { openSans } from './NetGainGraph';
import { faSearch, faChartLine, faHands, faDollarSign, faStairs } from '@fortawesome/free-solid-svg-icons'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { getNetGainFromHands, getRfiFromHands, getVpipFromHands } from '../../shared/utils';
import { HandContext } from '../contexts/handContext';

const OverviewContainer = styled.div`
  width: 100%;
  background: #5E72E4;
  padding: 50px 0 200px 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-family: ${openSans.style.fontFamily};
`

const OverviewContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
`

const OverviewTitle = styled.div`
  font-size: 16px;
  margin: 0 0 50px 50px;
  color: white;
`

export const Overview: React.FC = () => {

  const { currentHands } = useContext(HandContext);

  useEffect(() => {
    setVpip(getVpipFromHands(currentHands));
    setTotal(currentHands.length)
    setRfi(getRfiFromHands(currentHands));
    setNetGain(getNetGainFromHands(currentHands));
  }, [currentHands])

  const [vpip, setVpip] = useState<number>(0);
  const [rfi, setRfi] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [netGain, setNetGain] = useState<number>(0);

  return (
    <OverviewContainer>
      <OverviewTitle>OVERVIEW</OverviewTitle>
      <OverviewContent>
        <OverviewCard title={"VPIP %"} value={`${vpip.toFixed(2)}%`} icon={faChartLine} iconColor={"#F5365C"} />
        <OverviewCard title={"HANDS PLAYED"} value={`${total}`} icon={faHands} iconColor={"#FB6340"} />
        <OverviewCard title={"RFI %"} value={`${rfi.toFixed(2)}%`} icon={faStairs} iconColor={"#FFD600"} />
        <OverviewCard title={"NET GAIN"} value={`${(netGain).toFixed(2)}$`} icon={faDollarSign} iconColor={"#11CDEF"} />
      </OverviewContent>
    </OverviewContainer>
  )
}