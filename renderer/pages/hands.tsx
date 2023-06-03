import React, { useCallback, useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { RowItem, Table } from '../components/Table';
import moment from 'moment';
import { HandContext } from '../contexts/handContext';
import { v4 as uuid } from 'uuid';
import { GetHandHistoriesRequest, SortDirection, SortableHandHistoryColumn, TablePosition } from '../../shared/models';
import { DateSliderInput, NetGainSliderInput } from '../components/inputs/SliderInput';
import { debounce } from '../../shared/utils';
import { ipcRenderer } from 'electron';
import { LoadingIcon } from '../components/LoadingIcon';

const Container = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-top: -50px;
`

const TableTitle = styled.div`
  font-size: 20px;
`

const ClearFilterButton = styled.button`
  padding: 6px 12px;
  font-size: 14px;
  background: #5E72E4;
  color: white;
  text-decoration: none;
  border-radius: 10px;
  border: none;
`

const HandNumberSearchInput = styled.input`
  border: none;
  padding: 10px 15px;
  font-size: 16px;
  margin: 5px 0;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px;
  outline: none;
  border-radius: 10px;
`

const FilterInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 33%;
  margin: 5px 30px;
`

const FilterCheckboxContainer = styled.div`
  width: 10%;
  display: flex; 
  flex-direction: column;
  justify-content: center;
`

const FilterInputLabel = styled.label`
  color: #525F7F;
  font-weight: 800;
  font-size: 14px;
`

const FilterContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  flex-wrap: wrap;
`

const PositionSelectInput = styled.select`
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px;
  outline: none;
  border-radius: 10px;
  background: white;
`

const PositionOption = styled.option`
  border: none;
`

const CheckboxInput = styled.input`
  margin: 5px 10px;
`

const FilterRangeContainer = styled.div`
  width: 80%;
  margin-bottom: 20px;
`

export const Hands: React.FC = () => {

  const { currentHands, setCurrentHands, minDate, maxDate, minNetGain, maxNetGain } = useContext(HandContext)
  const [rfi, setRfi] = useState<number>();
  const [vpip, setVpip] = useState<number>();
  const [handNumber, setHandNumber] = useState('');
  const [position, setPosition] = useState<TablePosition>();
  const [netGain, setNetGain] = useState<Array<number>>([]);
  const [date, setDate] = useState<Array<number>>([]);
  const [sortDirection, setSortDirection] = useState<SortDirection>(SortDirection.ASC);
  const [sortColumn, setSortColumn] = useState<SortableHandHistoryColumn>(SortableHandHistoryColumn.date);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
     const getHandHistoriesRequest: GetHandHistoriesRequest = {
      rfi, 
      vpip, 
      position,
      hand_number: handNumber,
      net_gain_min: netGain[0] * 100 || undefined,
      net_gain_max: netGain[1] * 100 || undefined,
      date_min: date.length > 0 ? moment(date[0]).format('YYYY-MM-DD HH:mm:ss'): undefined,
      date_max: date.length > 0 ? moment(date[1]).format('YYYY-MM-DD HH:mm:ss'): undefined,
      sort_direction: sortDirection,
      sort_column: sortColumn,
    }
    setLoading(true);
    debouncedGetHands(getHandHistoriesRequest);
  }, [rfi, vpip, position, handNumber, netGain, date, sortDirection, sortColumn])

  useEffect(() => {
    return () => {
      getHands({});
    }
  }, [])

  const clearFilters = () => {
    setRfi(undefined);
    setVpip(undefined);
    setPosition(undefined);
    setHandNumber('');
    setNetGain([minNetGain, maxNetGain]);
    setDate([minDate, maxDate]);
    setSortDirection(SortDirection.DESC);
    setSortColumn(SortableHandHistoryColumn.date);
  }


  const getHands = async (getHandHistoriesRequest: GetHandHistoriesRequest) => {
    const res = await ipcRenderer.invoke('getHandHistories', getHandHistoriesRequest)
    setCurrentHands(res)
  }

  const debouncedGetHands = useCallback(
    debounce(async (requestParams: GetHandHistoriesRequest) => {
      await getHands(requestParams)
      setLoading(false);
    }, 1000)
  , [rfi, vpip, position, handNumber, netGain, date, sortDirection, sortColumn])

  const handleColumnClick = (column: SortableHandHistoryColumn) => {
    if(column === sortColumn) {
      sortDirection === SortDirection.ASC ? setSortDirection(SortDirection.DESC): setSortDirection(SortDirection.ASC)
    }else {
      setSortColumn(column);
      setSortDirection(SortDirection.DESC);
    }
  }

  return (
    <> 
      <Head>
        <title>{"Hands"}</title>
      </Head> 
      <Container>
        <Table 
          keyExtractor={({id}) => id}
          data={currentHands}
          renderItem={({hand_number, net_gain, date, position}) => {
            return [
              <RowItem key={uuid()}>{hand_number}</RowItem>, 
              <RowItem key={uuid()} isRed={net_gain < 0} isGreen={net_gain > 0} >{net_gain >= 0 ? `+${(net_gain / 100).toFixed(2)}$`: `${(net_gain / 100).toFixed(2)}$`}</RowItem>, 
              <RowItem key={uuid()}>{moment(date).fromNow()}</RowItem>,
              <RowItem key={uuid()}>{position}</RowItem>
            ]
          }}
          renderTitles={
            () => {
              return [
                <RowItem key={uuid()}>{'hand_number'}</RowItem>, 
                <RowItem sortDirection={sortDirection} isActive={sortColumn === SortableHandHistoryColumn.net_gain} onClick={() => handleColumnClick(SortableHandHistoryColumn.net_gain)} key={uuid()}>net_gain</RowItem>, 
                <RowItem sortDirection={sortDirection} isActive={sortColumn === SortableHandHistoryColumn.date} onClick={() => handleColumnClick(SortableHandHistoryColumn.date)} key={uuid()}>date</RowItem>, 
                <RowItem key={uuid()}>{'position'}</RowItem>, 
              ]
            }
          }
        > 
          <TableTitle>Hand History</TableTitle>
          {loading ? <LoadingIcon width={'100px'}/>: null}
          <ClearFilterButton onClick={clearFilters}>Clear</ClearFilterButton>
          <FilterContainer>
            <FilterInputContainer>
              <FilterInputLabel>Hand #</FilterInputLabel>
              <HandNumberSearchInput type="text" onChange={(e) => setHandNumber(e.target.value)}></HandNumberSearchInput>
            </FilterInputContainer>
            <FilterInputContainer>
              <FilterInputLabel>Position</FilterInputLabel>
              <PositionSelectInput defaultValue={'Choose a value...'} onChange={(e) => setPosition(e.target.value as TablePosition)}>
                <PositionOption disabled={true} hidden={true}>Choose a value...</PositionOption>
                {
                  Object.keys(TablePosition).map((position: string, idx: number) => {
                    return <PositionOption key={idx}>{position}</PositionOption>
                  })
                }
              </PositionSelectInput>
            </FilterInputContainer>
            <FilterCheckboxContainer>
              <FilterInputLabel>RFI:
                <CheckboxInput type="checkbox" onChange={(e) => setRfi(e.target.checked ? 1: 0)}></CheckboxInput>
              </FilterInputLabel>
              <FilterInputLabel>VPIP:
                <CheckboxInput type="checkbox" onChange={(e) => setVpip(e.target.checked ? 1: 0)}></CheckboxInput>
              </FilterInputLabel>
            </FilterCheckboxContainer>
            {
              currentHands.length > 1 ? <FilterRangeContainer>
                <FilterInputLabel>Net Gain
                  <NetGainSliderInput
                    onChange={(value) => setNetGain(value as Array<number>)} 
                    max={maxNetGain}
                    min={minNetGain}
                    value={netGain}
                  />
                </FilterInputLabel>
              </FilterRangeContainer>: null
            }
            {
              currentHands.length > 1 ? <FilterRangeContainer>
                <FilterInputLabel>Date
                  <DateSliderInput 
                    onChange={(value) => setDate(value as Array<number>)} 
                    max={maxDate} 
                    min={minDate}
                    value={date}
                  />
                </FilterInputLabel>
              </FilterRangeContainer>: null
            }
          </FilterContainer>
        </Table>
      </Container>
    </>
  );
};

export default Hands;
