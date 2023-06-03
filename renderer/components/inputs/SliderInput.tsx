import moment from "moment";
import ReactSlider from "react-slider";
import styled from "styled-components";

interface SliderInputProps {
  onChange: (value: number | readonly number[]) => void,
  max: number, 
  min: number, 
  value: Array<number>,
}

const StyledSlider = styled(ReactSlider)`
    width: 100%;
    height: 10px;

`;

const StyledThumb = styled.div`
    height: 15px;
    line-height: 15px;
    width: 15px;
    margin-top: -2.5px;
    text-align: center;
    background: #5E72E4;
    border-radius: 50%;
    cursor: grab;
    position: relative;
`;

const ThumbValue = styled.div`
  position: absolute;
  top: 15px;
  left: -50%;
  width: 200px;
  margin-left: -100px;
  color: #32325D;
`

const NetGainThumbValue = styled(ThumbValue)`
  ::before {
    content: '$';
  }
`

interface StyledTrackProps {
  index: number,
}
const StyledTrack = styled.div<StyledTrackProps>`
    top: 0;
    bottom: 0;
    background: ${props => (props.index === 1 ? '#5E72E4' : '#ddd')};
    border-radius: 999px;
`;

const Track = (props: any, state: any) => <StyledTrack {...props} index={state.index} />;

const NetGainThumb = (props: any, state: any) => <StyledThumb {...props}><NetGainThumbValue>{state.valueNow.toFixed(2)}</NetGainThumbValue> </StyledThumb>;

export const NetGainSliderInput: React.FC<SliderInputProps> = ({onChange, max, min, value}) => {
  return (
    <StyledSlider value={value} pearling minDistance={5} step={.1} max={max/100} min={min/100} defaultValue={[min/100, max/100]} onChange={onChange} renderTrack={Track} renderThumb={NetGainThumb} />
  )
}

const DateThumb = (props: any, state: any) => <StyledThumb {...props}><ThumbValue>{moment(state.valueNow).format('MM/DD/YY, h:mm a')}</ThumbValue> </StyledThumb>;


export const DateSliderInput: React.FC<SliderInputProps> = ({onChange, max, min, value}) => {
  return (
    <StyledSlider value={value} pearling minDistance={5} step={.1} max={max} min={min} defaultValue={[min, max]} onChange={onChange} renderTrack={Track} renderThumb={DateThumb} />
  )
}