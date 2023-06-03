import { ReactNode, useState } from "react";
import ReactPaginate from "react-paginate";
import styled from "styled-components";
import { SortDirection } from "../../shared/models";


interface TableProps<T> {
  data: Array<T>,
  renderItem: (item: T) => Array<ReactNode>,
  keyExtractor: (item: T) => string | number,
  renderTitles: () => Array<ReactNode>,
  children: ReactNode,
}

interface RowItemProps {
  isRed?: boolean,
  isGreen?: boolean,
  isActive?: boolean,
  sortDirection?: SortDirection,
}

const TableContainer = styled.div`
  width: 80%;
  margin: 50px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  background: white;
  background: #;
  position: relative;
  overflow: hidden;
`

const TableHeader = styled.div`
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`

const TableRow = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid #E9ECEF;
  &:hover {
    background: #E9ECEF;
    cursor: pointer;
  }
`

export const RowItem = styled.div<RowItemProps>`
  font-size: 12px;
  flex: 1;
  padding: 10px 20px;
  position: relative;
  color: ${props => props.isGreen ? '#2DCE89': props.isRed ? '#F5365C': '#32325D'};
  ::after {
    content: '${props => props.isActive ? props.sortDirection === SortDirection.ASC ? '▲': '▼': ''} ';
    position: absolute;
    left: 8px;
  }

`

const FieldNames = styled(TableRow)`
  background: #E9ECEF;
`

const PaginationContainer = styled.div`
  width: 40%;
  margin: 30px auto;
`

const MyPaginate = styled(ReactPaginate).attrs({
  activeClassName: 'active',
})`
  padding: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style-type: none;
  li a {
    border-radius: 50%;
    padding: 8px 15px;
    border: #E9ECEF 1px solid;
    cursor: pointer;
  }
  li.previous a {
    border: #E9ECEF 1px solid;
  },
  li.next a {
    border: #E9ECEF 1px solid;
  },
  li.break a {
    border-color: transparent;
  }
  li.active a {
    background-color: #5E72E4;
    border-color: transparent;
    color: white;
    min-width: 32px;
  }
  li.disabled a {
    color: grey;
  }
  li.disable,
  li.disabled a {
    cursor: default;
  }
`;

export const Table = <T extends unknown>({data, renderItem, keyExtractor, renderTitles, children}: TableProps<T>) => {

  const [itemOffset, setItemOffset] = useState<number>(0);
  const endOffset = itemOffset + 15;
  const currentItems = data.slice(itemOffset, endOffset);

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * 15) % data.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  return (
    <TableContainer>
      <TableHeader>
        {children}
      </TableHeader>
      <FieldNames>
        {
          ...renderTitles()
        }
      </FieldNames>
      {
        currentItems.length > 0 ? currentItems.map((item: T) => {
          return <TableRow key={keyExtractor(item)}>
            {
              ...renderItem(item)
            }
          </TableRow>
        }): <TableRow><RowItem>No data available...</RowItem></TableRow>
      }
      {data.length > 25 ? <PaginationContainer><MyPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={15}
        pageCount={Math.ceil(data.length / 15)}
        previousLabel="<"
      /></PaginationContainer>: null}
    </TableContainer>
  )
}