import { createGlobalStyle } from 'styled-components';

const DynamicGlobalStyle = createGlobalStyle`
  @font-face {
    font-family: '${props => props.fontFamily}';
    src: url('/fonts/${props => props.fontFamily}.TTF') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  .dynamic-font {
    font-family: '${props => props.fontFamily}', sans-serif;
    text-align: right;
    line-height: 2.5;
  }
`;

export default DynamicGlobalStyle;
    