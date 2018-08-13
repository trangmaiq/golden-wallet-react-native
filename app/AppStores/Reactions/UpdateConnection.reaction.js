import { reaction } from 'mobx'


export default (appState) => {
  return reaction(
    () => appState.internetConnection,
    () => {
      if (appState.internetConnection === 'offline') return
      appState.wallets.forEach(w => {
        // update balance
      })
    })
}