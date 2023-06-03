import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import styled from 'styled-components';
import { Overview } from './Overview';
import { openSans } from './NetGainGraph';

interface LayoutProps {
  children: ReactNode,
  title: string,
}

const Container = styled.div`
  width: 100%;
  display: flex;
  background: #F8F9FE;
  min-width: 1000px;
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
`

const ComponentContainer = styled.div`
  margin-top: -100px;
  height: 100%;
`

export const Layout: React.FC<LayoutProps> = ({children}) => {
  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          font-family: ${openSans.style.fontFamily};
          color: #32325D;
        }
      `}</style>
      <Container>
        <Sidebar />
        <Content>
          <Overview />
          <ComponentContainer>
            {children}
          </ComponentContainer>
        </Content>
      </Container>
    </>
  );
};