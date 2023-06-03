import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { openSans } from './NetGainGraph';
import { faHouse, faHands, faUpload, faBookOpenReader, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface SidebarIconProps {
  icon: IconProp,
  color: string,
}

const Container = styled.div`
  height: auto;
  min-height: 100vh;
  background: #FFFFFF;
  display: flex;
  flex-direction: column;
  width: 250px;
  padding-top: 100px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  align-items: center;
`;

const StyledLink = styled.div`
  font-family: ${openSans.style.fontFamily};
`;

const SidebarElement = styled(Link)`
  color: #787878;
  width: 190px;
  padding: 10px 20px;
  margin: 5px;
  display: flex;
  align-items: center;
  text-decoration: none;
  border-radius: 5px;
  transition: background .3s ease;
  :hover {
    background: #5E72E4;
    color: white;
  }
`;

const SidebarIcon = styled(FontAwesomeIcon)<SidebarIconProps>`
  color: ${props => props.color};
  width: 25px;
  height: 25px;
  background-size: 100% auto;
  background-position: center;
  margin-right: 15px;
`

const StyledHr = styled.hr`
  margin: 50px 0;
  height: 1px;
  width: 90%;
  background-color: #ededed;
`

export const Sidebar: React.FC = () => {
  return <Container>
    <SidebarElement href={'/home'}>
      <SidebarIcon icon={faHouse} color={'#F3A4B5'}/>
      <StyledLink>Home</StyledLink>
    </SidebarElement>
    <SidebarElement href={'/hands'}>
      <SidebarIcon icon={faHands} color={'#FB6340'}/>
      <StyledLink>Hands</StyledLink>
    </SidebarElement>
    <SidebarElement href={'/upload'}>
      <SidebarIcon icon={faUpload} color={'#11CDEF'}/>
      <StyledLink>Upload</StyledLink>
    </SidebarElement>
    <StyledHr />
    <SidebarElement href={'/about'}>
      <SidebarIcon icon={faInfoCircle} color={'#8898AA'}/>
      <StyledLink>About</StyledLink>
    </SidebarElement>
  </Container>
}