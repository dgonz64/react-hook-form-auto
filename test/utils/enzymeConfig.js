import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import './_mutationObserverHack.js'

configure({ adapter: new Adapter() })
