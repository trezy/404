// Module imports
import { useContext } from 'react'





// Local imports
import { ResourcepackEditorContext } from './ResourcepackEditorContext.js'





/**
 * @returns {object} The application's authentication context.
 */
export const useResourcepackEditorContext = () => useContext(ResourcepackEditorContext)
