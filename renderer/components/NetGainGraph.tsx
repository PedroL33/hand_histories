import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label, Text } from 'recharts';
import moment from 'moment';
import styled from 'styled-components';
import { Open_Sans } from 'next/font/google';
import { GraphableData } from '../pages/home';

export interface NetGainGraphProps {
  data: Array<GraphableData>
}

export const openSans = Open_Sans({
  weight: '400',
  subsets: ['latin'],
});

const ChartContainer = styled.div`
  background: #32325D;
  padding: 100px 20px 40px 0px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content:center;
  position: relative;
  width: 80%;
  font-family: ${openSans.style.fontFamily};
`

const ChartTitle = styled.div`
  position: absolute;
  color: white;
  font-size: 20px;
  top: 35px;
  left: 60px;
  font-weight: 800;
`

const StyledResponsiveContianer = styled(ResponsiveContainer)`
  display: flex;
  align-items: center;
  justify-content:center;
  min-height: 300px;
`

const UnavailableContainer = styled.div`
  color: white;
`

export const NetGainGraph: React.FC<NetGainGraphProps> = ({data}) => {

  return (
    <ChartContainer>
      <ChartTitle>Net Gain</ChartTitle>
      <StyledResponsiveContianer width='90%' aspect={3}>
        {
          data.length > 0 ? <LineChart data={data}>
            <XAxis axisLine={false} tickSize={0} stroke={'#E1E4E7'} tickFormatter={(value) => moment(value).format('HH:mm:ss')} tickMargin={20} dataKey='date' ticks={data.length ? [data[0].date, data[Math.round(data.length/2)].date, data[data.length - 1].date]: []}/>
            <YAxis axisLine={false} tickSize={0} stroke={'#E1E4E7'} tickFormatter={(value) => `$${value/100}`}  tickMargin={20} dataKey="net_gain"/>
            <Tooltip />
            <Line type="monotone" dataKey="net_gain" stroke="#5E72E4" strokeWidth={5} dot={false}/>
          </LineChart>: <UnavailableContainer>No data available...</UnavailableContainer>
        }
      </StyledResponsiveContianer>
    </ChartContainer>
  )
}