import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom/extend-expect'; // https://github.com/testing-library/jest-dom/issues/442#issuecomment-1146705664
import { configure } from 'enzyme';

import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'jest-canvas-mock';
import './i18n';

configure({ adapter: new Adapter() });
