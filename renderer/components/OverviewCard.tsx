import styled from "styled-components"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface CardIconProps {
  iconColor: string,
};

interface OverviewCardProps {
  title: string,
  value: string,
  icon: IconProp,
  iconColor: string,
}

const Container = styled.div`
  width: 20%;
  border-radius: 5px;
  height: 100px;
  display: flex;
  background: white;
  position: relative;
`

const CardTitle = styled.div`
color: #8898AA;

`

const CardValue = styled.div`
  color: #32325D;
`

const IconContainer = styled.div<CardIconProps>`
  width: 40px;
  height: 40px;
  background: ${props => props.iconColor};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Body = styled.div`
  padding: 20px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`

const Values = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const OverviewCard: React.FC<OverviewCardProps> = ({title, value, icon, iconColor}) => {
  return (
    <Container>
      <Body>
        <Values>
          <CardTitle>{title}</CardTitle>
          <CardValue>{value}</CardValue>
        </Values>
        <IconContainer iconColor={iconColor}>
          <FontAwesomeIcon icon={icon} style={{color: "#FFFFFF"}} />
        </IconContainer>
      </Body>
    </Container>
  )
}