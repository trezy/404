// Module imports
import { useContext } from 'react'





// Local imports
import { MapEditorContext } from './MapEditorContext.js'





/**
 * @returns {object} The application's authentication context.
 */
export const useMapEditorContext = () => useContext(MapEditorContext)
