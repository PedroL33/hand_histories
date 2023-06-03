import styled, {keyframes} from 'styled-components';
import SpinnerIcon from '../public/images/Spinner.svg'

export interface LoadingIconProps {
  width: string; 
}

export interface ContainerProps {
  width: string,
}

interface SpinnerProps {
  url: string;
}

const spin = keyframes`
  from {transform: rotate(0);}
  to   {transform: rotate(360deg);}
}`

const Container = styled.div<ContainerProps>`
  background: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Spinner = styled.div<SpinnerProps>`
  background-image: url("${props => props.url}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% auto;
  animation: ${spin} 1s linear infinite;
  position: absolute;
  width: 2vw; 
  height: 2vw;
  max-width: 25px;
  max-height: 25px;
`

const SpinnerPadding = styled.div`
  padding-top: 100%;
`

export const LoadingIcon: React.FC<LoadingIconProps> = ({width}) => {
  return (
    <Container width={width}>
      <Spinner url={SpinnerIcon.src}>
        <SpinnerPadding />
      </Spinner>
    </Container>
  )
}