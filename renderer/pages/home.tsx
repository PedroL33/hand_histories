import React, { useState, useEffect, useContext } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import moment from 'moment';
import { NetGainGraph } from '../components/NetGainGraph';
import { RowItem, Table } from '../components/Table';
import { HandContext } from '../contexts/handContext';
import { v4 as uuid } from 'uuid';
import Link from 'next/link';

export interface GraphableData {
  net_gain: number,
  date: string,
}

const Container = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`

const TableTitle = styled.div`
  font-size: 20px;
`

const SeeMoreLink = styled(Link)`
  padding: 6px 12px;
  font-size: 14px;
  background: #5E72E4;
  color: white;
  text-decoration: none;
  border-radius: 10px;
`
 
const Home: React.FC = () => {
  const { currentHands  } = useContext(HandContext);

  useEffect(() => {
    getData();
  }, [currentHands])

  const [graphableData, setGraphableData] = useState<Array<GraphableData>>([]);

  const getData = async () => {
    const graphableData: Array<GraphableData> = currentHands.reduce((acc: any, value: any) => {
      acc.push({
        net_gain: acc[acc.length - 1] != null ? acc[acc.length -1].net_gain + value.net_gain: 0,
        date: value.date
      })
      return acc
    }, [])
    setGraphableData(graphableData)
  }

  return (
    <>
      <Head>
        <title>{"Home"}</title>
      </Head> 
      <Container>
        <NetGainGraph data={graphableData} />
        <Table 
          data={currentHands.slice(currentHands.length - 5)}
          keyExtractor={({id}) => id}
          renderItem={({hand_number, net_gain, date}) => 
            [
              <RowItem key={uuid()}>{hand_number}</RowItem>, 
              <RowItem key={uuid()}>{net_gain}</RowItem>, 
              <RowItem key={uuid()}>{moment(date).fromNow()}</RowItem>
            ]
          }
          renderTitles={
            () => {
              return [
                <RowItem key={uuid()}>{'hand_number'}</RowItem>, 
                <RowItem key={uuid()}>{'net_gain'}</RowItem>, 
                <RowItem key={uuid()}>{'date'}</RowItem>,
              ]
            }
          }
        >
          <TableTitle>Recent Hands</TableTitle>
          <SeeMoreLink href={'/hands'}>See More...</SeeMoreLink>
        </Table>
      </Container>
    </>
  );
};

export default Home;
