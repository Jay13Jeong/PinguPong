import { useContext } from 'react';
import styled from 'styled-components';
import Contexts from '../../context/Contexts';
import palette from '../../style/palette';

const Container = styled.div`
  span {
    margin-top: 15px;
    display: block;
    font-size: 13px;
    color: ${palette.grayBlue};
    margin-bottom: 3px;
  }
  select {
    width: 100%;
    height: 30px;
    padding-left: 10px;
    background-color: white;
    border-radius: 4px;
    outline: none;
    color: ${palette.grayBlue};
    font-size: 15px;
    border: none;
    border-bottom: 1px solid ${palette.grayBlue};
  }
  .errorMessage {
    font-size: 12px;
    font-weight: normal;
    color: ${palette.red};
    margin: 5px 0;
  }
`;

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  title?: string;
  options?: string[];
  disabledOptions?: string[];
  isValid?: boolean;
  useValidation?: boolean;
  errorMessage?: string;
}

export default function Select({
  title,
  options = [],
  disabledOptions = [],
  isValid,
  useValidation = true,
  errorMessage = '값을 입력하세요.',
  ...props
}: IProps) {
  //폼 제출할 때 validationMode를 true 로 바꿔서 유효값이 들어갔는지 판단하기위한 것
  const { state } = useContext(Contexts);

  return (
    <Container>
      <label>
        {title && <span>{title}</span>}
        <select {...props}>
          {disabledOptions.map((option, i) => (
            <option value={option} key={i} disabled>
              {option}
            </option>
          ))}
          {options.map((option, i) => (
            <option value={option} key={i}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {useValidation && state.validationMode && !isValid && (
        <div className="errorMessage">
          <p>{errorMessage}</p>
        </div>
      )}
    </Container>
  );
}
