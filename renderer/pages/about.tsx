import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto 100px auto;
  justify-content: center;
  min-height: 600px;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px;
  background: white;
  border-radius: 15px;
`

const About: React.FC = () => {
  return (
    <Container>About</Container>
  )
}

export default About;