import { configure } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import './_mutationObserverHack.js'

configure({ adapter: new Adapter() })
