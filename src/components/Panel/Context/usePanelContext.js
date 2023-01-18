// Module imports
import { useContext } from 'react'





// Local imports
import { PanelContext } from './PanelContext.js'





/**
 * @returns {object} The application's authentication context.
 */
export const usePanelContext = () => useContext(PanelContext)
