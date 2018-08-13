import { reaction } from 'mobx'


export default (appState) => {
  return reaction(
    () => appState.config,
    () => {
      console.log('Update config')
      appState.wallets.forEach(w => {
        // update balance
      })
    })
}